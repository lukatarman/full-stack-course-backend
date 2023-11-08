import { HistoryCheck } from "./history.check.js";

describe("history.check.js", function () {
  describe("HistoryCheck", function () {
    describe(".manyFromSteamchartsPages adds a HistoryCheck instance for each game in the gamesPagesMap.", function () {
      describe("When the gamesPagesMap's pages properties contain one truthy and one falsy value", function () {
        beforeEach(function () {
          this.firstGame = { id: 1 };
          this.secondGame = { id: 2 };

          this.map = new Map();

          this.map.set(this.firstGame, true);
          this.map.set(this.secondGame, false);

          this.result = HistoryCheck.manyFromSteamchartsPages(this.map);
        });

        it("the first entry is an instance of HistoryCheck", function () {
          expect(this.result[0]).toBeInstanceOf(HistoryCheck);
        });

        it("the first entry HistoryCheck instance 'gameId' property equals the passed in game id", function () {
          expect(this.result[0].gameId).toBe(this.firstGame.id);
        });

        it("the first entry HistoryCheck instance 'checked' property equals true", function () {
          expect(this.result[0].checked).toBeTrue();
        });

        it("the first entry HistoryCheck instance 'found' property equals true", function () {
          expect(this.result[0].found).toBeTrue();
        });

        it("the first entry HistoryCheck instance 'source' property equals 'steamCharts'", function () {
          expect(this.result[0].source).toBe("steamCharts");
        });

        it("the second entry is an instance of HistoryCheck", function () {
          expect(this.result[1]).toBeInstanceOf(HistoryCheck);
        });

        it("the second entry HistoryCheck instance 'gameId' property equals the passed in game id", function () {
          expect(this.result[1].gameId).toBe(this.secondGame.id);
        });

        it("the second entry HistoryCheck instance 'checked' property equals true", function () {
          expect(this.result[1].checked).toBeTrue();
        });

        it("the second entry HistoryCheck instance 'found' property equals false", function () {
          expect(this.result[1].found).toBeFalse();
        });

        it("the second entry HistoryCheck instance 'source' property equals 'steamCharts'", function () {
          expect(this.result[1].source).toBe("steamCharts");
        });
      });
    });

    describe(".manyFromGames adds a HistoryCheck instance for each game in games array", function () {
      describe("when the games array has two game values", function () {
        beforeEach(function () {
          this.games = [{ id: 1 }, { id: 2 }];

          this.result = HistoryCheck.manyFromGames(this.games);
        });

        it("the first entry is an instance of HistoryCheck", function () {
          expect(this.result[0]).toBeInstanceOf(HistoryCheck);
        });

        it("the first entry HistoryCheck instance 'gameId' property equals the first passed in game id", function () {
          expect(this.result[0].gameId).toBe(this.games[0].id);
        });

        it("the first entry HistoryCheck instance 'checked' property equals false", function () {
          expect(this.result[0].checked).toBeFalse();
        });

        it("the first entry HistoryCheck instance 'found' property equals false", function () {
          expect(this.result[0].found).toBeFalse();
        });

        it("the second entry is an instance of HistoryCheck", function () {
          expect(this.result[1]).toBeInstanceOf(HistoryCheck);
        });

        it("the second entry HistoryCheck instance 'gameId' property equals the first passed in game id", function () {
          expect(this.result[1].gameId).toBe(this.games[1].id);
        });

        it("the second entry HistoryCheck instance 'checked' property equals false", function () {
          expect(this.result[1].checked).toBeFalse();
        });

        it("the second entry HistoryCheck instance 'found' property equals false", function () {
          expect(this.result[1].found).toBeFalse();
        });
      });
    });
  });
});
