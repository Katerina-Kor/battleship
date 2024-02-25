import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { roomsController } from '../controllers/roomsController';
import { gamesController } from '../controllers/gamesController';
import { sendCreateGameMessage, sendUpdateRoomMessage } from "../utils";

export const handleSinglePlay = (
  socket: WebSocket
) => {
  const currentUser = usersController.getUserBySocket(socket);

  if (currentUser) {
    roomsController.clearRoomsFromUser(currentUser);

    const activeUsers = usersController.getAllActiveUsers();
    const roomsData = roomsController.getRoomsData();

    activeUsers.forEach(({ socket }) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendUpdateRoomMessage(socket, roomsData);
      };
    });

    const createdGame = gamesController.createSinglePlayGame(currentUser);

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
  }
}
