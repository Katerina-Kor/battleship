import { WebSocket } from "ws";
import { IClientAttackData, MessageType, ShipStatus } from "../types";
import { prepareServerMessage } from "../utils";
import { gamesController } from "../controllers/gamesController";

export const handleAttack = (
  messageData: IClientAttackData,
) => {
  console.log('ATTACK DATA', messageData);

  const { gameId, indexPlayer, x, y } = messageData;

  const currentGame = gamesController.getGameById(gameId);
  if (currentGame.turn !== indexPlayer) return;
  const isNewShot = gamesController.addPlayerShot(currentGame, indexPlayer as 0 | 1, x, y);

  if (!isNewShot) return;

  const shotResult = gamesController.getShotResult(currentGame, indexPlayer as 0 | 1, x, y);

  const playersInGame = gamesController.getPlayersInGame(currentGame);

  playersInGame.forEach(({user}) => {
    if (user.socket && user.socket.readyState === WebSocket.OPEN) {
      const data = {
        position: {
          x,
          y
        },
        currentPlayer: indexPlayer,
        status: shotResult.status
      };
      user.socket.send(prepareServerMessage(MessageType.ATTACK, data));
    }
  });

  if (shotResult.neighboringCells) {
    console.log('neighboring', shotResult.neighboringCells)
    shotResult.neighboringCells.forEach((cell) => {
      const isNewShot = gamesController.addPlayerShot(currentGame, indexPlayer as 0 | 1, cell.x, cell.y);
      if (!isNewShot) return;

      playersInGame.forEach(({user}) => {
        if (user.socket && user.socket.readyState === WebSocket.OPEN) {
          const data = {
            position: {
              x: cell.x,
              y: cell.y
            },
            currentPlayer: indexPlayer,
            status: ShipStatus.MISS
          };
          user.socket.send(prepareServerMessage(MessageType.ATTACK, data));
        }
      });
    })
  }

  playersInGame.forEach(({user}) => {
    if (user.socket && user.socket.readyState === WebSocket.OPEN) {
      const turnData = {
        currentPlayer: currentGame.turn,
      }
      user.socket.send(prepareServerMessage(MessageType.TURN, turnData));
    }
  });
}