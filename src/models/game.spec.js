import { Game } from "./game.js";
import { PlayerHistory } from "./player.history.js";
import { animaddicts2gameHtmlDetailsPage } from "../../assets/steam-details-pages/animaddicts.2.game.html.details.page.js";
import { animaddicts2gameMissingClassesPage } from "../../assets/steam-details-pages/animaddicts.2.game.missing.classes.page.js";
import { JSDOM } from "jsdom";

describe("game.js", function () {
  describe("Game", function () {
    describe(".fromSteamApp", function () {
      describe("is called with no arguments, ", function () {
        it("an Error is thrown", function () {
          expect(Game.fromSteamApp).toThrowError();
        });
      });

      describe("is called with incomplete arguments, ", function () {
        beforeEach(function () {
          this.testObject = {
            id: 123,
            name: "test game",
          };
        });

        it("an Error is thrown", function () {
          expect(Game.fromSteamApp.bind(this.testObject)).toThrowError();
        });
      });

      describe("is called with appropriate attributes, the returned value", function () {
        beforeEach(function () {
          this.testObject = {
            appid: 123,
            name: "test game",
            imageUrl: "test url",
            playerHistory: [],
          };

          const htmlPage = animaddicts2gameHtmlDetailsPage;

          this.result = Game.fromSteamApp(this.testObject, new JSDOM(htmlPage));
        });

        it("is an instance of Game", function () {
          expect(this.result).toBeInstanceOf(Game);
        });

        it("has an 'id' property which equals 123", function () {
          expect(this.result.id).toBe(this.testObject.appid);
        });

        it("has a 'name' property which equals 'test game'", function () {
          expect(this.result.name).toBe(this.testObject.name);
        });

        it("has a 'releaseDate' property which equals '3 Mar, 2022", function () {
          expect(this.result.releaseDate).toBe("3 Mar, 2022");
        });

        it("has a 'developers' property which equals 'Crossplatform'", function () {
          expect(this.result.developers[0]).toBe("Crossplatform");
        });

        it("has an 'imageUrl' property which equals a link", function () {
          expect(this.result.imageUrl).toBe(
            `https://cdn.akamai.steamstatic.com/steam/apps/${this.testObject.appid}/header.jpg`,
          );
        });

        it("has a 'playerHistory' property which equals an empty array", function () {
          expect(this.result.playerHistory).toEqual(this.testObject.playerHistory);
        });
      });

      describe("is called with appropriate attributes, but the htmlPage doesn't contain the proper classes, the returned value", function () {
        beforeEach(function () {
          this.testObject = {
            appid: 123,
            name: "test game",
            imageUrl: "test url",
            playerHistory: [],
          };

          const htmlPage = animaddicts2gameMissingClassesPage;

          this.result = Game.fromSteamApp(this.testObject, new JSDOM(htmlPage));
        });

        it("is an instance of Game", function () {
          expect(this.result).toBeInstanceOf(Game);
        });

        it("has an 'id' property which equals 123", function () {
          expect(this.result.id).toBe(this.testObject.appid);
        });

        it("has a 'name' property which equals 'test game'", function () {
          expect(this.result.name).toBe(this.testObject.name);
        });

        it("has a 'releaseDate' property which equals an empty string", function () {
          expect(this.result.releaseDate).toBe("");
        });

        it("has a 'developers' property which equals an empty array", function () {
          expect(this.result.developers).toEqual([]);
        });

        it("has an 'imageUrl' property which equals a link", function () {
          expect(this.result.imageUrl).toBe(
            `https://cdn.akamai.steamstatic.com/steam/apps/${this.testObject.appid}/header.jpg`,
          );
        });

        it("has a 'playerHistory' property which equals an empty array", function () {
          expect(this.result.playerHistory).toEqual(this.testObject.playerHistory);
        });
      });
    });

    describe(".fromSteamcharts", function () {
      describe("is called with no arguments, ", function () {
        it("an Error is thrown", function () {
          expect(Game.fromSteamApp).toThrowError();
        });
      });

      describe("is called with incomplete arguments, ", function () {
        beforeEach(function () {
          this.testObject = {
            id: 123,
            name: "test game",
          };
        });

        it("an Error is thrown", function () {
          expect(Game.fromSteamcharts.bind(this.testObject)).toThrowError();
        });
      });

      describe("is called with appropriate attributes, the returned value", function () {
        beforeEach(function () {
          this.testObject = {
            appid: 123,
            name: "test game",
            imageUrl: "test url",
            playerHistory: [],
          };

          this.result = Game.fromSteamcharts(this.testObject);
        });

        it("is an instance of Game", function () {
          expect(this.result).toBeInstanceOf(Game);
        });

        it("has an 'id' property which equals 123", function () {
          expect(this.result.id).toBe(this.testObject.appid);
        });

        it("has a 'name' property which equals 'test game'", function () {
          expect(this.result.name).toBe(this.testObject.name);
        });

        it("has a 'releaseDate' property which equals an empty string", function () {
          expect(this.result.releaseDate).toBe("");
        });

        it("has a 'developers' property which equals an empty array", function () {
          expect(this.result.developers).toEqual([]);
        });

        it("has an 'imageUrl' property which equals a link", function () {
          expect(this.result.imageUrl).toBe(
            `https://cdn.akamai.steamstatic.com/steam/apps/${this.testObject.appid}/header.jpg`,
          );
        });

        it("has a 'playerHistory' property which equals an empty array", function () {
          expect(this.result.playerHistory).toEqual(this.testObject.playerHistory);
        });
      });
    });

    describe(".fromDbEntry", function () {
      describe("is called with no arguments, ", function () {
        it("an Error is thrown", function () {
          expect(Game.fromDbEntry).toThrowError();
        });
      });

      describe("is called with incomplete arguments, ", function () {
        beforeEach(function () {
          this.testObject = {
            id: 123,
            name: "test game",
          };
        });

        it("an Error is thrown", function () {
          expect(Game.fromDbEntry.bind(this.testObject)).toThrowError();
        });
      });

      describe("is called with appropriate attributes, the returned value", function () {
        beforeEach(function () {
          this.testObject = {
            id: 123,
            name: "test game",
            releaseDate: "3 Mar, 2022",
            developers: ["Crossplatform"],
            imageUrl: "test url",
            playerHistory: [],
          };

          this.result = Game.fromDbEntry(this.testObject);
        });

        it("is an instance of Game", function () {
          expect(this.result).toBeInstanceOf(Game);
        });

        it("has an 'id' property which equals 123", function () {
          expect(this.result.id).toBe(this.testObject.id);
        });

        it("has a 'name' property which equals 'test game'", function () {
          expect(this.result.name).toBe(this.testObject.name);
        });

        it("has a 'releaseDate' property which equals '3 Mar, 2022", function () {
          expect(this.result.releaseDate).toBe("3 Mar, 2022");
        });

        it("has a 'developers' property which equals 'Crossplatform", function () {
          expect(this.result.developers[0]).toBe("Crossplatform");
        });

        it("has an 'imageUrl' property which equals 'test url'", function () {
          expect(this.result.imageUrl).toBe(this.testObject.imageUrl);
        });

        it("has a 'playerHistory' property which equals an empty array", function () {
          expect(this.result.playerHistory).toEqual(this.testObject.playerHistory);
        });
      });
    });

    describe(".pushCurrentPlayers creates a new player history entry or updates an existing one.", function () {
      describe("When this month's player history entry already exists,", function () {
        describe("players are added to the existing entry.", function () {
          beforeEach(function () {
            this.currentPlayers = 45;

            const playerHistory = [
              {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                averagePlayers: 0,
                trackedPlayers: [],
              },
            ];

            this.historyLength = playerHistory.length;

            const game = {
              id: 1,
              name: "Test Game",
              playerHistory: PlayerHistory.manyFromDbEntry(playerHistory),
            };

            this.result = Game.fromDbEntry(game);

            this.result.pushCurrentPlayers(this.currentPlayers);
          });

          it("No new entry is created", function () {
            expect(this.result.playerHistory.length).toBe(this.historyLength);
          });

          it("The existing entry is updated.", function () {
            expect(this.result.playerHistory[0]).toBeInstanceOf(PlayerHistory);
            expect(this.result.playerHistory[0].trackedPlayers[0].players).toBe(
              this.currentPlayers,
            );
          });
        });
      });

      describe("When this month's player history entry does not exist yet", function () {
        describe("An entry for the current month is created. So,", function () {
          beforeEach(function () {
            this.currentPlayers = 33;

            const playerHistory = [
              {
                year: "2022",
                month: "10",
                averagePlayers: 75,
                trackedPlayers: [],
              },
            ];

            this.game = {
              id: 1,
              name: "Test Game",
              playerHistory: PlayerHistory.manyFromDbEntry(playerHistory),
            };

            this.result = Game.fromDbEntry(this.game);

            this.result.pushCurrentPlayers(this.currentPlayers);
          });

          it("this month's entry is created", function () {
            expect(this.result.playerHistory.length).toBe(2);
            expect(this.result.playerHistory[1]).toBeInstanceOf(PlayerHistory);
          });

          it("the last time we checked the game was played by 33 players", function () {
            expect(this.result.playerHistory[1].trackedPlayers[0].players).toBe(
              this.currentPlayers,
            );
          });

          it("the existing entry does not change", function () {
            expect(this.game.playerHistory[0]).toEqual(this.result.playerHistory[0]);
          });
        });
      });
    });

    describe(".pushSteamchartsPlayerHistory adds player histories from Steamcharts to existing entries while keeping the order intact.", function () {
      beforeEach(function () {
        const steamApp = {
          appid: 1,
          name: "Test Game",
        };

        const htmlPage = animaddicts2gameHtmlDetailsPage;

        this.result = Game.fromSteamApp(steamApp, new JSDOM(htmlPage));

        this.result.pushCurrentPlayers(513);

        const gameHistories = [];
        gameHistories.push(PlayerHistory.fromRawData(5, "April 2020"));
        gameHistories.push(PlayerHistory.fromRawData(15, "July 2020"));
        gameHistories.push(PlayerHistory.fromRawData(55, "February 2020"));

        this.result.pushSteamchartsPlayerHistory(gameHistories);
      });

      it("The game has three new player history entries", function () {
        expect(this.result.playerHistory.length).toBe(4);
      });

      it("All player history entries are in correct order", function () {
        expect(this.result.playerHistory[0].averagePlayers).toBe(55);
        expect(this.result.playerHistory[1].averagePlayers).toBe(5);
        expect(this.result.playerHistory[2].averagePlayers).toBe(15);
        expect(this.result.playerHistory[3].averagePlayers).toBe(513);
      });

      it("The games player history entries are new PlayerHistory class instances", function () {
        expect(this.result.playerHistory[0]).toBeInstanceOf(PlayerHistory);
        expect(this.result.playerHistory[1]).toBeInstanceOf(PlayerHistory);
        expect(this.result.playerHistory[2]).toBeInstanceOf(PlayerHistory);
        expect(this.result.playerHistory[3]).toBeInstanceOf(PlayerHistory);
      });
    });
  });
});
