import { database } from "../database/database";
import { Game } from "../models/game";
import { Ship } from "../models/ship";
import { User } from "../models/user";
import { IGamePlayer, IServerUpdateRoomData, IShipData, ShipStatus } from "../types";
import { getEmptyGameField } from "../utils";

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

  public getGameById = (gameId: number) => {
    return this.games.find((game) => game.id === gameId) as Game;
  };

  public getPlayersInGame = (gameData: number | Game) => {
    if (typeof gameData === 'number') {
      const game = this.getGameById(gameData);
      return game.getPlayers();
    } else {
      return gameData.getPlayers();
    };
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
    const index = (x * 10) + y;
    const ceil = currentPlayer.enemyGameField[index];
    if (ceil.touched) {
      return false;
    } else {
      ceil.touched = true;
      return true;
    }
  };

  public getShotResult = (gameData: number | Game, playerId: 0 | 1, x: number, y: number) => {
    const currentGame = typeof gameData === 'number' ? this.getGameById(gameData) : gameData;
    const enemyId = playerId === 0 ? 1 : 0;
    const enemyPlayer = currentGame.getPlayerById(enemyId);

    const ship = enemyPlayer.ships?.find((ship) => {
      return ship.getPositions().find((position) => {
        return position.x === x && position.y === y;
      })
    });

    if (!ship) {
      currentGame.changeTurnToNext();
      return ShipStatus.MISS;
    }

    ship.decreaseLength();
    const shipHealth = ship.getIsAlive();

    return shipHealth ? ShipStatus.SHOT : ShipStatus.KILLED;
  }
}

export const gamesController = new GamesController();