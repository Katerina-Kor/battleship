import { WebSocket } from "ws";
import { IClientAttackData, MessageType, ShipStatus } from "../types";
import { prepareServerMessage } from "../utils";
import { gamesController } from "../controllers/gamesController";
import { sendAttackMessage, sendTurnMessage, sendUpdateWinnersMessage } from "../utils/sendMessage";
import { usersController } from "../controllers/usersController";
import { roomsController } from "../controllers/roomsController";

export const handleAttack = (
  messageData: IClientAttackData,
) => {
  const { gameId, indexPlayer, x, y } = messageData;

  const currentGame = gamesController.getGameById(gameId);
  if (currentGame.turn !== indexPlayer) return;

  const isNewShot = gamesController.addPlayerShot(currentGame, indexPlayer, x, y);

  const playersInGame = gamesController.getPlayersInGame(currentGame);

  if (!isNewShot) {
    playersInGame.forEach(({user}) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        const turnData = {
          currentPlayer: currentGame.turn,
        };
        sendTurnMessage(user.socket, turnData);
      }
    });
    return;
  };

  const shotResult = gamesController.getShotResult(currentGame, indexPlayer, x, y);

  playersInGame.forEach(({user}) => {
    if (user.socket && user.socket.readyState === WebSocket.OPEN) {
      const attackData = {
        position: {
          x,
          y
        },
        currentPlayer: indexPlayer,
        status: shotResult.status
      };
      sendAttackMessage(user.socket, attackData);
    }
  });
  if (shotResult.isWin) {
    playersInGame.forEach(({user}) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        const data = {
          winPlayer: indexPlayer,
        }
        user.socket.send(prepareServerMessage(MessageType.FINISH, data));
      }
    });

    const activeUsers = usersController.getAllActiveUsers();
    const winnersData = usersController.getWinnersList();
    activeUsers.forEach(({ socket }) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendUpdateWinnersMessage(socket, winnersData);
      };
    });
    return;
  } else {
    playersInGame.forEach(({user}) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        const turnData = {
          currentPlayer: currentGame.turn,
        };
        sendTurnMessage(user.socket, turnData);
      }
    });
  }

  if (shotResult.neighboringCells) {
    shotResult.neighboringCells.forEach((cell) => {
      const isNewShot = gamesController.addPlayerShot(currentGame, indexPlayer, cell.x, cell.y);
      if (!isNewShot) return;

      playersInGame.forEach(({user}) => {
        if (user.socket && user.socket.readyState === WebSocket.OPEN) {
          const attackData = {
            position: {
              x: cell.x,
              y: cell.y
            },
            currentPlayer: indexPlayer,
            status: ShipStatus.MISS
          };
          sendAttackMessage(user.socket, attackData);
        }
      });
      playersInGame.forEach(({user}) => {
        if (user.socket && user.socket.readyState === WebSocket.OPEN) {
          const turnData = {
            currentPlayer: currentGame.turn,
          };
          sendTurnMessage(user.socket, turnData);
        }
      });
    })
  }
}