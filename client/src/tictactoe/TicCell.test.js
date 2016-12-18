import ReactTestUtils from 'react-addons-test-utils';
import TictactoeBoardModule from './TictactoeBoard';
import ReactDOM from 'react-dom';
import React from 'react';
import { shallow } from 'enzyme';

import TicCellComponent from './TicCell';

import MessageRouter from '../common/framework/message-router';

describe("Tic Cell", function () {

var div, component, TicCell, someTime, side, cmd;

var commandRouter = MessageRouter(inject({}));
var eventRouter = MessageRouter(inject({}));
var commandsReceived=[];

commandRouter.on("*", function(cmd){
    commandsReceived.push(cmd);
} );

beforeEach(function () {
    commandsReceived.length=0;
    someTime = new Date().getTime();
    side = 'X'
    cmd = {
      gameId: 2,
      commandId:someTime,
      type:"MovePlaced",
      timeStamp:someTime,
      location: 4,
      side: side
    }
    TicCell = TicCellComponent(inject({
        generateUUID:()=>{
            return "youyouid"
        },
        commandPort: commandRouter,
        eventRouter
    }));


    div = document.createElement('div');

    component = shallow(<TicCell coordinates={{ x:1, y:1}} gameId={cmd.gameId} mySide={side} />, div);

});

it('should render without error', function () {
});

it('should record move with matching game id and coordinates ',function(){
  //Route moveplaced command directly to eventRouter
  eventRouter.routeMessage(cmd);
  //Verify that this cell is capable of noting basic data
  expect(component.state('gameId')).toBe(cmd.gameId);
  expect(component.state('location')).toBe(cmd.location);
  //Main test. verify that the cell has stored the symbol placement.
  //Verifies that the cell noticed the routed event
  expect(component.state('symbol')).toBe(cmd.side);
});

it('should ignore move with matching gameId but not coordinates',function(){
  cmd.location = 5;
  eventRouter.routeMessage(cmd);
  //Verify that this cell is capable of noting basic data
  expect(component.state('gameId')).toBe(cmd.gameId);
  expect(component.state('location')).toBe(4);
  //Since the command location was changed, the cell should ignore the event since it does not apply to it
  expect(component.state('symbol')).not.toBe(-1);
});

it('should ignore move with matching coordinates, but not matching gameId',function(){
  cmd.gameId = "a different game";
  eventRouter.routeMessage(cmd);
  //Verify that this cell is capable of noting basic data
  expect(component.state('gameId')).not.toBe(cmd.gameId);
  expect(component.state('location')).toBe(cmd.location);
  //Since the commands gameId was changed, the cell should ingore the event since it does not apply to it
  expect(component.state('symbol')).toBe('');
});

it('should issue PlaceMove command with gameId, mySide and coordinates when clicked', ()=>{
  component.find('div').simulate('click');

  //check whether correct command was dispatched through command router
});

});
