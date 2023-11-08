export class UpdateTimestampsRepository {
  #dbClient;

  constructor(dbClient) {
    this.#dbClient = dbClient;
  }

  async insertOneUpdateTimestamp(date) {
    const updateTimestamp = { updatedOn: date };
    await this.#dbClient.insertOne("update_timestamps", updateTimestamp);
  }

  async getLastUpdateTimestamp() {
    return this.#dbClient.getLast("update_timestamps");
  }
}
