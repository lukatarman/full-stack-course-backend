export class HistoryChecksRepository {
  #dbClient;

  constructor(dbClient) {
    this.#dbClient = dbClient;
  }

  async insertManyHistoryChecks(data) {
    await this.#dbClient.insertMany("history_checks", data);
  }

  async updateHistoryChecks(historyChecks) {
    await Promise.all(
      historyChecks.map((historyCheck) =>
        this.#dbClient.updateOne(
          "history_checks",
          { gameId: { $eq: historyCheck.gameId } },
          {
            $set: {
              checked: historyCheck.checked,
              found: historyCheck.found,
              source: historyCheck.source,
            },
          },
        ),
      ),
    );
  }
}
