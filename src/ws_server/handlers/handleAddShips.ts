import { WebSocket } from "ws";
import { IClientAddShipsData, IShipData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";
import { gamesController } from '../controllers/gamesController';

export const handleAddShips = (
  messageData: IClientAddShipsData,
  socket: WebSocket
) => {
  const { gameId, ships, indexPlayer } = messageData;
  const currentGame = gamesController.getGameById(gameId);
  gamesController.addPlayerShips(currentGame, indexPlayer as 0 | 1, ships);

  if (gamesController.checkGameIsReady(currentGame)) {
    const playersInGame = gamesController.getPlayersInGame(currentGame);

    playersInGame.forEach(({user, playerId, shipsData}) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        const data = {
          ships: shipsData as IShipData[],
          currentPlayerIndex: playerId
        };
        const turnData = {
          currentPlayer: currentGame.turn,
        }
        user.socket.send(prepareServerMessage(MessageType.START_GAME, data));
        user.socket.send(prepareServerMessage(MessageType.TURN, turnData));
      }
    });
  };
}