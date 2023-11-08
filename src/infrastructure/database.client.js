import { MongoClient } from "mongodb";
import { Game } from "../models/game.js";
import { SteamApp } from "../models/steam.app.js";

export class DatabaseClient {
  #collections;

  async init(options) {
    const urlToDb = `${options.url}/${options.databaseName}`;
    const mongodb = await MongoClient.connect(urlToDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const database = mongodb.db(options.databaseName);

    this.#collections = new Map();
    options.collections.forEach((c) => this.#collections.set(c, database.collection(c)));

    return this;
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
      .limit(1)
      .sort({ $natural: -1 })
      .next();
  }
}
