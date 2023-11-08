import { addPlayerHistoriesFromSteamcharts } from "./services/player.history.service.js";
import { delay } from "../../utils/time.utils.js";
import { HistoryCheck } from "../../models/history.check.js";

export class PlayerHistoryAggregator {
  #steamClient;
  #gamesRepository;
  #historyChecksRepository;
  #playerHistoryRepository;
  #options;

  constructor(
    steamClient,
    gamesRepository,
    historyChecksRepository,
    playerHistoryRepository,
    options,
  ) {
    this.#steamClient = steamClient;
    this.#gamesRepository = gamesRepository;
    this.#historyChecksRepository = historyChecksRepository;
    this.#playerHistoryRepository = playerHistoryRepository;
    this.#options = options;
  }

  addPlayerHistoryFromSteamcharts = async () => {
    const uncheckedGames =
      await this.#gamesRepository.getXgamesWithUncheckedPlayerHistory(
        this.#options.batchSize,
      );
    if (uncheckedGames.length === 0) return;

    const gamesPagesMap = await this.#getGameHtmlDetailsPagesFromSteamcharts(
      uncheckedGames,
    );

    const historyChecks = HistoryCheck.manyFromSteamchartsPages(gamesPagesMap);
    await this.#historyChecksRepository.updateHistoryChecks(historyChecks);

    const games = addPlayerHistoriesFromSteamcharts(gamesPagesMap);
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
      }
    }

    return gamesPagesMap;
  }

  addCurrentPlayers = async () => {
    const games = await this.#gamesRepository.getXgamesCheckedMoreThanYmsAgo(
      this.#options.batchSize,
      this.#options.currentPlayersUpdateIntervalDelay,
    );

    if (games.length === 0) return;

    const players = await this.#steamClient.getAllCurrentPlayersConcurrently(games);

    games.forEach((game, i) => game.pushCurrentPlayers(players[i]));

    await this.#playerHistoryRepository.updatePlayerHistoriesById(games);
  };
}
