import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { roomsController } from '../controllers/roomsController';
import { gamesController } from '../controllers/gamesController';
import { IClientAddUserToRoomData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";

export const handleAddUserToRoom = (
  messageData: IClientAddUserToRoomData,
  socket: WebSocket
) => {
  // TODO: check if current user already in the room

  const roomId = messageData.indexRoom;
  const currentUser = usersController.getUserBySocket(socket);

  roomsController.addUserToRoom(roomId, currentUser);
  roomsController.closeRoom(roomId);
  
  const usersInRoom = roomsController.getUsersInRoom(roomId);

  const createdGame = gamesController.createGame(usersInRoom);

  const playersInGame = gamesController.getPlayersInGame(createdGame);

  playersInGame.forEach(({user, playerId}) => {
    if (user.socket && user.socket.readyState === WebSocket.OPEN) {
      const data = {
        idGame: createdGame.id,
        idPlayer: playerId
      };
      user.socket.send(prepareServerMessage(MessageType.CREATE_GAME, data));
    }
  })
}