import { SteamApp } from "./steam.app.js";

export class HistoryCheck {
  gameId;
  checked;
  found;
  source;

  static manyFromSteamchartsPages(gamesPagesMap) {
    const checks = [];
    for (const [game, page] of gamesPagesMap) {
      checks.push(HistoryCheck.fromSteamcharts(game, !!page));
    }
    return checks;
  }

  // prettier-ignore
  static fromSteamcharts(game, found) {
    const check   = new HistoryCheck();
    check.gameId  = game.id
    check.checked = true;
    check.found   = found;
    check.source  = SteamApp.validDataSources.steamCharts;
    return check;
  }

  static manyFromGames(games) {
    return games.map((game) => HistoryCheck.fromGame(game));
  }

  // prettier-ignore
  static fromGame(game) {
    const check   = new HistoryCheck();
    check.gameId  = game.id
    check.checked = false;
    check.found   = false;
    return check;
  }
}
