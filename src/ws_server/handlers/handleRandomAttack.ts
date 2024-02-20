import { WebSocket } from "ws";
import { IClientAttackData, IClientRandomAttackData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";

export const handleRandomAttack = (
  messageData: IClientRandomAttackData,
  socket: WebSocket
) => {
  console.log('RANDOM ATTACK DATA', messageData)
}