import { ClientMessage, MessageType, ServerMessageData } from "../types";

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
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
  });
}