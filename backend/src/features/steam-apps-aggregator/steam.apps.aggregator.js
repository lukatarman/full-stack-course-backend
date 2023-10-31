import { SteamApp } from "../../models/steam.app.js";
import { moreThanXhoursPassedSince } from "../../utils/time.utils.js";

export class SteamAppsAggregator {
  #steamAppsUpdateTimestampsRepository;
  #steamAppsRepository;
  #steamClient;
  #logger;
  #options;

  constructor(
    steamClient,
    steamAppsUpdateTimestampsRepository,
    steamAppsRepository,
    logger,
    options,
  ) {
    this.#steamClient = steamClient;
    this.#steamAppsUpdateTimestampsRepository = steamAppsUpdateTimestampsRepository;
    this.#steamAppsRepository = steamAppsRepository;
    this.#logger = logger;
    this.#options = options;
  }

  collectSteamApps = async () => {
    const lastUpdate =
      await this.#steamAppsUpdateTimestampsRepository.getLastSteamAppsUpdateTimestamp();
    if (!lastUpdate) {
      await this.#collectFirstTime();
      return;
    }

    const x = this.#options.runner.options.defaultIntervalDelay;
    if (moreThanXhoursPassedSince(x, lastUpdate.updatedOn))
      await this.#collectSteamApps();
  };

  async #collectFirstTime() {
    this.#logger.debugc("collecting steam apps first time");

    const steamApps = await this.#steamClient.getAppList();

    await this.#steamAppsRepository.insertManySteamApps(steamApps);
    await this.#steamAppsUpdateTimestampsRepository.insertOneSteamAppsUpdateTimestamp(
      new Date(),
    );
  }

  async #collectSteamApps() {
    this.#logger.debugc("collecting steam apps");

    const steamAppsApi = await this.#steamClient.getAppList();
    const steamAppsDb = await this.#steamAppsRepository.getAllSteamApps();
    /**
     * @TODO https://github.com/lukatarman/steam-game-stats/issues/32
     */
    const steamApps = SteamApp.diff(steamAppsApi, steamAppsDb);
    if (steamApps.length === 0) {
      await this.#steamAppsUpdateTimestampsRepository.insertOneSteamAppsUpdateTimestamp(
        new Date(),
      );
      return;
    }
    await this.#steamAppsRepository.insertManySteamApps(steamApps);
    await this.#steamAppsUpdateTimestampsRepository.insertOneSteamAppsUpdateTimestamp(
      new Date(),
    );
  }
}
