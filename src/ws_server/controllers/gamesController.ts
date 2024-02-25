import { database } from '../database/database';
import { Game, Ship, User, BotUser } from '../models';
import { ICellPosition, IGamePlayer, IShipData, IShotResult, ShipStatus } from '../types';
import { getEmptyGameField } from '../utils';

class GamesController {
  private games: Game[] = database.games;

  public createGame = (users: User[]) => {
    const gamePlayers: IGamePlayer[] = users.map((user, index) => ({
      user,
      ships: null,
      shipsData: null,
      playerId: index as 0 | 1,
      enemyGameField: getEmptyGameField(),
    }));

    const newGame = new Game(gamePlayers);
    this.games.push(newGame);

    return newGame;
  };

  public createSinglePlayGame = (user: User) => {
    const gamePlayers: IGamePlayer[] = [
      {
        user,
        ships: null,
        shipsData: null,
        playerId: 0,
        enemyGameField: getEmptyGameField(),
      },
      {
        user: new BotUser(),
        ships: null,
        shipsData: null,
        playerId: 1,
        enemyGameField: getEmptyGameField(),
      },
    ];

    const newGame = new Game(gamePlayers, 0);
    this.games.push(newGame);

    return newGame;
  };

  public getGameById = (gameId: number) => {
    return this.games.find((game) => game.id === gameId) as Game;
  };

  public getGameByUser = (user: User) => {
    return this.games.find((game) => {
      return game.getPlayers().find((player) => player.user === user);
    });
  };

  public getPlayersInGame = (gameData: number | Game) => {
    if (typeof gameData === 'number') {
      const game = this.getGameById(gameData);
      return game.getPlayers();
    } else {
      return gameData.getPlayers();
    }
  };

  public addPlayerShips = (gameData: number | Game, playerId: 0 | 1, shipsInfo: IShipData[]) => {
    const currentGame = typeof gameData === 'number' ? this.getGameById(gameData) : gameData;

    currentGame.setPlayerShips(playerId, shipsInfo);
  };

  public checkGameIsReady = (gameData: number | Game) => {
    const game = typeof gameData === 'number' ? this.getGameById(gameData) : gameData;
    return game.isReady;
  };

  public addPlayerShot = (gameData: number | Game, playerId: 0 | 1, x: number, y: number) => {
    const currentGame = typeof gameData === 'number' ? this.getGameById(gameData) : gameData;
    const currentPlayer = currentGame.getPlayerById(playerId);
    const index = x * 10 + y;

    const ceil = currentPlayer.enemyGameField[index];
    if (ceil.touched) {
      return false;
    } else {
      ceil.touched = true;
      return true;
    }
  };

  public getShotResult = (gameData: number | Game, playerId: 0 | 1, x: number, y: number): IShotResult => {
    const currentGame = typeof gameData === 'number' ? this.getGameById(gameData) : gameData;
    const enemyId = playerId === 0 ? 1 : 0;
    const enemyPlayer = currentGame.getPlayerById(enemyId);

    const ship = enemyPlayer.ships?.find((ship) => {
      return ship.getPositions().find((position) => {
        return position.x === x && position.y === y;
      });
    });

    if (!ship) {
      currentGame.changeTurnToNext();
      return {
        status: ShipStatus.MISS,
        neighboringCells: null,
        isWin: false,
      };
    }

    ship.decreaseLength();
    const shipHealth = ship.getIsAlive();

    if (shipHealth) {
      return {
        status: ShipStatus.SHOT,
        neighboringCells: null,
        isWin: false,
      };
    } else {
      const isWin = this.checkIsWin(enemyPlayer.ships as Ship[]);
      if (isWin) {
        const currentPlayer = currentGame.getPlayerById(playerId);
        currentPlayer.user.increaseWinsQuantity();
      }
      return {
        status: ShipStatus.KILLED,
        neighboringCells: ship.getShipNeighboringCells(),
        isWin,
      };
    }
  };

  public getRandomShot = (gameData: number | Game, playerId: 0 | 1): ICellPosition => {
    const currentGame = typeof gameData === 'number' ? this.getGameById(gameData) : gameData;
    const currentPlayer = currentGame.getPlayerById(playerId);

    const leftCells = currentPlayer.enemyGameField.filter((cell) => cell.touched === false);
    const randomCellIndex = Math.round(Math.random() * leftCells.length - 1);
    const cell = leftCells[randomCellIndex];
    return {
      x: cell.x,
      y: cell.y,
    };
  };

  private checkIsWin = (ships: Ship[]) => {
    return ships.every((ship) => ship.getIsAlive() === false);
  };
}

export const gamesController = new GamesController();
