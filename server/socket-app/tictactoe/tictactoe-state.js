var _ = require('lodash');

module.exports = function (injected) {

    /*
    Layout of the grid indices:
    0 1 2
    3 4 5
    6 7 8
    */

    return function (history) {

	      var gamefull = false
        var grid = new Array(9)
        var moveCount = 0
        var move = 'X'
        var won = false

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type=="MovePlaced") {
            //Place the players symbol in the selected location
            grid[event.location] = event.side;
            moveCount++;
            //Switch turns
            if(move == 'X') {
              move = 'O';
            }
            else {
              move = 'X';
            }
          }
          //Enables unit testing on given GameWon. Also secures wins
          if(event.type=="GameWon") {
            won = true;
          }
	      }

        function processEvents(history) {
            _.each(history, processEvent);
        }

      	function gameFull() {
          return gamefull
      	}

        function gridOccupied(location) {
          return (grid[location] != null)
        }

        function outOfBounds(location) {
          return (location < 0 || location > 8)
        }

        function notYourMove(side) {
          return (side != move)
        }

        //Search for winning conditions around the last move
        function winningMove(cmd) {
          var i = cmd.location;
          //Check against the symbol that is not playing, since the move switched them.
          var s;
          if(move == 'X')
            s = 'O';
          else
            s = 'X';

          //Slide to the beginning of the row
          while(i % 3 !== 0) {
            i--;
          }
          //Check if the current row has a horizontal winning condition
          won = (grid[i] == s && grid[i+1] == s && grid[i+2] == s);
          if(won)
            return won;

          //No horizontal win. Reset i
          i = cmd.location
          //Jump to the highest row
          while(i > 2) {
            i -= 3;
          }
          //Check if the current col has a vertical winning condition
          won = (grid[i] == s && grid[i+3] == s && grid[i+6] == s);
          if(won)
            return won;

          //No vertical win
          //Check for the two diagonal wins if the placed symbol exists in the center
          if(grid[4] == s) {
            won = (grid[0] == s && grid[8]) == s || (grid[2] == s && grid[6] == s)
          }

          return won;
        }

        function gameWon() {
          return won;
        }

        function noMovesLeft() {
          return (moveCount == 9)
        }

        processEvents(history);

        return {
          gameWon:gameWon,
          noMovesLeft:noMovesLeft,
          winningMove:winningMove,
          notYourMove:notYourMove,
          outOfBounds:outOfBounds,
          gridOccupied:gridOccupied,
          gameFull:gameFull,
          processEvents: processEvents
        }
    };
};
