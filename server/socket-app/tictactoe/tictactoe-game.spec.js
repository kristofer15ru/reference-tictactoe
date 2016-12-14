var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var createEvent = {
    type: "GameCreated",
    user: {
        userName: "TheGuy"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};

var joinEvent = {
    type: "GameJoined",
    user: {
        userName: "Gummi"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};


describe('create game command', function() {

    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when =
        {
            id:"123987",
            type: "CreateGame",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'X'
            }
        ];

    })
});


describe('join game command', function () {

    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event', function () {

        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
        {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [
            {
                type: "GameJoined",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'O'
            }
        ];
    });

    it('should emit FullGameJoinAttempted event when game full', function () {

      given = [{
              type: "GameJoined",
              user: {
                  userName: "Gummi"
              },
              name: "TheFirstGame",
              timeStamp: "2014-12-02T11:29:29",
              side:'O'
          }
      ];
      when =
      {
          type: "JoinGame",
          user: {
              userName: "Gummi"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:30:29"
      };
      then = [
          {
              type: "FullGameJoinAttempted",
              user: {
                  userName: "Gummi"
              },
              name: "TheFirstGame",
              timeStamp: "2014-12-02T11:30:29"
          }
      ];
    });
});
describe('Place move command', function () {

    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });

    it('should emit MovePlaced event on the first move', function () {
        given = [];
        when =
        {
          type: "PlaceMove",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:35:29",
          location: "0",
          side: 'X'
        };
        then =
        [
          {
            type: "MovePlaced",
            user: {
              userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:35:29",
            location: "0",
            side: 'X'
          }
        ];
    });
    it('should emit IllegalMove when square is already occupied', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:35:29",
          location: "0",
          side: 'X'
        }
      ];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "Gulli"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:39:29",
        location: "0",
        side: 'O'
      };
      then = [
        {
          type: "IllegalMoveAttempt",
          user: {
            userName: "Gulli",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:39:29",
          location: "0",
          side: 'O'
          }
      ];
    })
    it('Should emit IllegalMove when move attempt is out of bounds', function () {
      given = [];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "Gulli"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:39:29",
        location: '9',
        side: 'X'
      };
      then = [
        {
          type: "IllegalMoveAttempt",
          user: {
            userName: "Gulli",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:39:29",
          location: '9',
          side: 'X'
        }
      ];
    })
    it('Should emit NotYourMove if attempting to make move out of turn', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '0',
          side: 'X'
        }
      ];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "TheGuy"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:40:30",
        location: '0',
        side: 'X'
      };
      then = [
        {
          type: "NotYourMove",
          user: {
            userName: "TheGuy",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:30",
          side: 'X'
          }
      ];
    })
    it('Should emit NotYourMove if O tries to start', function () {
      given = [];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "Gulli"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:40:30",
        location: '0',
        side: 'O'
      };
      then = [
        {
          type: "NotYourMove",
          user: {
            userName: "Gulli",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:30",
          side: 'O'
          }
      ];
    })

    it('Should emit GameWon on a horizontal win', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '0',
          side: 'X'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:29",
          location: '3',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:30",
          location: '1',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:31",
          location: '4',
          side: 'O'
        }
      ];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "TheGuy"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:41:32",
        location: '2',
        side: 'X'
      };
      then = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          location: '2',
          side: 'X'
        },
        {
          type: "GameWon",
          user: {
            userName: "TheGuy",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          side: 'X'
        }
      ];
    })
    it('Should emit GameWon on a vertical win', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '1',
          side: 'X'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:29",
          location: '0',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:30",
          location: '4',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:31",
          location: '3',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          location: '8',
          side: 'X'
        }
      ];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "Gulli"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:41:33",
        location: '6',
        side: 'O'
      };
      then = [
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:33",
          location: '6',
          side: 'O'
        },
        {
          type: "GameWon",
          user: {
            userName: "Gulli",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:33",
          side: 'O'
          }
      ];
    })
    it('Should emit GameWon on a diagonal win from 0 to 8', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '0',
          side: 'X'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:29",
          location: '1',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:30",
          location: '4',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:31",
          location: '3',
          side: 'O'
        }
      ];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "TheGuy"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:41:32",
        location: '8',
        side: 'X'
      };
      then = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          location: '8',
          side: 'X'
        },
        {
          type: "GameWon",
          user: {
            userName: "TheGuy",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          side: 'X'
          }
      ];
    })
    it('Should emit GameWon on a diagonal win from 2 to 6', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '0',
          side: 'X'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:29",
          location: '2',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:30",
          location: '3',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:31",
          location: '4',
          side: 'O'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          location: '5',
          side: 'X'
        }
      ];
      when =
      {
        type: "PlaceMove",
        user: {
          userName: "Gummi"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:41:33",
        location: '6',
        side: 'O'
      };
      then = [
        {
          type: "MovePlaced",
          user: {
            userName: "Gummi"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:33",
          location: '6',
          side: 'O'
        },
        {
          type: "GameWon",
          user: {
            userName: "Gummi",
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:33",
          side: 'O'
          }
      ];
    })
    it('Should emit GameDraw when neither wins', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '0',
          side: 'X'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:29",
          location: '2',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:30",
          location: '3',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:31",
          location: '6',
          side: 'O'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          location: '4',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:33",
          location: '8',
          side: 'O'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:34",
          location: '5',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:35",
          location: '1',
          side: 'O'
        }
      ];
      when =
      {
        type:"PlaceMove",
        user: {
          userName: "TheGuy"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:41:36",
        location: '7',
        side: 'X'
      };
      then = [
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:36",
          location: '7',
          side: 'X'
        },
        {
          type: "GameDraw",
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:36"
          }
      ];
    })
    it('Should not emit GameDraw when the game is won in the last move', function () {
      given = [
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:40:29",
          location: '0',
          side: 'X'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:29",
          location: '2',
          side: 'O'
        },
        {
          type: "MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:30",
          location: '3',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:31",
          location: '6',
          side: 'O'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:32",
          location: '4',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:33",
          location: '5',
          side: 'O'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:34",
          location: '7',
          side: 'X'
        },
        {
          type:"MovePlaced",
          user: {
            userName: "Gulli"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:35",
          location: '1',
          side: 'O'
        }
      ];
      when =
      {
        type:"PlaceMove",
        user: {
          userName: "TheGuy"
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:41:36",
        location: '8',
        side: 'X'
      };
      then = [
        {
          type:"MovePlaced",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:36",
          location: '8',
          side: 'X'
        },
        {
          type: "GameWon",
          user: {
            userName: "TheGuy"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:41:36",
          side: 'X'
          }
      ];
    })
});
