import { WebSocket } from "ws";
import { IClientAttackData, IClientRandomAttackData } from "../types";
import { gamesController } from "../controllers/gamesController";
import { handleAttack } from "./handleAttack";

export const handleRandomAttack = (
  messageData: IClientRandomAttackData,
) => {
  console.log('RANDOM ATTACK DATA' );

  const { gameId, indexPlayer } = messageData;

  const randomShot = gamesController.getRandomShot(gameId, indexPlayer as 0 | 1);

  const attackData: IClientAttackData = {
    gameId,
    indexPlayer,
    x: randomShot.x,
    y: randomShot.y
  }

  handleAttack(attackData);
}