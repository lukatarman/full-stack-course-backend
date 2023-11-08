import { SteamApp } from "../../models/steam.app.js";

export class SteamAppsRepository {
  #dbClient;

  constructor(dbClient) {
    this.#dbClient = dbClient;
  }

  async insertManySteamApps(data) {
    await this.#dbClient.insertMany("steam_apps", data);
  }

  async getAllSteamApps() {
    const response = await this.#dbClient.getAll("steam_apps");
    return SteamApp.manyFromDbEntries(response);
  }

  async updateSteamAppsById(steamApps) {
    await Promise.all(steamApps.map((steamApp) => this.#updateSteamAppById(steamApp)));
  }

  async #updateSteamAppById({ appid, triedVia, type }) {
    await this.#dbClient
      .get("steam_apps")
      .updateOne({ appid: { $eq: appid } }, { $set: { triedVia, type } });
  }

  async getSteamWebUntriedFilteredSteamApps(amount) {
    const response = await this.#dbClient
      .get("steam_apps")
      .find({
        $and: [
          { type: SteamApp.validTypes.unknown },
          { triedVia: { $ne: SteamApp.validDataSources.steamWeb } },
          { type: { $ne: SteamApp.validTypes.downloadableContent } },
          { name: { $not: { $regex: /soundtrack$/, $options: "i" } } },
          { name: { $not: { $regex: /dlc$/, $options: "i" } } },
          { name: { $not: { $regex: /demo$/, $options: "i" } } },
        ],
      })
      .limit(amount)
      .toArray();

    return SteamApp.manyFromDbEntries(response);
  }

  async getSteamchartsUntriedFilteredSteamApps(amount) {
    const response = await this.#dbClient
      .get("steam_apps")
      .find({
        $and: [
          { type: SteamApp.validTypes.unknown },
          {
            $and: [
              { triedVia: { $ne: SteamApp.validDataSources.steamCharts } },
              { triedVia: SteamApp.validDataSources.steamWeb },
            ],
          },
          { type: { $ne: SteamApp.validTypes.downloadableContent } },
          { name: { $not: { $regex: /soundtrack$/, $options: "i" } } },
          { name: { $not: { $regex: /dlc$/, $options: "i" } } },
          { name: { $not: { $regex: /demo$/, $options: "i" } } },
        ],
      })
      .limit(amount)
      .toArray();

    return SteamApp.manyFromDbEntries(response);
  }
}
