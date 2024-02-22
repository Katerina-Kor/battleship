import { WebSocket } from "ws";
import { IClientAddShipsData, IShipData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";
import { gamesController } from '../controllers/gamesController';
import { sendStartGameMessage, sendTurnMessage } from "../utils/sendMessage";

export const handleAddShips = (
  messageData: IClientAddShipsData,
) => {
  const { gameId, ships, indexPlayer } = messageData;
  const currentGame = gamesController.getGameById(gameId);
  gamesController.addPlayerShips(currentGame, indexPlayer, ships);

  if (gamesController.checkGameIsReady(currentGame)) {
    const playersInGame = gamesController.getPlayersInGame(currentGame);

    playersInGame.forEach(({user, playerId, shipsData}) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        const gameData = {
          ships: shipsData ? shipsData : [],
          currentPlayerIndex: playerId
        };
        sendStartGameMessage(user.socket, gameData);
      }
    });
    playersInGame.forEach(({user}) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        const turnData = {
          currentPlayer: currentGame.turn,
        };
        sendTurnMessage(user.socket, turnData);
      }
    });
  };
}