import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { roomsController } from '../controllers/roomsController';
import { gamesController } from '../controllers/gamesController';
import { IClientAddUserToRoomData } from "../types";
import { sendCreateGameMessage, sendUpdateRoomMessage } from "../utils";

export const handleAddUserToRoom = (
  messageData: IClientAddUserToRoomData,
  socket: WebSocket
) => {

  const roomId = messageData.indexRoom;
  const currentRoom = roomsController.getRoomById(roomId);
  const currentUser = usersController.getUserBySocket(socket);

  if (currentUser) {
    if (roomsController.checkUserAlreadyInRoom(currentUser, currentRoom)) return;

    roomsController.addUserToRoom(currentRoom, currentUser);
    
    const usersInRoom = roomsController.getUsersInRoom(currentRoom);

    if (usersInRoom.length === 2) {
      roomsController.closeRoom(currentRoom);
      roomsController.clearRoomsFromUser(currentUser);

      const activeUsers = usersController.getAllActiveUsers();
      const roomsData = roomsController.getRoomsData();

      activeUsers.forEach(({ socket }) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          sendUpdateRoomMessage(socket, roomsData);
        };
      });

      const createdGame = gamesController.createGame(usersInRoom);

      const playersInGame = gamesController.getPlayersInGame(createdGame);

      playersInGame.forEach(({user, playerId}) => {
        if (user.socket && user.socket.readyState === WebSocket.OPEN) {
          const gameData = {
            idGame: createdGame.id,
            idPlayer: playerId
          };
          sendCreateGameMessage(user.socket, gameData);
        };
      });

    } else {
      const activeUsers = usersController.getAllActiveUsers();
      const roomsData = roomsController.getRoomsData();

      activeUsers.forEach(({ socket }) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          sendUpdateRoomMessage(socket, roomsData);
        };
      });
    }
  }
}