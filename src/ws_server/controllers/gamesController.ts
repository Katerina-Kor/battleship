import { database } from "../database/database";
import { Game } from "../models/game";
import { User } from "../models/user";
import { IGamePlayers, IServerUpdateRoomData } from "../types";

class GamesController {
  private games: Game[] = database.games;

  public createGame = (users: User[]) => {
    const gamePlayers: IGamePlayers[] = users.map((user, index) => ({
      user,
      ships: null,
      shipsData: null,
      playerId: index as 0 | 1
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
    }
    
  }

  // public getRoomsData = () => {
  //   const data: IServerUpdateRoomData[] = this.rooms.map(room => {
  //     return {
  //       roomId: room.id,
  //       roomUsers: room.getPlayers().map(player => ({
  //         name: player.username,
  //         index: player.id
  //       }))
  //     }
  //   });
  //   return data;
  // };
}

export const gamesController = new GamesController();