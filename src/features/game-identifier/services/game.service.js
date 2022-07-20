import { JSDOM } from "jsdom";
import { Game } from "../../../models/game.js";
import { SteamApp } from "../../../models/steam.app.js";

export function steamAppIsGame(httpDetailsPage) {
  const dom = new JSDOM(httpDetailsPage);
  const breadcrumbElement = dom.window.document.querySelector(".blockbg");

  if (!breadcrumbElement) return false;

  const breadcrumbText = breadcrumbElement.children[0].textContent;

  if (breadcrumbText !== "All Software" && breadcrumbText !== "All Games") return false;

  for (let child of breadcrumbElement.children) {
    if (child.textContent === "Downloadable Content") return false;
  }

  return true;
}

export function discoverGamesFromSteamWeb(steamApps, htmlDetailsPages) {
  const games = [];
  const unidentifiedSteamApps = [];

  for (let i = 0; i < steamApps.length; i++) {
    steamAppIsGame(htmlDetailsPages[i])
      ? games.push(Game.fromSteamApp(steamApps[i]))
      : unidentifiedSteamApps.push(SteamApp.oneFromSteamApi(steamApps[i], ["steamWeb"]));
  }

  return [games, unidentifiedSteamApps];
}
