export class GameQueriesController {
  #gamesRepository;

  constructor(gamesRepository) {
    this.#gamesRepository = gamesRepository;
  }

  async getOneGameById(id) {
    return await this.#gamesRepository.getOneGameById(id);
  }

  async getAllGames() {
    return await this.#gamesRepository.getAllGames();
  }

  async getTopXgames(amount) {
    return await this.#gamesRepository.getXgamesSortedByCurrentPlayers(amount);
  }

  async getGamesBySearchTerm(term) {
    return await this.#gamesRepository.getGamesBySearchTerm(term);
  }
}
