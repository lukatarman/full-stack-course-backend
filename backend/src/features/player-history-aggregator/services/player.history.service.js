import { parseHTML } from "linkedom";
import { PlayerHistory } from "../../../models/player.history.js";

export function addPlayerHistoriesFromSteamcharts(gamesPagesMap) {
  const games = [];
  for (const [game, page] of gamesPagesMap) {
    if (page === "") {
      games.push(game);
      continue;
    }

    const playerHistories = parsePlayerHistory(page);
    game.pushSteamchartsPlayerHistory(playerHistories);

    games.push(game);
  }

  return games;
}

function parsePlayerHistory(pageHttpDetailsHtml) {
  const { document } = parseHTML(pageHttpDetailsHtml);
  const playerHistoryEntries = document.querySelectorAll(".common-table tbody tr");

  // Here, reverse is added so that the player history dates are put in the correct order. The dates of the "current players" array
  // will be displayed from oldest to newest. This means that pushing our own information on current players will stay consistent
  // with the previous oldest-newest date ordering.

  return Array.from(playerHistoryEntries)
    .reverse()
    .map((entry) => entry.firstElementChild)
    .filter((firstElement) => firstElement.textContent !== "Last 30 Days")
    .map((element) =>
      PlayerHistory.fromRawData(
        element.nextElementSibling.textContent,
        element.textContent,
      ),
    );
}
