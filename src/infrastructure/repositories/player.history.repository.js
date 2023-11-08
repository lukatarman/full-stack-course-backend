export class PlayerHistoryRepository {
  #dbClient;

  constructor(dbClient) {
    this.#dbClient = dbClient;
  }

  async updatePlayerHistoriesById(games) {
    await Promise.all(games.map((game) => this.#updatePlayerHistoryById(game)));
  }

  async #updatePlayerHistoryById(game) {
    await this.#dbClient
      .get("games")
      .updateOne({ id: game.id }, { $set: { playerHistory: game.playerHistory } });
  }
}
