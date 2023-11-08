import { TrackedPlayers } from "./tracked.players.js";

export class PlayerHistory {
  year;
  month;
  trackedPlayers;
  averagePlayers;

  static manyFromDbEntry(histories) {
    return histories.map((history) => this.fromDbEntry(history));
  }

  //prettier-ignore
  static fromDbEntry(history) {
    const playerHistory           = new PlayerHistory();
    playerHistory.year            = history.year;
    playerHistory.month           = history.month;
    playerHistory.averagePlayers  = history.averagePlayers;
    playerHistory.trackedPlayers  = TrackedPlayers.manyFromDbEntry(history.trackedPlayers);
    return playerHistory;
  }

  //prettier-ignore
  static fromRawData(players, date) {
      const playerHistory           = new PlayerHistory();
      playerHistory.year            = new Date(date).getFullYear();
      playerHistory.month           = new Date(date).getMonth();
      playerHistory.averagePlayers  = 0;
      playerHistory.trackedPlayers  = [];
      playerHistory.pushTrackedPlayers(players, date);
      return playerHistory;
    }

  //prettier-ignore
  static newMonthlyEntry(players) {
    const playerHistory           = new PlayerHistory();
    playerHistory.year            = new Date().getFullYear();
    playerHistory.month           = new Date().getMonth();
    playerHistory.averagePlayers  = 0;
    playerHistory.trackedPlayers  = [];
    playerHistory.pushTrackedPlayers(players);
    return playerHistory;
  }

  pushTrackedPlayers(players, date = "") {
    this.trackedPlayers.push(new TrackedPlayers(players, date));

    this.averagePlayers = this.calcAveragePlayers();
  }

  calcAveragePlayers() {
    const average =
      this.trackedPlayers.reduce((sum, cur) => sum + cur.players, 0) /
      this.trackedPlayers.length;
    return parseFloat(average.toFixed(1));
  }
}
