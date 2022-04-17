import { filterSteamAppsByName, steamAppIsGame } from "./steam.app.utils.js";
import { Game } from "../models/game.js";

export class SteamGameListProcessor {
  #steamClient;
  #databaseClient;

  constructor(steamClient, databaseClient) {
    this.#steamClient = steamClient;
    this.#databaseClient = databaseClient;
  }

  async addGamesToCollection() {
    this.#getAllSteamApps();
    this.#identifyGames();
  }

  async #getAllSteamApps() {
    const steamApps = await this.#steamClient.getAppList();
    await this.#databaseClient.insertManySteamApps(steamApps);
  }

  async #identifyGames() {
    const steamApps = await this.#databaseClient.getAllSteamApps();
    const filteredSteamApps = filterSteamAppsByName(steamApps);
    const games = this.#filterSteamAppsByAppType(filteredSteamApps);

    this.#databaseClient.insertManyGames(games);
  }

  async #filterSteamAppsByAppType(steamApps) {
    const games = [];

    for (let steamApp in steamApps) {
      const detailsPage = await this.#steamClient.getAppDetailsPage(steamApp);

      if (steamAppIsGame(detailsPage)) {
        games.push(new Game(steamApp));
        continue;
      }

      try {
        await this.#steamClient.getAppDetailsSteamcharts(steamApp);
      } catch (error) {
        if (error.status === 500) continue;
      }

      games.push(new Game(steamApp));
    }

    return games;
  }
}
