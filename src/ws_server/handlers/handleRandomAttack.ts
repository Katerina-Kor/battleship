import { IClientAttackData, IClientRandomAttackData } from "../types";
import { gamesController } from "../controllers/gamesController";
import { handleAttack } from "./handleAttack";

export const handleRandomAttack = (
  messageData: IClientRandomAttackData,
  singlePlay: boolean
) => {
  const { gameId, indexPlayer } = messageData;

  const randomShot = gamesController.getRandomShot(gameId, indexPlayer);

  const attackData: IClientAttackData = {
    gameId,
    indexPlayer,
    x: randomShot.x,
    y: randomShot.y
  };

  handleAttack(attackData, singlePlay);
};