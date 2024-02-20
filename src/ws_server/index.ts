import { WebSocket, WebSocketServer } from 'ws';
import { IGamePlayers, MessageType } from './types/index.js';
import { database } from './database/database.js';
import { User } from './models/user.js';
import { Room } from './models/room.js';
import { usersController } from './controllers/usersController.js';
import { Game } from './models/game.js';
import { Ship } from './models/ship.js';
import { handleRegistration } from './handlers/handleRegistration.js';
import { parseClientMessage } from './utils'

const wss = new WebSocketServer({
  port: 3000,
  clientTracking: true
});

wss.on('connection', (ws: WebSocket) => {
  console.log('CONNECTION', wss.clients.size);

  ws.on('message', (data) => {
    const message = parseClientMessage(data.toString());
    const { type, data: msgData } = message;
  
    if (type === MessageType.REG) {
      handleRegistration(msgData, ws)
    };

    if (type === MessageType.CREATE_ROOM) {
      const currentUser = usersController.getUserBySocket(ws);
      // TODO: create rooms controller
      const newRoom = new Room();
      newRoom.addPlayer(currentUser);
      database.rooms.push(newRoom);

      const data = database.rooms.map(room => {
        return {
          roomId: room.id,
          roomUsers: [
            {
              name: currentUser.username,
              index: currentUser.id
            }
          ]
        }
      })
      console.log('DATA', typeof data, data)

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: MessageType.UPDATE_ROOM,
            data: JSON.stringify(data),
            id: 0
          }))
        }
      })
    };

    if (type === MessageType.ADD_USER_TO_ROOM) {
      // TODO: check if current user already in the room
      const messageData = JSON.parse(message.data);

      const currentRoom = database.rooms.find((room) => room.id === messageData.indexRoom) as Room;
      const currentUser = usersController.getUserBySocket(ws);
      // const firstUserInRoom = currentRoom.getPlayers;

      currentRoom.addPlayer(currentUser);
      currentRoom.setUnavailable();
      const usersInRoom = currentRoom.getPlayers();

      const gamePlayers: IGamePlayers[] = usersInRoom.map((user, index) => ({
        user,
        ships: null,
        playerId: index as 0 | 1
      }))

      const newGame = new Game(gamePlayers);
      database.games.push(newGame);

      usersInRoom.forEach(player => {
        (player.socket as WebSocket).send(JSON.stringify({
          type: MessageType.CREATE_GAME,
          data: JSON.stringify({
            idGame: newGame.id,
            idPlayer: player.id
          }),
          id: 0
        }))
      })
    };

    if (type === MessageType.ADD_SHIPS) {
      const messageData = JSON.parse(message.data);

      const ships: Ship[] = [];
      
      messageData.ships.forEach((ship: IShipPosition) => {
        console.log(ship.position, ship.direction, ship.type, ship.length);

        const shipInstance = new Ship(ship);
        ships.push(shipInstance);
      })

      ships.forEach(ship => console.log('SHIPDATA', ship.getType(), ship.getPositions(), ship.getLength(), ship.getIsAlive()))

      const gameId = messageData.gameId;
      const currentGame = database.games.find((game) => game.id === gameId) as Game;

      const indexPlayer = messageData.indexPlayer as 0 | 1;
      const currentPlayer = currentGame.getPlayerById(indexPlayer);
      currentPlayer.ships = messageData.ships;

      if (currentGame.isReady) {
        currentGame.getPlayers().forEach(player => {
          (player.user.socket as WebSocket).send(JSON.stringify({
            type: MessageType.START_GAME,
            data: JSON.stringify({
              ships: player.ships,
              currentPlayerIndex: player.user.id,
            }),
            id: 0
          }))
        });
        currentGame.getPlayers().forEach(player => {
          (player.user.socket as WebSocket).send(JSON.stringify({
            type: MessageType.TURN,
            data: JSON.stringify({
              currentPlayer: currentGame.turn,
            }),
            id: 0
          }))
        })
      };
    };

    if (type === MessageType.ATTACK) {
      const messageData = JSON.parse(message.data);

      console.log('ATTACK DATA', messageData)
    };
    
  });

  ws.on("close", () => {
    console.log("Client disconnected")
  })
});

