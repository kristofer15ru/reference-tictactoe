var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

	      var gamefull = false;
        var grid = new Array(9);
        var move = 'X';

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type=="MovePlaced") {
            grid[event.location] = event.side;
            if(move == 'X') {
              move = 'O';
            }
            else {
              move = 'X';
            }
          }
	      }

        function processEvents(history) {
            _.each(history, processEvent);
        }

      	function gameFull() {
      	    return gamefull;
      	}

        function gridOccupied(location) {
          return (grid[location] != null);
        }

        function notYourMove(side) {
          return (side != move)
        }

        processEvents(history);

        return {
          notYourMove:notYourMove,
          gridOccupied:gridOccupied,
          gameFull:gameFull,
          processEvents: processEvents
        }
    };
};
