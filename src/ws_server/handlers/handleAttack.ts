import { WebSocket } from "ws";
import { IClientAttackData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";

export const handleAttack = (
  messageData: IClientAttackData,
  socket: WebSocket
) => {
  console.log('ATTACK DATA', messageData)
}