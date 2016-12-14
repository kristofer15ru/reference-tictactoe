var _ = require('lodash');

module.exports = function (injected) {

    /*
    Layout of the grid indices:
    0 1 2
    3 4 5
    6 7 8
    */

    return function (history) {

	      var gamefull = false;
        var grid = new Array(9);
        var move = 'X';
        var won = false;

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type=="MovePlaced" || event.type=="PlaceMove") {
            //Place the players symbol in the selected location
            grid[event.location] = event.side;

            //Switch turns
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

        //Search for winning conditions around the last move
        function winningMove(i) {
          //Slide to the beginning of the row
          while(i % 3 !== 0) {
            i--;
          }

          //Check if the current row has a horizontal winning condition
          won = (grid[i] == move && grid[i+1] == move && grid[i+2] == move);
        }

        processEvents(history);

        return {
          winningMove:winningMove,
          notYourMove:notYourMove,
          gridOccupied:gridOccupied,
          gameFull:gameFull,
          processEvents: processEvents
        }
    };
};
