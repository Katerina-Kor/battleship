import { ClientMessage, IGameCeil, MessageType, ServerMessageData } from "../types";

export const parseClientMessage = (message: string) => {
  const resMessage = JSON.parse(message);

  if (resMessage.data !== '') {
    resMessage.data = JSON.parse(resMessage.data);
  }

  return resMessage as ClientMessage;
};

export const getRandomTurn = () => {
  return Math.random() > 0.5 ? 1 : 0;
};

export const prepareServerMessage = (type: MessageType, data: ServerMessageData) => {
  const message =  JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
  });
  return message;
};

export const getEmptyGameField = () => {
  const ceils: IGameCeil[] = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ceils.push({
        x: i,
        y: j,
        touched: false
      })
    }
  }

  return ceils;
};