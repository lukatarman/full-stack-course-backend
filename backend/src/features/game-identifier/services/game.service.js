import { Game } from "../../../models/game.js";
import { SteamApp } from "../../../models/steam.app.js";
import { parseHTML } from "linkedom";

export function getSteamAppType(httpDetailsPage) {
  const { document } = parseHTML(httpDetailsPage);

  const breadcrumbElement = document.querySelector(".blockbg");

  if (!breadcrumbElement) return SteamApp.validTypes.unknown;

  const breadcrumbText = breadcrumbElement.children[0].textContent;

  if (breadcrumbText !== "All Software" && breadcrumbText !== "All Games")
    return SteamApp.validTypes.unknown;

  for (let child of breadcrumbElement.children) {
    if (child.textContent === "Downloadable Content")
      return SteamApp.validTypes.downloadableContent;
  }

  return SteamApp.validTypes.game;
}

export function discoverGamesFromSteamWeb(steamApps, htmlDetailsPages) {
  return htmlDetailsPages
    .map((page, i) => {
      if (getSteamAppType(page) === SteamApp.validTypes.game) {
        return Game.fromSteamApp(
          steamApps[i],
          getReleaseDate(page),
          getDevelopers(page),
          getGenres(page),
          getGameDescription(page),
        );
      }
    })
    .filter((game) => !!game);
}

export function getReleaseDate(page) {
  const { document } = parseHTML(page);

  const releaseDateElement = document.querySelector(".release_date .date");

  if (!releaseDateElement) return "";

  const releaseDate = new Date(`${releaseDateElement.textContent.trim()} UTC`);

  return releaseDate == "Invalid Date" ? "" : releaseDate;
}

export function getDevelopers(page) {
  const { document } = parseHTML(page);

  const developers = document.querySelector(".dev_row #developers_list");

  if (!developers) return [];

  return Array.from(developers.children).map((developer) => developer.textContent.trim());
}

export function getGenres(page) {
  const { document } = parseHTML(page);

  const genres = document.querySelector("#genresAndManufacturer span");

  if (!genres) return [];

  return Array.from(genres.children)
    .map((genre) => genre.textContent.trim())
    .filter((genre) => !!genre);
}

export function getGameDescription(page) {
  const { document } = parseHTML(page);

  const description = document.querySelector(".game_description_snippet");

  if (!description) return "";

  return description.textContent.trim();
}

export function updateTypeSideEffectFree(steamApps, htmlDetailsPages) {
  return htmlDetailsPages.map((page, i) => {
    const copy = steamApps[i].copy();
    const appType = getSteamAppType(page);

    copy.triedViaSteamWeb();

    copy.appType = appType;

    return copy;
  });
}

export function identifyGames(updatedSteamApps) {
  const games = updatedSteamApps
    .filter((steamApp) => steamApp.isGame())
    .map((steamApp) => Game.fromSteamcharts(steamApp));

  return games;
}

export function assignType(result, steamApp) {
  if (result) steamApp.appType = SteamApp.validTypes.game;
  return steamApp;
}

export function updateMissingDetails(games, htmlDetailsPages) {
  return games.map((game, i) => {
    const page = htmlDetailsPages[i];

    game.updateGameDetails(
      getSteamDbDevelopers(page),
      getSteamDbGenres(page),
      getSteamDbDescription(page),
    );
  });
}

export function getSteamDbDevelopers(page) {
  const { document } = parseHTML(page);

  const developers = document.querySelector(
    "table.table.table-bordered.table-hover.table-responsive-flex tbody tr:nth-child(3) td:last-child",
  );

  if (!developers) return [];

  return Array.from(developers.children).map((developer) => developer.textContent);
}

export function getSteamDbGenres(page) {
  const { document } = parseHTML(page);

  const domTableBody = document.querySelector("#info tbody");

  if (!domTableBody) return [];

  const genresNodes = Array.from(domTableBody.children).filter(
    (tableEntry) => tableEntry.children[0].textContent === "Store Genres",
  )[0].children[1].childNodes;

  return Array.from(genresNodes)
    .filter((genre) => genre.constructor.name === "Text")
    .map((genre) => genre.nodeValue.replace(",", "").trim());
}

export function getSteamDbDescription(page) {
  const { document } = parseHTML(page);

  const description = document.querySelector(".header-description");

  if (!description) return "";

  return description.textContent;
}

export function updateMissingReleaseDates(games, htmlDetailsPages) {
  return games.map((game, i) => {
    game.updateReleaseDate(getSteamDbReleaseDate(htmlDetailsPages[i]));
  });
}

export function getSteamDbReleaseDate(page) {
  const { document } = parseHTML(page);

  const releaseDateElement = document.querySelector(
    "table.table.table-bordered.table-hover.table-responsive-flex tbody tr:last-child td:last-child",
  );

  if (!releaseDateElement) return "";

  const releaseDateString = releaseDateElement.textContent;

  const releaseDate = new Date(`
    ${releaseDateString.slice(0, releaseDateString.indexOf("–") - 1)} UTC`);

  if (releaseDate == "Invalid Date") return "";

  return releaseDate;
}
