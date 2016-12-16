module.exports=function(injected){

    const io = require('socket.io-client');
    const RoutingContext = require('../../client/src/routing-context');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;

    function userAPI(){
        var waitingFor=[];
        var commandId=0;
        var gameId=0;
        var gameSymbol='';
        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        connectCount++;
        const me = {
            expectUserAck:(cb)=>{
                waitingFor.push("expectUserAck");
                routingContext.socket.on('userAcknowledged', function(ackMessage){
                    expect(ackMessage.clientId).not.toBeUndefined();
                    waitingFor.pop();
                });
                return me;
            },
            sendChatMessage:(message)=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"chatCommand", message });
                return me;
            },
            expectChatMessageReceived:(message)=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('chatMessageReceived', function(chatMessage){
                    expect(chatMessage.sender).not.toBeUndefined();
                    if(chatMessage.message===message){
                        waitingFor.pop();
                    }
                });
                return me;
            },
            cleanDatabase:()=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"cleanDatabase"});
                return me;

            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
                    waitingFor.pop();
                });
                return me;

            },
            expectGameCreated:()=>{
              waitingFor.push("expectGameCreated");
              routingContext.eventRouter.on('GameCreated', function(){
                waitingFor.pop();
              });
              return me;
            },
            createGame:()=>{
              var cmdId = generateUUID();
              me.gameId = generateUUID();
              me.gameSymbol = 'X';
              routingContext.commandRouter.routeMessage({commandId:cmdId, gameId:me.gameId, type:"CreateGame", timeStamp: new Date().getTime()});
              return me;
            },
            expectGameJoined:()=>{
              waitingFor.push("expectGameJoined");
              routingContext.eventRouter.on('GameJoined', function(){
                waitingFor.pop();
              });
              return me;
            },
            joinGame:(gameId)=>{
              var cmdId = generateUUID();
              me.gameId = gameId;
              me.gameSymbol = 'O';
              routingContext.commandRouter.routeMessage({commandId:cmdId, gameId:me.gameId, type:"JoinGame", timeStamp: new Date().getTime()});
              return me;
            },
            getGame:()=>{
              return me;
            },
            expectMoveMade:()=>{
              waitingFor.push("expectMoveMade");
              routingContext.eventRouter.on('MovePlaced', function(){
                waitingFor.pop();
              });
              return me;
            },
            placeMove:(x, y)=>{
              var cmdId = generateUUID();
              var location = x + 3*y;
              routingContext.commandRouter.routeMessage({commandId:cmdId, gameId:me.gameId, type:"PlaceMove", location:location, side:me.gameSymbol, timeStamp: new Date().getTime()});
              return me;
            },
            expectGameWon:()=>{
              waitingFor.push("expectGameWon");
              routingContext.eventRouter.on('GameWon', function(){
                waitingFor.pop();
              });
              return me;
            },

            then:(whenDoneWaiting)=>{
                function waitLonger(){
                    if(waitingFor.length>0){
                        setTimeout(waitLonger, 0);
                        return;
                    }
                    whenDoneWaiting();
                }
                waitLonger();
                return me;
            },
            disconnect:function(){
                routingContext.socket.disconnect();
            }

        };
        return me;

    }

    return userAPI;
};
