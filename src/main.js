import { axios as httpClient } from "axios";
import { DatabaseClient } from "./infrastructure/database.client";
import { SteamClient } from "./infrastructure/steam.client";
import { SteamDataAggregator } from "./steam-data-aggregator/steam.data.aggregator";
import { SteamGameListProcessor } from "./steam-game-list-processor/steam.game.list.processor";
import { hoursToMs } from "./shared/time.utils.js"

// our entry point = main
function main() {
  // setup phase
  const databaseOptions = {
    url: "mongodb://localhost:27017",
    databaseName: "game-stats",
    collections: ["games", "steam_apps", "update_timestamps"],
  };
  const databaseClient = new DatabaseClient().init(databaseOptions);
  const steamClient = new SteamClient(httpClient);
  const options = {
    batchSize: 10,
    batchDelay: 5000,
    unitDelay: 500,
    noAppsFoundDelay: hoursToMs(1),
    updateIntervalDelay: hoursToMs(12),

  };
  const steamGameListProcessor = new SteamGameListProcessor(steamClient, databaseClient, options);
  const steamDataAggregator = new SteamDataAggregator(steamClient, databaseClient, options);

  // run phase
  steamGameListProcessor.run();
  steamDataAggregator.run();

}

main();