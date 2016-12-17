const io = require('socket.io-client');
const RoutingContext = require('../client/src/routing-context');
var UserAPI = require('./fluentapi/user-api');
var TestAPI = require('./fluentapi/test-api');

const userAPI = UserAPI(inject({
    io,
    RoutingContext
}));

const testAPI = TestAPI(inject({
    io,
    RoutingContext
}));

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('User Tictactoe load test', function(){

  const count = 100;
  const timelimit = 25000;

  beforeEach(function (done) {
      var testapi = testAPI();
      testapi.waitForCleanDatabase().cleanDatabase().then(()=> {
          testapi.disconnect();
          done();
      });
  });

  it('should create and play ' + count + '  games within '+ timelimit +'ms',function(done){
    var startMillis = new Date().getTime();
    var users = Array(count);
    for(var i = 0; i < count; i++) {
      var userA, userB;
      userA = userAPI();
      userB = userAPI();
      users.push(userA);
      users.push(userB);

      userA.createGame().then(()=> {
            userB.joinGame(userA.getGame().gameId).then(function () {
                userA.placeMove(0, 0).then(()=> {
                    userB.placeMove(1, 0).then(()=> {
                        userA.placeMove(1, 1).then(()=> {
                            userB.placeMove(0, 2).then(()=> {
                                userA.placeMove(2, 2)
                            })
                        })
                    });
                })
            })
      })
    }

    // Create users for the last test
    var userA = userAPI();
    var userB = userAPI();
    users.push(userA);
    users.push(userB);
    userA.expectGameCreated().createGame().then(()=> {
            userB.expectGameJoined().joinGame(userA.getGame().gameId).then(function () {
                userA.expectMoveMade().placeMove(0, 0).then(()=> {
                    userA.expectMoveMade();
                    userB.expectMoveMade().placeMove(1, 0).then(()=> {
                        userB.expectMoveMade(); // By other user
                        userA.expectMoveMade().placeMove(1, 1).then(()=> {
                            userA.expectMoveMade(); // By other user
                            userB.expectMoveMade().placeMove(0, 2).then(()=> {
                                userB.expectMoveMade(); // By other user
                                userA.expectMoveMade().placeMove(2, 2)
                                  .expectGameWon().then(function() {
                                  for(var i = 0; i < users.count; i++) {
                                    users[i].disconnect();
                                    users[i].pop()
                                  }
                                  var endMillis = new Date().getTime();
                                  var duration = endMillis - startMillis;

                                  if(duration > timelimit){
                                      done.fail(duration + " exceeds limit " + timelimit);
                                  } else {
                                      console.debug(duration);
                                      done();
                                  }
                                });
                            })
                        })
                    });
                })
            })
        }
    );
  })
});
