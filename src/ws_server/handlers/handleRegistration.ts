import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { IClientRegData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";

export const handleRegistration = (
  messageData: IClientRegData,
  socket: WebSocket
) => {
  const user = usersController.getUserByUsername(messageData.name);

  if (user) {
    if (user.isActive) {
      const data = {
        name: user.username,
        index: user.id,
        error: true,
        errorText: 'User already has active connection'
      };
      socket.send(prepareServerMessage(MessageType.REG, data));
    } else {
      // TODO: add password validation
      user.setActive();
      user.socket = socket;
      const data = {
        name: user.username,
        index: user.id,
        error: false,
        errorText: ''
      };
      socket.send(prepareServerMessage(MessageType.REG, data));
    }
  } else {
    const newUser = usersController.createNewUser(messageData.name, messageData.password, socket);
    const data = {
      name: newUser.username,
      index: newUser.id,
      error: false,
      errorText: ''
    };
    socket.send(prepareServerMessage(MessageType.REG, data));
  }
}