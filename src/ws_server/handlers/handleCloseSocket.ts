import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { gamesController } from "../controllers/gamesController";
import { prepareServerMessage } from "../utils";
import { IGamePlayer, MessageType } from "../types";
import { roomsController } from "../controllers/roomsController";
import { sendUpdateRoomMessage } from "../utils/sendMessage";


export const handleCloseSocket = (socket: WebSocket) => {
  const currentUser = usersController.getUserBySocket(socket);

    if (currentUser) {
      const currentGame = gamesController.getGameByUser(currentUser);
      if (currentGame) {
        const playersInGame = gamesController.getPlayersInGame(currentGame);
        const winPlayerId = (playersInGame.find(player => player.user !== currentUser)as IGamePlayer).playerId;
        
        playersInGame.forEach(({user}) => {
          if (user.socket && user.socket.readyState === WebSocket.OPEN) {
            const data = {
              winPlayer: winPlayerId,
            }
            user.socket.send(prepareServerMessage(MessageType.FINISH, data));
          }
        });
      }
      roomsController.clearRoomsFromUser(currentUser);
      const roomsData = roomsController.getRoomsData();

      const activeUsers = usersController.getAllActiveUsers();

      activeUsers.forEach(({ socket }) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          sendUpdateRoomMessage(socket, roomsData);
        };
      });
      usersController.setUserInactive(currentUser);
    };
}