
module.exports = function(injected){
    var TictactoeState = injected('TictactoeState');

    return function(history){

        var gameState = TictactoeState(history);

        return {
            executeCommand: function(cmd, eventHandler){

                var cmdHandlers = {
                    "CreateGame": function (cmd) {
                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.gameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    "PlaceMove": function(cmd){

                      // Check here for conditions which prevent command from altering state
                      if(gameState.notYourMove(cmd.side)) {
                        eventHandler( [{
                          gameId: cmd.gameId,
                          type: "NotYourMove",
                          user: cmd.user,
                          name: cmd.name,
                          timeStamp: cmd.timeStamp,
                          side: cmd.side
                        }])
                        return;
                      }
                      if(gameState.gridOccupied(cmd.location)) {
                        eventHandler( [{
                          gameId: cmd.gameId,
                          type: "IllegalMoveAttempt",
                          user: cmd.user,
                          name: cmd.name,
                          timeStamp: cmd.timeStamp,
                          location: cmd.location,
                          side: cmd.side
                        }]);
                        return;
                      }

                      //Move is legal

                      var events = [
                        {
                          gameId: cmd.gameId,
                          type: "MovePlaced",
                          user: cmd.user,
                          name: cmd.name,
                          timeStamp: cmd.timeStamp,
                          location: cmd.location,
                          side: cmd.side
                        }
                      ];

                      gameState.processEvents(events)

                      if(gameState.winningMove(cmd)) {
                        events.push({
                          gameId: cmd.gameId,
                          type: "GameWon",
                          user: cmd.user,
                          name: cmd.name,
                          timeStamp: cmd.timeStamp,
                          side: cmd.side
                        });
                      }
                      eventHandler(events)
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};
