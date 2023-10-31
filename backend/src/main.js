import httpClient from "axios";
import { DatabaseClient } from "./infrastructure/database/database.client.js";
import { SteamClient } from "./infrastructure/steam.client.js";
import { SteamAppsAggregator } from "./features/steam-apps-aggregator/steam.apps.aggregator.js";
import { GameIdentifier } from "./features/game-identifier/game.identifier.js";
import { PlayerHistoryAggregator } from "./features/player-history-aggregator/player.history.aggregator.js";
import { Runner } from "./utils/runner.js";
import { WebServer } from "./infrastructure/web.server.js";
import { GameQueriesController } from "./features/game-queries/game.queries.controller.js";
import { GameQueriesRouter } from "./features/game-queries/game.queries.router.js";
import { GamesRepository } from "./infrastructure/database/repositories/games.repository.js";
import { SteamAppsRepository } from "./infrastructure/database/repositories/steam.apps.repository.js";
import { SteamAppsUpdateTimestampsRepository } from "./infrastructure/database/repositories/steam.apps.update.timestamps.repository.js";
import { PlayerHistoryRepository } from "./infrastructure/database/repositories/player.history.repository.js";
import { HistoryChecksRepository } from "./infrastructure/database/repositories/history.checks.repository.js";
import { config } from "./utils/config.loader.js";
import { Logger } from "./utils/logger.js";

// our entry point = main
async function main() {
  const logger = new Logger(config.logger.level);
  const databaseClient = await new DatabaseClient(logger).init(config.db);

  // repositories
  const gamesRepository = new GamesRepository(databaseClient);
  const steamAppsRepository = new SteamAppsRepository(databaseClient);
  const steamAppsUpdateTimestampRepository = new SteamAppsUpdateTimestampsRepository(
    databaseClient,
  );
  const playerHistoryRepository = new PlayerHistoryRepository(databaseClient);
  const historyChecksRepository = new HistoryChecksRepository(databaseClient);

  // http client
  const steamClient = new SteamClient(httpClient);

  const steamAppsAggregator = new SteamAppsAggregator(
    steamClient,
    steamAppsUpdateTimestampRepository,
    steamAppsRepository,
    logger,
    config.features,
  );
  const gameIdentifier = new GameIdentifier(
    steamClient,
    steamAppsRepository,
    gamesRepository,
    historyChecksRepository,
    logger,
    config.features,
  );
  const playerHistoryAggregator = new PlayerHistoryAggregator(
    steamClient,
    gamesRepository,
    historyChecksRepository,
    playerHistoryRepository,
    logger,
    config.features,
  );

  // rest + web server
  const gameQueriesController = new GameQueriesController(gamesRepository);
  const gameQueriesRouter = new GameQueriesRouter(gameQueriesController);
  const webServer = new WebServer(gameQueriesRouter, logger);
  await webServer.start();

  const runnables = [
    { method: steamAppsAggregator.collectSteamApps },
    { method: gameIdentifier.tryViaSteamWeb },
    { method: gameIdentifier.tryViaSteamchartsWeb },
    { method: gameIdentifier.updateGamesWithoutDetails },
    { method: playerHistoryAggregator.addPlayerHistoryFromSteamcharts },
    { method: playerHistoryAggregator.addCurrentPlayers },
  ];
  const runner = new Runner(logger, {
    delayFn: config.runner.delayFn,
    defaultIterationDelay: config.runner.defaultIterationDelay,
  });

  try {
    /**
     * @todo fix bug - https://github.com/lukatarman/steam-game-stats/issues/40
     */
    await runner.run(runnables, config.runner.expectedErrorTypes);
  } catch (error) {
    logger.error(error);
  }

  logger.info("done...");
}

main().catch((error) => {
  const logger = new Logger(config.logger.level);
  logger.fatal(error, "unexpected error caught by main, add handling");
  logger.fatal("performing shutdown with error response");
  process.exit(1);
});
