import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { MessageType } from "../types";

export const handleRegistration = (
  messageData: any,
  socket: WebSocket
) => {
  const user = usersController.getUserByUsername(messageData.name);

      if (user) {
        if (user.isActive) {
          socket.send(JSON.stringify({
            type: MessageType.REG,
            data: JSON.stringify({
              name: user.username,
              index: user.id,
              error: true,
              errorText: 'User already has active connection'
            }),
            id: 0
          }))
        } else {
          // TODO: add password validation
          user.setActive();
          user.socket = socket;
          socket.send(JSON.stringify({
            type: MessageType.REG,
            data: JSON.stringify({
              name: user.username,
              index: user.id,
              error: false,
              errorText: ''
            }),
            id: 0
          }))
        }
      } else {
        const newUser = usersController.createNewUser(messageData.name, messageData.password, socket);
        socket.send(JSON.stringify({
          type: MessageType.REG,
          data: JSON.stringify({
            name: newUser.username,
            index: newUser.id,
            error: false,
            errorText: ''
          }),
          id: 0
        }))
      }
}