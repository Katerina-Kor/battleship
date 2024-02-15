import { WebSocket, WebSocketServer } from 'ws';
import { handleMessage } from './handleMessage.js';
import { ResponseType } from './types.js';
import { usersDB } from './users.js';

const wss = new WebSocketServer({
  port: 3000,
  clientTracking: true
});

// wss.on('connection', (socket, request))

wss.on('connection', (ws: WebSocket, req) => {
  console.log('CONNECTION', wss.clients.size);

  ws.on('message', (data, isBinary) => {
    const message = JSON.parse(data.toString());
    console.log('MESSAGE', message)
    const type = message.type;
    // const messageData = JSON.parse(message.data);
    // const id = message.id;
  
    // console.log('DATA', type, messageData, id);
  
    if (type === ResponseType.REG) {
      const messageData = JSON.parse(message.data);
      const userid = usersDB.length;
      usersDB.push({
        username: messageData.name as string,
        password: messageData.password,
        id: userid,
        ws
      })

      ws.send(JSON.stringify({
        type: ResponseType.REG,
        data: JSON.stringify({
          name: messageData.name,
          index: userid,
          error: false,
          errorText: ''
        }),
        id: 0
      }))
      
      // wss.clients.forEach(client => {
      //   if (client !== ws && client.readyState === WebSocket.OPEN) {
      //     client.send(JSON.stringify({
      //       type: ResponseType.REG,
      //       data: JSON.stringify({
      //         name: messageData.name,
      //         index: userid,
      //         error: false,
      //         errorText: ''
      //       }),
      //       id: 0
      //     }))
      //   }
      // })
    };

    if (type === ResponseType.CREATE_ROOM) {

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
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


      // ws.send(JSON.stringify({
      //   type: ResponseType.UPDATE_ROOM,
      //   data: JSON.stringify([
      //     {
      //       roomId: 0,
      //       roomUsers: [
      //         {
      //           name: 'user',
      //           index: 1
      //         }
      //       ]
      //     }
      //   ]),
      //   id: 0
      // }))
    }
    
  })
});

