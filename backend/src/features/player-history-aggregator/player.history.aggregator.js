import { addPlayerHistoriesFromSteamcharts } from "./services/player.history.service.js";
import { delay } from "../../utils/time.utils.js";
import { HistoryCheck } from "../../models/history.check.js";

export class PlayerHistoryAggregator {
  #steamClient;
  #gamesRepository;
  #historyChecksRepository;
  #playerHistoryRepository;
  #logger;
  #options;

  constructor(
    steamClient,
    gamesRepository,
    historyChecksRepository,
    playerHistoryRepository,
    logger,
    options,
  ) {
    this.#steamClient = steamClient;
    this.#gamesRepository = gamesRepository;
    this.#historyChecksRepository = historyChecksRepository;
    this.#playerHistoryRepository = playerHistoryRepository;
    this.#logger = logger;
    this.#options = options;
  }

  addPlayerHistoryFromSteamcharts = async () => {
    this.#logger.debugc("adding player history from steamcharts web");

    const uncheckedGames =
      await this.#gamesRepository.getXgamesWithUncheckedPlayerHistory(
        this.#options.batchSize,
      );
    if (uncheckedGames.length === 0) {
      this.#logger.debugc(
        `no unchecked games in db, retry in: ${this.#options.globalIterationDelay} ms`,
      );
      return;
    }

    const gamesPagesMap = await this.#getGameHtmlDetailsPagesFromSteamcharts(
      uncheckedGames,
    );

    this.#logger.debugc(`updating history checks for game batch`);
    const historyChecks = HistoryCheck.manyFromSteamchartsPages(gamesPagesMap);
    await this.#historyChecksRepository.updateHistoryChecks(historyChecks);

    const games = addPlayerHistoriesFromSteamcharts(gamesPagesMap);
    this.#logger.debugc(
      `updating player history of games with ids: ${this.#formatedGameIds(games)}`,
    );
    await this.#playerHistoryRepository.updatePlayerHistoriesById(games);
  };

  async #getGameHtmlDetailsPagesFromSteamcharts(games) {
    const gamesPagesMap = new Map();

    for (let game of games) {
      await delay(this.#options.unitDelay);

      try {
        const page = await this.#steamClient.getSteamchartsGameHtmlDetailsPage(game.id);
        gamesPagesMap.set(game, page);
      } catch (error) {
        gamesPagesMap.set(game, "");
        this.#logger.debugc(`no details page on steamcharts for gameId: ${game.id}`);
      }
    }

    return gamesPagesMap;
  }

  addCurrentPlayers = async () => {
    this.#logger.debugc("adding current players for games via steam api");

    const games = await this.#gamesRepository.getXgamesCheckedMoreThanYmsAgo(
      this.#options.batchSize,
      this.#options.currentPlayersUpdateIntervalDelay,
    );

    if (games.length === 0) {
      this.#logger.debugc("no games to check in current interval");
      return;
    }

    const players = await this.#steamClient.getAllCurrentPlayersConcurrently(games);

    games.forEach((game, i) => game.pushCurrentPlayers(players[i]));
    this.#logger.debugc(
      `updating player history of games with ids: ${this.#formatedGameIds(games)}`,
    );
    await this.#playerHistoryRepository.updatePlayerHistoriesById(games);
  };

  #formatedGameIds(games) {
    return games.map((game) => game.id).join(", ");
  }
}
