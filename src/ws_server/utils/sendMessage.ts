import { WebSocket } from "ws";
import { IServerCreateGameData, IServerRegData, IServerStartGameData, IServerTurnData, IServerUpdateRoomData, IServerUpdateWinnersData, MessageType, ServerMessageData } from '../types';

export const prepareServerMessage = (type: MessageType, data: ServerMessageData) => {
  const message =  JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
  });
  return message;
};

export const sendRegMessage = (client: WebSocket, data: IServerRegData) => {
  client.send(prepareServerMessage(MessageType.REG, data));
};

export const sendUpdateRoomMessage = (client: WebSocket, data: IServerUpdateRoomData[]) => {
  client.send(prepareServerMessage(MessageType.UPDATE_ROOM, data));
};

export const sendUpdateWinnersMessage = (client: WebSocket, data: IServerUpdateWinnersData[]) => {
  client.send(prepareServerMessage(MessageType.UPDATE_WINNERS, data));
};

export const sendCreateGameMessage = (client: WebSocket, data: IServerCreateGameData) => {
  client.send(prepareServerMessage(MessageType.CREATE_GAME, data));
};

export const sendStartGameMessage = (client: WebSocket, data: IServerStartGameData) => {
  client.send(prepareServerMessage(MessageType.START_GAME, data));
};

export const sendTurnMessage = (client: WebSocket, data: IServerTurnData) => {
  client.send(prepareServerMessage(MessageType.TURN, data));
};