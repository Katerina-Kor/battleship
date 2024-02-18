import { WebSocket, WebSocketServer } from 'ws';
import { handleMessage } from './handleMessage.js';
import { IUserDB, ResponseType } from './types.js';
import { gamesDB, roomsDB, usersDB } from './models/usersDB.js';
import { User } from './models/user.js';
import { Room } from './models/room.js';
import { UsersController } from './controllers/usersController.js';
import { Game } from './models/game.js';

const wss = new WebSocketServer({
  port: 3000,
  clientTracking: true
});

wss.on('connection', (ws: WebSocket) => {
  console.log('CONNECTION', wss.clients.size);
  const usersController = new UsersController();

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    const type = message.type;
  
    if (type === ResponseType.REG) {
      const messageData = JSON.parse(message.data);

      const user = usersController.getUserByUsername(messageData.name);

      if (user) {
        if (user.getIsActive()) {
          ws.send(JSON.stringify({
            type: ResponseType.REG,
            data: JSON.stringify({
              name: user.getUsername(),
              index: user.getId(),
              error: true,
              errorText: 'User already has active connection'
            }),
            id: 0
          }))
        } else {
          // TODO: add password validation
          user.setActive();
          user.setSocket(ws);
          ws.send(JSON.stringify({
            type: ResponseType.REG,
            data: JSON.stringify({
              name: user.getUsername(),
              index: user.getId(),
              error: false,
              errorText: ''
            }),
            id: 0
          }))
        }
      } else {
        const newUser = usersController.createNewUser(messageData.name, messageData.password, ws);
        ws.send(JSON.stringify({
          type: ResponseType.REG,
          data: JSON.stringify({
            name: newUser.getUsername(),
            index: newUser.getId(),
            error: false,
            errorText: ''
          }),
          id: 0
        }))
      }
    };

    if (type === ResponseType.CREATE_ROOM) {
      const currentUser = usersController.getUserBySocket(ws);
      // TODO: create rooms controller
      const newRoom = new Room(currentUser);
      roomsDB.push(newRoom);

      const data = roomsDB.map(room => {
        return {
          roomId: room.getId(),
          roomUsers: [
            {
              name: room.getPlayer1()?.getUsername(),
              index: room.getPlayer1()?.getId()
            }
          ]
        }
      })
      console.log('DATA', typeof data, data)

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: ResponseType.UPDATE_ROOM,
            data: JSON.stringify(data),
            id: 0
          }))
        }
      })
    };

    if (type === ResponseType.ADD_USER_TO_ROOM) {
      // TODO: check if current user already in the room
      const messageData = JSON.parse(message.data);

      const currentRoom = roomsDB.find((room) => room.getId() === messageData.indexRoom) as Room;
      const currentUser = usersController.getUserBySocket(ws);
      const firstUserInRoom = currentRoom.getPlayer1() as User;

      currentRoom.setPlayer2(currentUser);
      currentRoom.setUnavailable();

      const newGame = new Game(currentRoom);
      gamesDB.push(newGame);

      [firstUserInRoom, currentUser].forEach(player => {
        (player.getSocket() as WebSocket).send(JSON.stringify({
          type: ResponseType.CREATE_GAME,
          data: JSON.stringify({
            idGame: newGame.getId(),
            idPlayer: player.getId()
          }),
          id: 0
        }))
      })
    };

    if (type === ResponseType.ADD_SHIPS) {
      const messageData = JSON.parse(message.data);
      console.log('SHIPS', messageData);
      messageData.ships.forEach((ship) => {
        console.log(ship.position, ship.direction, ship.type, ship.length)
      })

      const gameId = messageData.gameId;
      const currentGame = gamesDB.find((game) => game.getId() === gameId) as Game;

      const indexPlayer = messageData.indexPlayer as number;
      const currentPlayer = currentGame.getPlayerById(indexPlayer);
      currentPlayer.shipsPosition = messageData.ships;

      if (currentGame.checkIsReady()) {
        [currentGame.getPlayer1(), currentGame.getPlayer2()].forEach(player => {
          (player.user.getSocket() as WebSocket).send(JSON.stringify({
            type: ResponseType.START_GAME,
            data: JSON.stringify({
              ships: player.shipsPosition,
              currentPlayerIndex: player.user.getId(),
            }),
            id: 0
          }))
        });
        [currentGame.getPlayer1(), currentGame.getPlayer2()].forEach(player => {
          (player.user.getSocket() as WebSocket).send(JSON.stringify({
            type: ResponseType.TURN,
            data: JSON.stringify({
              currentPlayer: currentGame.getNextTurn(),
            }),
            id: 0
          }))
        })
      };

    }
    
  })
});

