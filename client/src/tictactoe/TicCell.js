import React from 'react';

const imgX = require('./X.png');
const imgO = require('./O.png');

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TicCell extends React.Component {
        constructor() {
            super();
            this.state = {
              gameId: undefined,
              location: undefined,
              symbol: ''
            }
        }
        componentWillMount(){
          var location = this.props.coordinates.x + this.props.coordinates.y*3;
          this.setState({ gameId: this.props.gameId})
          this.setState({ location: location})
          const movePlaced = (movePlaced)=>{
                if(movePlaced.location == this.state.location && movePlaced.gameId == this.state.gameId) {
                  this.setState({ symbol: movePlaced.side});
                }
          };


          eventRouter.on('MovePlaced', movePlaced);

        }

        render() {
            var image=undefined;
            if(this.state.symbol == 'X') {
              image=<img src={imgX} alt='X'/>
            }
            else if(this.state.symbol == 'O') {
              image=<img src={imgO} alt='O'/>
            }
            return <div className="ticcell" onClick={() => this.placeMove(this)} >
                {image}
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
