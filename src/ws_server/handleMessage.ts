import WebSocket from "ws";
import { ResponseType } from "./types";

export const handleMessage = (ws: WebSocket) => {
  console.log('CONNECTION');

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    const type = message.type;
    // const messageData = JSON.parse(message.data);
    // const id = message.id;
  
    // console.log('DATA', type, messageData, id);
  
    if (type === ResponseType.REG) {
      ws.send(JSON.stringify({
        type: ResponseType.REG,
        data: JSON.stringify({
          name: JSON.parse(message.data).name,
          index: 0,
          error: false,
          errorText: ''
        }),
        id: 0
      }))
    };

    if (type === ResponseType.CREATE_ROOM) {
      ws.send(JSON.stringify({
        type: ResponseType.UPDATE_ROOM,
        data: JSON.stringify([
          {
            roomId: 0,
            roomUsers: [
              {
                name: 'user',
                index: 1
              }
            ]
          }
        ]),
        id: 0
      }))
    }
    
  })
}
