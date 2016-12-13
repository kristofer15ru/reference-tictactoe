var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

	      var gamefull = false;
        var grid = new Array(9);

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type=="MovePlaced") {
            grid[event.location] = event.side;
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

        processEvents(history);

        return {
          gridOccupied:gridOccupied,
          gameFull:gameFull,
          processEvents: processEvents
        }
    };
};
