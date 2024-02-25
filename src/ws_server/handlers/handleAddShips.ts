import { WebSocket } from "ws";
import { IClientAddShipsData, IShipData, MessageType } from "../types";
import { getRandomShips, prepareServerMessage } from "../utils";
import { gamesController } from '../controllers/gamesController';
import { sendStartGameMessage, sendTurnMessage } from "../utils";

export const handleAddShips = (
  messageData: IClientAddShipsData,
  isSingle: boolean,
) => {
  const { gameId, ships, indexPlayer } = messageData;
  const currentGame = gamesController.getGameById(gameId);
  gamesController.addPlayerShips(currentGame, indexPlayer, ships);

  if (isSingle) {
    const botShipsData = getRandomShips();
    gamesController.addPlayerShips(currentGame, 1, botShipsData);
  }

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