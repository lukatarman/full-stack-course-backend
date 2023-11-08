import { GameIdentifier } from "./game.identifier.js";
import { animaddicts2gameHtmlDetailsPage } from "../../../assets/steam-details-pages/animaddicts.2.game.html.details.page.js";
import { glitchhikersSoundtrackHtmlDetailsPage } from "../../../assets/steam-details-pages/glitchhikers.soundtrack.html.details.page.js";
import { mortalDarknessGameHtmlDetailsPage } from "../../../assets/steam-details-pages/mortal.darkness.game.html.details.page.js";
import { swordsAndSoldiersBetaSteamcharts } from "../../../assets/steamcharts-details-pages/swords.and.soldiers.beta.error.html.details.page.js";
import { eldenRingHttpDetailsSteamcharts } from "../../../assets/steamcharts-details-pages/elden.ring.multiple.histories.html.details.page.js";
import { Game } from "../../models/game.js";

import { SteamApp } from "../../models/steam.app.js";
import {
  discoverGamesFromSteamWeb,
  updateTypeSideEffectFree,
} from "./services/game.service.js";
import { HistoryCheck } from "../../models/history.check.js";

describe("game.identifier.js", function () {
  describe(".tryViaSteamWeb", function () {
    describe("gets zero steamApps from the database and stops. So,", function () {
      beforeEach(function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.steamClientMock = createSteamMock([undefined]);

        this.steamAppsRepository = createSteamAppsRepositoryMock([], undefined);
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        this.identifier.tryViaSteamWeb();
      });

      it("getSteamWebUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamWebUntriedFilteredSteamApps was called with 'this.options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamAppHtmlDetailsPage was not called", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledTimes(0);
      });

      it("insertManyGames was not called", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(0);
      });

      it("insertManyHistoryChecks was not called", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(0);
      });

      it("updateSteamAppsById was not called", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(0);
      });
    });

    describe("gets one game out of a batch of one steamApp, and inserts it into the database. So,", function () {
      beforeEach(async function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.app = [{ appid: 1, name: "Animaddicts" }];

        this.games = discoverGamesFromSteamWeb(this.app, [
          animaddicts2gameHtmlDetailsPage,
        ]);

        this.historychecks = HistoryCheck.manyFromGames(this.games);

        this.instantiatedApp = SteamApp.manyFromSteamApi(this.app);

        this.updatedSteamApps = updateTypeSideEffectFree(this.instantiatedApp, [
          animaddicts2gameHtmlDetailsPage,
        ]);

        this.steamClientMock = createSteamMock([animaddicts2gameHtmlDetailsPage]);

        this.steamAppsRepository = createSteamAppsRepositoryMock(
          this.instantiatedApp,
          undefined,
        );
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        await this.identifier.tryViaSteamWeb();
      });

      it("getSteamWebUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamWebUntriedFilteredSteamApps was called with 'this.options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamWebUntriedFilteredSteamApps was called before getSteamAppHtmlDetailsPage", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamAppHtmlDetailsPage);
      });

      it("getSteamAppHtmlDetailsPage was called once", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledTimes(1);
      });

      it("getSteamAppHtmlDetailsPage was called with", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledWith(
          this.instantiatedApp[0].appid,
        );
      });

      it("getSteamAppHtmlDetailsPage was called before insertManyGames", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledBefore(
          this.gamesRepository.insertManyGames,
        );
      });

      it("insertManyGames was called once", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(1);
      });

      it("insertManyGames was called with this.games", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledWith(this.games);
      });

      it("insertManyGames was called before insertManyHistoryChecks", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledBefore(
          this.historyChecksRepository.insertManyHistoryChecks,
        );
      });

      it("insertManyHistoryChecks was called once", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("insertManyHistoryChecks was called with this.historychecks", function () {
        expect(this.historyChecksRepository.insertManyHistoryChecks).toHaveBeenCalledWith(
          this.historychecks,
        );
      });

      it("insertManyHistoryChecks was called before updateSteamAppsById", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledBefore(this.steamAppsRepository.updateSteamAppsById);
      });

      it("updateSteamAppsById was called once", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(1);
      });

      it("updateSteamAppsById was called with this.updatedSteamApps", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledWith(
          this.updatedSteamApps,
        );
      });
    });

    describe("gets one game out of a batch of two steamApps, and inserts it into the database. So,", function () {
      beforeEach(async function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.apps = [
          { appid: 1, name: "Animaddicts" },
          { appid: 2, name: "Glitchhikers Soundtrack" },
        ];

        this.htmlDetailsPages = [
          animaddicts2gameHtmlDetailsPage,
          glitchhikersSoundtrackHtmlDetailsPage,
        ];

        this.games = discoverGamesFromSteamWeb(this.apps, this.htmlDetailsPages);

        this.historychecks = HistoryCheck.manyFromGames(this.games);

        this.instantiatedApps = SteamApp.manyFromSteamApi(this.apps);

        this.updatedSteamApps = updateTypeSideEffectFree(
          this.instantiatedApps,
          this.htmlDetailsPages,
        );

        this.steamClientMock = createSteamMock([
          animaddicts2gameHtmlDetailsPage,
          glitchhikersSoundtrackHtmlDetailsPage,
        ]);

        this.steamAppsRepository = createSteamAppsRepositoryMock(
          this.instantiatedApps,
          undefined,
        );
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        await this.identifier.tryViaSteamWeb();
      });

      it("getSteamWebUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamWebUntriedFilteredSteamApps was called with 'this.#options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamWebUntriedFilteredSteamApps was called before getSteamAppHtmlDetailsPage", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamAppHtmlDetailsPage);
      });

      it("getSteamAppHtmlDetailsPage was called twice", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledTimes(2);
      });

      it("getSteamAppHtmlDetailsPage was called with each instantiated id", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledWith(
          this.instantiatedApps[0].appid,
        );
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledWith(
          this.instantiatedApps[1].appid,
        );
      });

      it("getSteamAppHtmlDetailsPage was called before insertManyGames", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledBefore(
          this.gamesRepository.insertManyGames,
        );
      });

      it("insertManyGames was called once", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(1);
      });

      it("insertManyGames was called with this.games", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledWith(this.games);
      });

      it("insertManyGames was called before insertManyHistoryChecks", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledBefore(
          this.historyChecksRepository.insertManyHistoryChecks,
        );
      });

      it("insertManyHistoryChecks was called once", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("insertManyHistoryChecks was called with this.historychecks", function () {
        expect(this.historyChecksRepository.insertManyHistoryChecks).toHaveBeenCalledWith(
          this.historychecks,
        );
      });

      it("insertManyHistoryChecks was called before updateSteamAppsById", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledBefore(this.steamAppsRepository.updateSteamAppsById);
      });

      it("updateSteamAppsById was called once", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(1);
      });

      it("updateSteamAppsById was called with this.updatedSteamApps", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledWith(
          this.updatedSteamApps,
        );
      });
    });

    describe("gets two games out of a batch of three steamApps, and inserts them into the database. So,", function () {
      beforeEach(async function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.apps = [
          { appid: 1, name: "Animaddicts" },
          { appid: 2, name: "Glitchhikers Soundtrack" },
          { appid: 3, name: "Mortal Darkness" },
        ];

        this.htmlDetailsPages = [
          animaddicts2gameHtmlDetailsPage,
          glitchhikersSoundtrackHtmlDetailsPage,
          mortalDarknessGameHtmlDetailsPage,
        ];

        this.instantiatedApps = SteamApp.manyFromSteamApi(this.apps);

        this.games = discoverGamesFromSteamWeb(
          this.instantiatedApps,
          this.htmlDetailsPages,
        );

        this.historychecks = HistoryCheck.manyFromGames(this.games);

        this.updatedSteamApps = updateTypeSideEffectFree(
          this.instantiatedApps,
          this.htmlDetailsPages,
        );

        this.steamClientMock = createSteamMock([
          animaddicts2gameHtmlDetailsPage,
          glitchhikersSoundtrackHtmlDetailsPage,
          mortalDarknessGameHtmlDetailsPage,
        ]);

        this.steamAppsRepository = createSteamAppsRepositoryMock(
          this.instantiatedApps,
          undefined,
        );
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        await this.identifier.tryViaSteamWeb();
      });

      it("getSteamWebUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamWebUntriedFilteredSteamApps was called with 'this.options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamWebUntriedFilteredSteamApps was called before getSteamAppHtmlDetailsPage", function () {
        expect(
          this.steamAppsRepository.getSteamWebUntriedFilteredSteamApps,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamAppHtmlDetailsPage);
      });

      it("getSteamAppHtmlDetailsPage was called three times", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledTimes(3);
      });

      it("getSteamAppHtmlDetailsPage was called with each instantiated appid", function () {
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledWith(
          this.instantiatedApps[0].appid,
        );
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledWith(
          this.instantiatedApps[1].appid,
        );
        expect(this.steamClientMock.getSteamAppHtmlDetailsPage).toHaveBeenCalledWith(
          this.instantiatedApps[2].appid,
        );
      });

      it("insertManyGames was called once", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(1);
      });

      it("insertManyGames was called before insertManyHistoryChecks", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledBefore(
          this.historyChecksRepository.insertManyHistoryChecks,
        );
      });

      it("insertManyGames was called with this.games", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledWith(this.games);
      });

      it("insertManyHistoryChecks was called once", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("insertManyHistoryChecks was called before updateSteamAppsById", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledBefore(this.steamAppsRepository.updateSteamAppsById);
      });

      it("insertManyHistoryChecks was called with this.historychecks", function () {
        expect(this.historyChecksRepository.insertManyHistoryChecks).toHaveBeenCalledWith(
          this.historychecks,
        );
      });

      it("updateSteamAppsById was called once", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(1);
      });

      it("updateSteamAppsById was called with this.updatedSteamApps", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledWith(
          this.updatedSteamApps,
        );
      });
    });
  });

  describe(".tryViaSteamchartsWeb", function () {
    describe("gets zero steamApps from the database and stops. So,", function () {
      beforeEach(function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.steamClientMock = createSteamMock([undefined]);

        this.steamAppsRepository = createSteamAppsRepositoryMock(undefined, []);
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        this.identifier.tryViaSteamchartsWeb();
      });

      it("getSteamchartsUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamchartsUntriedFilteredSteamApps was called with 'this.options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamchartsGameHtmlDetailsPage was not called", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledTimes(0);
      });

      it("insertManyGames was not called", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(0);
      });

      it("insertManyHistoryChecks was not called", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(0);
      });

      it("updateSteamAppsById was not called", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(0);
      });
    });

    describe("gets one game from a batch of two steamApps from the database and inserts them into the database. So,", function () {
      beforeEach(async function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.apps = [
          { appid: 1, name: "Elden Ring" },
          { appid: 2, name: "Swords and Soldiers Beta" },
        ];

        this.htmlDetailsPages = [
          eldenRingHttpDetailsSteamcharts,
          swordsAndSoldiersBetaSteamcharts,
        ];

        this.game = [Game.fromSteamcharts(this.apps[0])];

        this.instantiatedApps = SteamApp.manyFromSteamApi(this.apps);

        this.instantiatedMarkedApps = instantiateAndMark(this.apps);

        this.historychecks = HistoryCheck.manyFromGames(this.game);

        this.steamClientMock = createSteamMock([
          eldenRingHttpDetailsSteamcharts,
          undefined,
        ]);

        this.steamAppsRepository = createSteamAppsRepositoryMock(
          undefined,
          this.instantiatedApps,
        );
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        await this.identifier.tryViaSteamchartsWeb();
      });

      it("getSteamchartsUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamchartsUntriedFilteredSteamApps was called with 'this.options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamchartsUntriedFilteredSteamApps was called before getSteamchartsGameHtmlDetailsPage", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamchartsGameHtmlDetailsPage);
      });

      it("getSteamchartsGameHtmlDetailsPage was called two times", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledTimes(2);
      });

      it("getSteamAppHtmlDetailsPage was called with each instantiated appid", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledWith(this.instantiatedApps[0].appid);
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledWith(this.instantiatedApps[1].appid);
      });

      it("getSteamchartsGameHtmlDetailsPage was called before insertManyGames", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledBefore(this.gamesRepository.insertManyGames);
      });

      it("insertManyGames was called once", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(1);
      });

      it("insertManyGames was called with this.games", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledWith(this.game);
      });

      it("insertManyGames was called before insertManyHistoryChecks", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledBefore(
          this.historyChecksRepository.insertManyHistoryChecks,
        );
      });

      it("insertManyHistoryChecks was called once", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("insertManyHistoryChecks was called with this.historychecks", function () {
        expect(this.historyChecksRepository.insertManyHistoryChecks).toHaveBeenCalledWith(
          this.historychecks,
        );
      });

      it("insertManyHistoryChecks was called before updateSteamAppsById", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledBefore(this.steamAppsRepository.updateSteamAppsById);
      });

      it("updateSteamAppsById was called once", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(1);
      });

      it("updateSteamAppsById was called with this.instantiatedApps", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledWith(
          this.instantiatedMarkedApps,
        );
      });
    });

    describe("gets two games from a batch of three steamApps from the database and inserts them into the database. So,", function () {
      beforeEach(async function () {
        this.options = {
          batchSize: 1,
          unitDelay: 0,
        };

        this.apps = [
          { appid: 1, name: "Elden Ring" },
          { appid: 2, name: "Swords and Soldiers Beta" },
          { appid: 3, name: "Mortal Darkness" },
        ];

        this.htmlDetailsPages = [
          eldenRingHttpDetailsSteamcharts,
          swordsAndSoldiersBetaSteamcharts,
          mortalDarknessGameHtmlDetailsPage,
        ];

        this.games = [
          Game.fromSteamcharts(this.apps[0]),
          Game.fromSteamcharts(this.apps[2]),
        ];

        this.instantiatedApps = SteamApp.manyFromSteamApi(this.apps);

        this.instantiatedMarkedApps = instantiateAndMark(this.apps);

        this.historychecks = HistoryCheck.manyFromGames(this.games);

        this.steamClientMock = createSteamMock([
          eldenRingHttpDetailsSteamcharts,
          undefined,
          mortalDarknessGameHtmlDetailsPage,
        ]);

        this.steamAppsRepository = createSteamAppsRepositoryMock(
          undefined,
          this.instantiatedApps,
        );
        this.gamesRepository = createGamesRepositoryMock();
        this.historyChecksRepository = createHistoryChecksRepositoryMock();

        this.identifier = new GameIdentifier(
          this.steamClientMock,
          this.steamAppsRepository,
          this.gamesRepository,
          this.historyChecksRepository,
          this.options,
        );

        await this.identifier.tryViaSteamchartsWeb();
      });

      it("getSteamchartsUntriedFilteredSteamApps was called once", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledTimes(1);
      });

      it("getSteamchartsUntriedFilteredSteamApps was called with 'this.options.batchSize'", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledWith(this.options.batchSize);
      });

      it("getSteamchartsUntriedFilteredSteamApps was called before getSteamAppHtmlDetailsPage", function () {
        expect(
          this.steamAppsRepository.getSteamchartsUntriedFilteredSteamApps,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamchartsGameHtmlDetailsPage);
      });

      it("getSteamchartsGameHtmlDetailsPage was called three times", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledTimes(3);
      });

      it("getSteamAppHtmlDetailsPage was called with each instantiated appid", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledWith(this.instantiatedApps[0].appid);
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledWith(this.instantiatedApps[1].appid);
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledWith(this.instantiatedApps[2].appid);
      });

      it("getSteamchartsGameHtmlDetailsPage was called before insertManyGames", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledBefore(this.gamesRepository.insertManyGames);
      });

      it("insertManyGames was called once", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledTimes(1);
      });

      it("insertManyGames was called with this.games", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledWith(this.games);
      });

      it("insertManyGames was called before insertManyHistoryChecks", function () {
        expect(this.gamesRepository.insertManyGames).toHaveBeenCalledBefore(
          this.historyChecksRepository.insertManyHistoryChecks,
        );
      });

      it("insertManyHistoryChecks was called once", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("insertManyHistoryChecks was called with this.historychecks", function () {
        expect(this.historyChecksRepository.insertManyHistoryChecks).toHaveBeenCalledWith(
          this.historychecks,
        );
      });

      it("insertManyHistoryChecks was called before updateSteamAppsById", function () {
        expect(
          this.historyChecksRepository.insertManyHistoryChecks,
        ).toHaveBeenCalledBefore(this.steamAppsRepository.updateSteamAppsById);
      });

      it("updateSteamAppsById was called once", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledTimes(1);
      });

      it("updateSteamAppsById was called with this.instantiatedMarkedApps", function () {
        expect(this.steamAppsRepository.updateSteamAppsById).toHaveBeenCalledWith(
          this.instantiatedMarkedApps,
        );
      });
    });
  });
});

