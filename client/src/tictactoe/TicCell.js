import React from 'react';

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TicCell extends React.Component {
        constructor() {
            super();
            this.state = {
              gameId: -1,
              location: -1,
              symbol: ''
            }
        }
        componentWillMount(){
          var location = this.props.coordinates.x + this.props.coordinates.y*3;
          this.setState({ gameId: this.props.gameId})
          this.setState({ location: location})
          const movePlaced = (movePlaced)=>{
                if(movePlaced.location == this.state.location) {
                  this.setState({ symbol: movePlaced.side});
                }
          };


          eventRouter.on('MovePlaced', movePlaced);

        }

        render() {
            //console.debug(this)
            return <div className="ticcell" onClick={() => this.placeMove(this)} >
                {this.state.symbol}
            </div>
        }

        placeMove(cell){
            var cmdId = generateUUID();
            var gameId = cell.props.gameId;
            var timeStamp = new Date().getTime();
            var location = cell.props.coordinates.x + cell.props.coordinates.y*3;
            var side = cell.props.mySide;


            commandPort.routeMessage({
                gameId: gameId,
                commandId:cmdId,
                type:"PlaceMove",
                timeStamp:timeStamp,
                location: location,
                side: side
            });
        }


    }
    return TicCell;
}
