import { WebSocket, WebSocketServer } from 'ws';
import { MessageType } from './types/index.js';
import { parseClientMessage } from './utils';
import {
  handleRegistration,
  handleCreateRoom,
  handleAddUserToRoom,
  handleAddShips,
  handleAttack,
  handleRandomAttack
} from './handlers';
import { usersController } from './controllers/usersController.js';

const wss = new WebSocketServer({
  port: 3000,
  clientTracking: true
});

wss.on('connection', (ws: WebSocket) => {
  console.log('CONNECTION', wss.clients.size);

  ws.on('message', (data) => {
    const message = parseClientMessage(data.toString());
    const { type, data: msgData } = message;
  
    if (type === MessageType.REG) {
      handleRegistration(msgData, ws);
    };

    if (type === MessageType.CREATE_ROOM) {
      handleCreateRoom(ws);
    };

    if (type === MessageType.ADD_USER_TO_ROOM) {
      handleAddUserToRoom(msgData, ws);
    };

    if (type === MessageType.ADD_SHIPS) {
      handleAddShips(msgData, ws);
    };

    if (type === MessageType.ATTACK) {
      handleAttack(msgData);
    };

    if (type === MessageType.RANDOM_ATTACK) {
      handleRandomAttack(msgData);
    };
    
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    usersController.setUserInactive(ws);
  })
});