function createSteamMock(args) {
  const spyObj = jasmine.createSpyObj("steamClient", [
    "getSteamAppHtmlDetailsPage",
    "getSteamchartsGameHtmlDetailsPage",
  ]);

  spyObj.getSteamAppHtmlDetailsPage.and.returnValues(...args);
  spyObj.getSteamchartsGameHtmlDetailsPage.and.returnValues(...args);

  return spyObj;
}

function createSteamAppsRepositoryMock(steamWebDbRet, steamchartsWebDbRet) {
  return jasmine.createSpyObj("SteamAppsRepository", {
    getSteamWebUntriedFilteredSteamApps: Promise.resolve(steamWebDbRet),
    updateSteamAppsById: Promise.resolve(undefined),
    getSteamchartsUntriedFilteredSteamApps: Promise.resolve(steamchartsWebDbRet),
  });
}

function createGamesRepositoryMock() {
  return jasmine.createSpyObj("GamesRepository", {
    insertManyGames: Promise.resolve(undefined),
  });
}

function createHistoryChecksRepositoryMock() {
  return jasmine.createSpyObj("HistoryChecksRepository", {
    insertManyHistoryChecks: Promise.resolve(undefined),
  });
}

function instantiateAndMark(apps) {
  const instantiatedApps = SteamApp.manyFromSteamApi(apps);

  instantiatedApps[0].appType = SteamApp.validTypes.game;

  if (instantiatedApps[2]) instantiatedApps[2].appType = SteamApp.validTypes.game;

  for (let app of instantiatedApps) {
    app.triedViaSteamchartsWeb();
  }

  return instantiatedApps;
}
