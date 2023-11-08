import { PlayerHistoryAggregator } from "./player.history.aggregator.js";
import { crushTheCastleHtmlDetailsSteamcharts } from "../../../assets/steamcharts-details-pages/crush.the.castle.legacy.collection.html.details.page.js";
import { oneGameWithUncheckedPlayerHistory } from "../../../assets/db-responses/one.game.unchecked.history.js";
import { twoGamesWithUncheckedPlayerHistory } from "../../../assets/db-responses/two.games.unchecked.history.js";
import { HistoryCheck } from "../../models/history.check.js";
import { Game } from "../../models/game.js";
import { addPlayerHistoriesFromSteamcharts } from "./services/player.history.service.js";

describe("PlayerHistoryAggregator", function () {
  describe(".addPlayerHistoryFromSteamcharts", function () {
    describe("finds the player history for one game in a batch of one and updates the game data", function () {
      beforeEach(async function () {
        this.steamClientMock = createSteamMock([crushTheCastleHtmlDetailsSteamcharts]);

        this.gamesRepositoryMock = createGamesRepositoryMock(
          Game.manyFromDbEntry(oneGameWithUncheckedPlayerHistory),
        );
        this.historyChecksRepositoryMock = createHistoryChecksRepositoryMock();
        this.playerHistoryRepositoryMock = createPlayerHistoryRepositoryMock();

        [this.historyChecks, this.games] = createMap([
          [
            Game.fromDbEntry(twoGamesWithUncheckedPlayerHistory[0]),
            crushTheCastleHtmlDetailsSteamcharts,
          ],
        ]);

        this.agg = new PlayerHistoryAggregator(
          this.steamClientMock,
          this.gamesRepositoryMock,
          this.historyChecksRepositoryMock,
          this.playerHistoryRepositoryMock,
          { unitDelay: 0, batchSize: 1 },
        );

        await this.agg.addPlayerHistoryFromSteamcharts();
      });

      it("calls .getXgamesWithUncheckedPlayerHistory once", function () {
        expect(
          this.gamesRepositoryMock.getXgamesWithUncheckedPlayerHistory,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getXgamesWithUncheckedPlayerHistory before .getSteamchartsGameHtmlDetailsPage", function () {
        expect(
          this.gamesRepositoryMock.getXgamesWithUncheckedPlayerHistory,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamchartsGameHtmlDetailsPage);
      });

      it("calls .getSteamchartsGameHtmlDetailsPage once", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getSteamchartsGameHtmlDetailsPage before .updateHistoryChecks", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledBefore(this.historyChecksRepositoryMock.updateHistoryChecks);
      });

      it("calls .updateHistoryChecks once", function () {
        expect(
          this.historyChecksRepositoryMock.updateHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .updateHistoryChecks with historyChecks", function () {
        expect(this.historyChecksRepositoryMock.updateHistoryChecks).toHaveBeenCalledWith(
          this.historyChecks,
        );
      });

      it("calls .updateHistoryChecks before .updatePlayerHistoriesById", function () {
        expect(
          this.historyChecksRepositoryMock.updateHistoryChecks,
        ).toHaveBeenCalledBefore(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        );
      });

      it("calls .updatePlayerHistoriesById once", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .updatePlayerHistoriesById with games", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).toHaveBeenCalledWith(this.games);
      });
    });

    describe("finds the player history for one game in a batch of two and updates the game data", () => {
      beforeEach(async function () {
        this.steamClientMock = createSteamMock([crushTheCastleHtmlDetailsSteamcharts]);

        this.gamesRepositoryMock = createGamesRepositoryMock(
          Game.manyFromDbEntry(twoGamesWithUncheckedPlayerHistory),
        );

        this.historyChecksRepositoryMock = createHistoryChecksRepositoryMock();
        this.playerHistoryRepositoryMock = createPlayerHistoryRepositoryMock();

        [this.historyChecks, this.games] = createMap([
          [
            Game.fromDbEntry(twoGamesWithUncheckedPlayerHistory[0]),
            crushTheCastleHtmlDetailsSteamcharts,
          ],
          [Game.fromDbEntry(twoGamesWithUncheckedPlayerHistory[1]), ""],
        ]);

        this.agg = new PlayerHistoryAggregator(
          this.steamClientMock,
          this.gamesRepositoryMock,
          this.historyChecksRepositoryMock,
          this.playerHistoryRepositoryMock,
          { unitDelay: 0, batchSize: 2 },
        );

        await this.agg.addPlayerHistoryFromSteamcharts();
      });

      it("calls .getXgamesWithUncheckedPlayerHistory once", function () {
        expect(
          this.gamesRepositoryMock.getXgamesWithUncheckedPlayerHistory,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getXgamesWithUncheckedPlayerHistory before .getSteamchartsGameHtmlDetailsPage", function () {
        expect(
          this.gamesRepositoryMock.getXgamesWithUncheckedPlayerHistory,
        ).toHaveBeenCalledBefore(this.steamClientMock.getSteamchartsGameHtmlDetailsPage);
      });

      it("calls .getSteamchartsGameHtmlDetailsPage twice", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledTimes(2);
      });

      it("calls .getSteamchartsGameHtmlDetailsPage before .updateHistoryChecks", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).toHaveBeenCalledBefore(this.historyChecksRepositoryMock.updateHistoryChecks);
      });

      it("calls .updateHistoryChecks once", function () {
        expect(
          this.historyChecksRepositoryMock.updateHistoryChecks,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .updateHistoryChecks with historyChecks", function () {
        expect(this.historyChecksRepositoryMock.updateHistoryChecks).toHaveBeenCalledWith(
          this.historyChecks,
        );
      });

      it("calls .updateHistoryChecks before .updatePlayerHistoriesById", function () {
        expect(
          this.historyChecksRepositoryMock.updateHistoryChecks,
        ).toHaveBeenCalledBefore(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        );
      });

      it("calls .updatePlayerHistoriesById once", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .updatePlayerHistoriesById with games", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).toHaveBeenCalledWith(this.games);
      });
    });

    describe("finds no games in the database and finishes", () => {
      beforeEach(async function () {
        this.steamClientMock = createSteamMock([], "");

        this.gamesRepositoryMock = createGamesRepositoryMock([]);
        this.historyChecksRepositoryMock = createHistoryChecksRepositoryMock();
        this.playerHistoryRepositoryMock = createPlayerHistoryRepositoryMock();

        this.agg = new PlayerHistoryAggregator(
          this.steamClientMock,
          this.gamesRepositoryMock,
          this.historyChecksRepositoryMock,
          this.playerHistoryRepositoryMock,
          { unitDelay: 0, batchSize: 1 },
        );

        await this.agg.addPlayerHistoryFromSteamcharts();
      });

      it("calls .getXgamesWithUncheckedPlayerHistory once", function () {
        expect(
          this.gamesRepositoryMock.getXgamesWithUncheckedPlayerHistory,
        ).toHaveBeenCalledTimes(1);
      });

      it("does not call .getSteamchartsGameHtmlDetailsPage", function () {
        expect(
          this.steamClientMock.getSteamchartsGameHtmlDetailsPage,
        ).not.toHaveBeenCalled();
      });

      it("does not call .updateHistoryChecks", function () {
        expect(
          this.historyChecksRepositoryMock.updateHistoryChecks,
        ).not.toHaveBeenCalled();
      });

      it("does not call .updatePlayerHistoriesById", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe(".addCurrentPlayers()", () => {
    describe("does not have any games to check for current player numbers", function () {
      beforeEach(async function () {
        this.gamesRepositoryMock = createGamesRepositoryMock("", []);
        this.historyChecksRepositoryMock = createHistoryChecksRepositoryMock();
        this.playerHistoryRepositoryMock = createPlayerHistoryRepositoryMock();

        this.steamClientMock = createSteamMock([], "");

        const agg = new PlayerHistoryAggregator(
          this.steamClientMock,
          this.gamesRepositoryMock,
          this.historyChecksRepositoryMock,
          this.playerHistoryRepositoryMock,
          { batchSize: 1, currentPlayersUpdateIntervalDelay: 0 },
        );

        await agg.addCurrentPlayers();
      });

      it("calls .getXgamesCheckedMoreThanYmsAgo once", function () {
        expect(
          this.gamesRepositoryMock.getXgamesCheckedMoreThanYmsAgo,
        ).toHaveBeenCalledTimes(1);
      });

      it("does not call .getAllCurrentPlayersConcurrently ever", function () {
        expect(
          this.steamClientMock.getAllCurrentPlayersConcurrently,
        ).not.toHaveBeenCalled();
      });
      it("does not call .updatePlayerHistoriesById ever", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).not.toHaveBeenCalled();
      });
    });

    describe("gets current players for one game in a batch of one, and adds the players", function () {
      beforeEach(async function () {
        jasmine.clock().mockDate(new Date());

        this.gamesRepositoryMock = createGamesRepositoryMock(
          "",
          Game.manyFromDbEntry(oneGameWithUncheckedPlayerHistory),
        );

        this.historyChecksRepositoryMock = createHistoryChecksRepositoryMock();
        this.playerHistoryRepositoryMock = createPlayerHistoryRepositoryMock();

        this.steamClientMock = createSteamMock([], [285]);

        this.gamesWithCurrentPlayers = Game.manyFromDbEntry(
          oneGameWithUncheckedPlayerHistory,
        ).map((game) => {
          game.pushCurrentPlayers(285);
          return game;
        });

        const agg = new PlayerHistoryAggregator(
          this.steamClientMock,
          this.gamesRepositoryMock,
          this.historyChecksRepositoryMock,
          this.playerHistoryRepositoryMock,
          { batchSize: 1, currentPlayersUpdateIntervalDelay: 0 },
        );

        await agg.addCurrentPlayers();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("calls .getXgamesCheckedMoreThanYmsAgo once", function () {
        expect(
          this.gamesRepositoryMock.getXgamesCheckedMoreThanYmsAgo,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getXgamesCheckedMoreThanYmsAgo  before .getAllCurrentPlayersConcurrently", function () {
        expect(
          this.gamesRepositoryMock.getXgamesCheckedMoreThanYmsAgo,
        ).toHaveBeenCalledBefore(this.steamClientMock.getAllCurrentPlayersConcurrently);
      });

      it("calls .getAllCurrentPlayersConcurrently once", function () {
        expect(
          this.steamClientMock.getAllCurrentPlayersConcurrently,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getAllCurrentPlayersConcurrently with this.gamesWithCurrentPlayers", function () {
        expect(
          this.steamClientMock.getAllCurrentPlayersConcurrently,
        ).toHaveBeenCalledWith(this.gamesWithCurrentPlayers);
      });

      it("calls .getAllCurrentPlayersConcurrently  before .updatePlayerHistoriesById", function () {
        expect(
          this.steamClientMock.getAllCurrentPlayersConcurrently,
        ).toHaveBeenCalledBefore(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        );
      });

      it("calls .updatePlayerHistoriesById once", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .updatePlayerHistoriesById with gamesWithCurrentPlayers", function () {
        expect(
          this.playerHistoryRepositoryMock.updatePlayerHistoriesById,
        ).toHaveBeenCalledWith(this.gamesWithCurrentPlayers);
      });
    });
  });
});

function createSteamMock(detailsPageRet, currentPlayersRet) {
  const spyObj = jasmine.createSpyObj("steamClient", [
    "getSteamchartsGameHtmlDetailsPage",
    "getAllCurrentPlayersConcurrently",
  ]);
  spyObj.getSteamchartsGameHtmlDetailsPage.and.returnValues(...detailsPageRet);
  spyObj.getAllCurrentPlayersConcurrently.and.returnValue(currentPlayersRet);

  return spyObj;
}

function createGamesRepositoryMock(uncheckedGames, checkedGames) {
  return jasmine.createSpyObj("GamesRepository", {
    getXgamesWithUncheckedPlayerHistory: Promise.resolve(uncheckedGames),
    getXgamesCheckedMoreThanYmsAgo: Promise.resolve(checkedGames),
  });
}

function createHistoryChecksRepositoryMock() {
  return jasmine.createSpyObj("HistoryChecks", {
    updateHistoryChecks: Promise.resolve(undefined),
  });
}

function createPlayerHistoryRepositoryMock() {
  return jasmine.createSpyObj("PlayerHistory", {
    updatePlayerHistoriesById: Promise.resolve(undefined),
    updatePlayerHistoriesById: Promise.resolve(undefined),
  });
}

function createMap(gamesPages) {
  const map = new Map(gamesPages);

  const historyChecks = HistoryCheck.manyFromSteamchartsPages(map);
  const games = addPlayerHistoriesFromSteamcharts(map);

  return [historyChecks, games];
}
