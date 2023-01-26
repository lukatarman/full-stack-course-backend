import { PlayerHistory } from "./player.history.js";
import cloneDeep from "lodash.clonedeep";

export class Game {
  id;
  name;
  releaseDate;

  image;
  imageUrl;
  playerHistory;

  // prettier-ignore
  static fromSteamApp(steamApp, page) {
    const game         = new Game();
    game.id            = steamApp.appid;
    game.name          = steamApp.name;
    game.releaseDate   = this.#getReleaseDate(page);
    game.imageUrl      = `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`
    game.playerHistory = [];
    return game;
  }

  static #getReleaseDate(page) {
    return page.window.document.querySelector(".release_date .date").textContent;
  }

  static manyFromDbEntry(entries) {
    return entries.map((entry) => this.fromDbEntry(entry));
  }

  // prettier-ignore
  static fromDbEntry(dbEntry) {
    const game         = new Game();
    game.id            = dbEntry.id;
    game.name          = dbEntry.name;
    game.imageUrl      = dbEntry.imageUrl;
    game.playerHistory = PlayerHistory.manyFromDbEntry(dbEntry.playerHistory);
    return game;
  }

  pushCurrentPlayers(players) {
    this.#currentMonthEntryIndex === -1
      ? this.playerHistory.push(PlayerHistory.newMonthlyEntry(players))
      : this.playerHistory[this.#currentMonthEntryIndex].pushTrackedPlayers(players);
  }

  get #currentMonthEntryIndex() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    return this.playerHistory.findIndex(
      (history) => history.year === currentYear && history.month === currentMonth,
    );
  }

  pushSteamchartsPlayerHistory(playerHistories) {
    playerHistories.forEach((history) => {
      const historyCopy = cloneDeep(history);

      this.playerHistory.push(historyCopy);
    });

    this.#sortPlayerHistoryByDate();
  }

  #sortPlayerHistoryByDate() {
    this.playerHistory.sort((a, b) => {
      const dateA = new Date(a.year, a.month);
      const dateB = new Date(b.year, b.month);

      return dateA - dateB;
    });
  }
}
