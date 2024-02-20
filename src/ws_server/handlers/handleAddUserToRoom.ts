import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { IClientAddUserToRoomData, IGamePlayers, MessageType } from "../types";
import { prepareServerMessage } from "../utils";
import { database } from "../database/database";
import { Room } from "../models/room";
import { Game } from "../models/game";

export const handleAddUserToRoom = (
  messageData: IClientAddUserToRoomData,
  socket: WebSocket
) => {
  // TODO: check if current user already in the room
  const currentRoom = database.rooms.find((room) => room.id === messageData.indexRoom) as Room;
  const currentUser = usersController.getUserBySocket(socket);
  currentRoom.addPlayer(currentUser);
  currentRoom.setUnavailable();
  
  const usersInRoom = currentRoom.getPlayers();

  const gamePlayers: IGamePlayers[] = usersInRoom.map((user, index) => ({
    user,
    ships: null,
    shipsData: null,
    playerId: index as 0 | 1
  }))

  const newGame = new Game(gamePlayers);
  database.games.push(newGame);

  const playersInGame = newGame.getPlayers();

  playersInGame.forEach(({user, playerId}) => {
    if (user.socket && user.socket.readyState === WebSocket.OPEN) {
      const data = {
        idGame: newGame.id,
        idPlayer: playerId
      };
      user.socket.send(prepareServerMessage(MessageType.CREATE_GAME, data));
    }
  })
}