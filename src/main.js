import httpClient from "axios";
import { DatabaseClient } from "./infrastructure/database.client.js";
import { SteamClient } from "./infrastructure/steam.client.js";
import { SteamAppsAggregator } from "./features/steam-apps-aggregator/steam.apps.aggregator.js";
import { GameIdentifier } from "./features/game-identifier/game.identifier.js";
import { hoursToMs } from "./utils/time.utils.js";
import { PlayerHistoryAggregator } from "./features/player-history-aggregator/player.history.aggregator.js";
import { Runner } from "./utils/runner.js";
import { WebServer } from "./infrastructure/web.server.js";
import { GameQueriesController } from "./features/game-queries/game.queries.controller.js";
import { GameQueriesRouter } from "./features/game-queries/game.queries.router.js";
import { GamesRepository } from "./infrastructure/repositories/games.repository.js";
import { SteamAppsRepository } from "./infrastructure/repositories/steam.apps.repository.js";
import { UpdateTimestampsRepository } from "./infrastructure/repositories/update.timestamps.repository.js";
import { PlayerHistoryRepository } from "./infrastructure/repositories/player.history.repository.js";
import { HistoryChecksRepository } from "./infrastructure/repositories/history.checks.repository.js";

// our entry point = main
async function main() {
  // setup phase
  const databaseOptions = {
    url: "mongodb://localhost:27017",
    databaseName: "game-stats",
    collections: ["games", "steam_apps", "update_timestamps", "history_checks"],
  };
  const databaseClient = await new DatabaseClient().init(databaseOptions);
  const gamesRepository = new GamesRepository(databaseClient);
  const steamAppsRepository = new SteamAppsRepository(databaseClient);
  const updateTimestampRepository = new UpdateTimestampsRepository(databaseClient);
  const playerHistoryRepository = new PlayerHistoryRepository(databaseClient);
  const historyChecksRepository = new HistoryChecksRepository(databaseClient);
  const steamClient = new SteamClient(httpClient);
  const options = {
    batchSize: 5,
    batchDelay: 5000,
    unitDelay: 800,
    currentPlayersUpdateIntervalDelay: hoursToMs(2),
    updateIntervalDelay: hoursToMs(12),
    iterationDelay: 5000,
  };
  const steamAppsAggregator = new SteamAppsAggregator(
    steamClient,
    updateTimestampRepository,
    steamAppsRepository,
    options,
  );
  const gameIdentifier = new GameIdentifier(
    steamClient,
    steamAppsRepository,
    gamesRepository,
    historyChecksRepository,
    options,
  );
  const playerHistoryAggregator = new PlayerHistoryAggregator(
    steamClient,
    gamesRepository,
    historyChecksRepository,
    playerHistoryRepository,
    options,
  );
  const gameQueriesController = new GameQueriesController(gamesRepository);
  const gameQueriesRouter = new GameQueriesRouter(gameQueriesController);
  const webServer = new WebServer(gameQueriesRouter);
  await webServer.start();

  const runner = new Runner(
    [
      steamAppsAggregator.collectSteamApps,
      gameIdentifier.tryViaSteamWeb,
      gameIdentifier.tryViaSteamchartsWeb,
      /**
       * @todo batch delay must be performed by runner
       */
      playerHistoryAggregator.addPlayerHistoryFromSteamcharts,
      playerHistoryAggregator.addCurrentPlayers,
    ],
    options,
  );

  try {
    /**
     * @todo fix bug - https://github.com/lukatarman/steam-game-stats/issues/40
     */
    await runner.run();
  } catch (error) {
    console.error(error);
  }

  /**
   * @todo https://github.com/lukatarman/steam-game-stats/issues/39
   */
  console.info("done...");
}

main().catch((error) => console.log(error));
