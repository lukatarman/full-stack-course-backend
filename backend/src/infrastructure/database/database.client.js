import { MongoClient } from "mongodb";

export class DatabaseClient {
  #collections;
  #connection;
  #logger;

  constructor(logger) {
    this.#logger = logger;
  }

  async init(dbConfig) {
    const url = this.#constructUrl(dbConfig);
    this.#logger.debugc(
      "db full connection url: %s",
      this.#constructUrlPasswordRedacted(dbConfig),
    );
    this.#connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const database = this.#connection.db(dbConfig.name);

    this.#collections = new Map();
    dbConfig.collections.forEach((c) => this.#collections.set(c, database.collection(c)));

    const pingResult = await database.command({ ping: 1 });

    this.#logger.info("db connection established");
    this.#logger.debugc("db connection url: %s", dbConfig.host);
    this.#logger.debugc("db ping result: %o", pingResult);

    return this;
  }

  #constructUrl({ host, username, password, authOn }) {
    const urlParts = host.split("//");

    return authOn === true
      ? `${urlParts[0]}//${username}:${encodeURIComponent(password)}@${urlParts[1]}`
      : host;
  }

  #constructUrlPasswordRedacted({ host, username, authOn }) {
    const urlParts = host.split("//");

    return authOn === true
      ? `${urlParts[0]}//${username}:<redacted>@${urlParts[1]}`
      : host;
  }

  async disconnect() {
    this.#connection.close();
  }

  // low level
  async insertOne(collectionName, data) {
    await this.#collections.get(collectionName).insertOne(data);
  }

  async insertMany(collectionName, data) {
    await this.#collections.get(collectionName).insertMany(data);
  }

  async getAll(collectionName, filter = {}) {
    return await this.#collections.get(collectionName).find(filter).toArray();
  }

  get(collectionName) {
    return this.#collections.get(collectionName);
  }

  async updateOne(collectionName, filter, data) {
    await this.#collections.get(collectionName).updateOne(filter, data);
  }

  async deleteMany(collectionName, filter) {
    await this.#collections.get(collectionName).deleteMany(filter);
  }

  async getLast(collectionName) {
    return await this.#collections
      .get(collectionName)
      .find()
      .sort({ $natural: -1 })
      .limit(1)
      .next();
  }
}
