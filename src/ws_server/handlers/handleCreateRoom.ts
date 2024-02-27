import { WebSocket } from 'ws';
import { usersController, roomsController } from '../controllers';
import { sendUpdateRoomMessage } from '../utils';

export const handleCreateRoom = (socket: WebSocket) => {
  const currentUser = usersController.getUserBySocket(socket);

  if (currentUser) {
    if (roomsController.checkUserAlreadyInRoom(currentUser)) return;

    const createdRoom = roomsController.createRoom();
    roomsController.addUserToRoom(createdRoom, currentUser);

    const roomsData = roomsController.getRoomsData();

    const activeUsers = usersController.getAllActiveUsers();

    activeUsers.forEach(({ socket }) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendUpdateRoomMessage(socket, roomsData);
      }
    });
  }
};
