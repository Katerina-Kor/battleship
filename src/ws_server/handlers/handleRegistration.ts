import { WebSocket } from 'ws';
import { usersController, roomsController } from '../controllers';
import { IClientRegData } from '../types';
import { sendRegMessage, sendUpdateRoomMessage, sendUpdateWinnersMessage } from '../utils';

export const handleRegistration = (messageData: IClientRegData, socket: WebSocket) => {
  const { name, password } = messageData;
  const user = usersController.getUserByUsername(name);

  if (user) {
    // user is in game already
    if (user.isActive) {
      const regData = {
        name: user.username,
        index: user.id,
        error: true,
        errorText: 'User already has active connection',
      };
      sendRegMessage(socket, regData);
    } else {
      // user send wrong password
      if (!usersController.checkUserPassword(user, password)) {
        const regData = {
          name: user.username,
          index: user.id,
          error: true,
          errorText: 'Wrong password',
        };
        sendRegMessage(socket, regData);
        return;
      }

      // user enter the game second time
      user.setActive(socket);
      const regData = {
        name: user.username,
        index: user.id,
        error: false,
        errorText: '',
      };
      sendRegMessage(socket, regData);

      const winnersData = usersController.getWinnersList();
      sendUpdateWinnersMessage(socket, winnersData);

      const roomsData = roomsController.getRoomsData();
      sendUpdateRoomMessage(socket, roomsData);
    }
  } else {
    // new user
    const newUser = usersController.createNewUser(name, password, socket);
    const regData = {
      name: newUser.username,
      index: newUser.id,
      error: false,
      errorText: '',
    };
    sendRegMessage(socket, regData);

    const winnersData = usersController.getWinnersList();
    sendUpdateWinnersMessage(socket, winnersData);

    const roomsData = roomsController.getRoomsData();
    sendUpdateRoomMessage(socket, roomsData);
  }
};
