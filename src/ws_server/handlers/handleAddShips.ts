import { WebSocket } from "ws";
import { IClientAddShipsData, IShipData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";
import { database } from "../database/database";
import { Game } from "../models/game";
import { Ship } from "../models/ship";

export const handleAddShips = (
  messageData: IClientAddShipsData,
  socket: WebSocket
) => {
  const ships: Ship[] = [];
    
  messageData.ships.forEach((ship: IShipData) => {
    console.log(ship.position, ship.direction, ship.type, ship.length);

    const shipInstance = new Ship(ship);
    ships.push(shipInstance);
  })

  ships.forEach(ship => console.log('SHIPDATA', ship.getType(), ship.getPositions(), ship.getLength(), ship.getIsAlive()))

  const gameId = messageData.gameId;
  const currentGame = database.games.find((game) => game.id === gameId) as Game;

  const indexPlayer = messageData.indexPlayer as 0 | 1;
  const currentPlayer = currentGame.getPlayerById(indexPlayer);
  currentPlayer.ships = ships;

  if (currentGame.isReady) {
    const playersInGame = currentGame.getPlayers();
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