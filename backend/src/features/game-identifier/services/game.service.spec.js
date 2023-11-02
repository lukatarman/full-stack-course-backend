import {
  getSteamAppType,
  discoverGamesFromSteamWeb,
  updateTypeSideEffectFree,
  identifyGames,
  assignType,
  getReleaseDate,
  getDevelopers,
  getGenres,
  getGameDescription,
  updateMissingDetails,
  getSteamDbReleaseDate,
  getSteamDbDevelopers,
  getSteamDbGenres,
  getSteamDbDescription,
  updateMissingReleaseDates,
} from "./game.service.js";
import { animaddicts2gameHtmlDetailsPage } from "../../../../assets/steam-details-pages/animaddicts.2.game.html.details.page.js";
import { feartressGameHtmlDetailsPage } from "../../../../assets/steam-details-pages/feartress.game.html.details.page.js";
import { glitchhikersSoundtrackHtmlDetailsPage } from "../../../../assets/steam-details-pages/glitchhikers.soundtrack.html.details.page.js";
import { gta5ageRestrictedHtmlDetailsPage } from "../../../../assets/steam-details-pages/gta.5.age.restricted.html.details.page.js";
import { padakVideoHtmlDetailsPage } from "../../../../assets/steam-details-pages/padak.video.html.details.page.js";
import { theSims4dlcHtmlDetailsPage } from "../../../../assets/steam-details-pages/the.sims.4.dlc.html.details.page.js";
import { Game } from "../../../models/game.js";
import { SteamApp } from "../../../models/steam.app.js";
import { mortalDarknessGameHtmlDetailsPage } from "../../../../assets/steam-details-pages/mortal.darkness.game.html.details.page.js";
import { crusaderKingsDetailsPage } from "../../../../assets/steam-details-pages/crusader.kings.multiple.developers.html.details.page.js";
import { riskOfRainHtmlDetailsPageMissingInfo } from "../../../../assets/steam-details-pages/risk.of.rain.missing.additional.info.page.js";
import { ValidDataSources } from "../../../utils/valid.data.sources.js";
import { counterStrikeHtmlDetailsSteamDb } from "../../../../assets/steamdb-details-pages/counter.strike.html.details.page.js";
import { riskOfRainHtmlDetailsSteamDb } from "../../../../assets/steamdb-details-pages/risk.of.rain.html.details.page.js";
import { karmazooHtmlDetailsPageSteamDb } from "../../../../assets/steamdb-details-pages/karmazoo.html.details.page.js";
import { getXsteamchartsInstantiatedGames } from "../../../models/game.mocks.js";

describe("game.service.js", () => {
  describe(".getSteamAppType", () => {
    describe("game is age restricted - there is no .blockbg class on the page", () => {
      let appType;

      beforeAll(async () => {
        appType = getSteamAppType(gta5ageRestrictedHtmlDetailsPage);
      });

      it("the function returns 'unknown'", () => {
        expect(appType).toBe(SteamApp.validTypes.unknown);
      });
    });

    describe("if there is no 'All Software' or 'All Games' in the first breadcrumb child text", () => {
      let appType;

      beforeAll(async () => {
        appType = getSteamAppType(padakVideoHtmlDetailsPage);
      });

      it("the function returns 'unknown'", () => {
        expect(appType).toBe(SteamApp.validTypes.unknown);
      });
    });

    describe("if the text 'Downloadable Content' is in one of the breadcrumbs", () => {
      let appType;

      beforeAll(async () => {
        appType = getSteamAppType(theSims4dlcHtmlDetailsPage);
      });

      it("the function returns 'downloadableContent'", () => {
        expect(appType).toBe(SteamApp.validTypes.downloadableContent);
      });
    });

    describe(".blockbg class is on the page, 'All Software' or 'All Games' is in the first breadcrumb and there is no 'Downloadable Content' text in the breadcrumbs", () => {
      let appType;

      beforeAll(async () => {
        appType = getSteamAppType(feartressGameHtmlDetailsPage);
      });

      it("the function returns 'game'", () => {
        expect(appType).toBe(SteamApp.validTypes.game);
      });
    });
  });

  describe(".discoverGamesFromSteamWeb", function () {
    describe("discovers one game out of a batch of one stemApp, so", function () {
      beforeEach(function () {
        this.steamApps = [
          {
            appid: 1,
            name: "Animaddicts",
          },
        ];
        this.htmlDetailsPages = [animaddicts2gameHtmlDetailsPage];

        this.games = discoverGamesFromSteamWeb(this.steamApps, this.htmlDetailsPages);
      });

      it("the length of games is 1", function () {
        expect(this.games.length).toBe(1);
      });

      it("the name of the first game array entry is 'Animaddicts'", function () {
        expect(this.games[0].name).toBe("Animaddicts");
      });

      it("the first entry in the games array is an instance of game", function () {
        expect(this.games[0]).toBeInstanceOf(Game);
      });
    });

    describe("discovers one game out of a batch of two steamApps, so", function () {
      beforeEach(function () {
        this.steamApps = [
          {
            appid: 1,
            name: "Animaddicts",
          },
          {
            appid: 2,
            name: "Glitchhikers Soundtrack 2",
          },
        ];

        this.htmlDetailsPages = [
          animaddicts2gameHtmlDetailsPage,
          glitchhikersSoundtrackHtmlDetailsPage,
        ];

        this.games = discoverGamesFromSteamWeb(this.steamApps, this.htmlDetailsPages);
      });

      it("the length of games is 1", function () {
        expect(this.games.length).toBe(1);
      });

      it("the name of the first game array entry is 'Animaddicts'", function () {
        expect(this.games[0].name).toBe("Animaddicts");
      });

      it("the first entry in the games array is an instance of game", function () {
        expect(this.games[0]).toBeInstanceOf(Game);
      });
    });

    describe("discovers two games out of a batch of three steamApps, so", function () {
      beforeEach(function () {
        this.steamApps = [
          {
            appid: 1,
            name: "Animaddicts",
          },
          {
            appid: 2,
            name: "Glitchhikers Soundtrack 2",
          },
          {
            appid: 3,
            name: "Feartress",
          },
        ];

        this.htmlDetailsPages = [
          animaddicts2gameHtmlDetailsPage,
          glitchhikersSoundtrackHtmlDetailsPage,
          feartressGameHtmlDetailsPage,
        ];

        this.games = discoverGamesFromSteamWeb(this.steamApps, this.htmlDetailsPages);
      });

      it("the length of games is 1", function () {
        expect(this.games.length).toBe(2);
      });

      it("the name of the first game array entry is 'Animaddicts'", function () {
        expect(this.games[0].name).toBe("Animaddicts");
      });

      it("the first entry in the games array is an instance of game", function () {
        expect(this.games[0]).toBeInstanceOf(Game);
      });

      it("the name of the second game array entry is 'Feartress'", function () {
        expect(this.games[1].name).toBe("Feartress");
      });

      it("the first entry in the games array is an instance of game", function () {
        expect(this.games[1]).toBeInstanceOf(Game);
      });
    });
  });

  describe(".getReleaseDate checks for a release date in the provided HTML page.", function () {
    describe("if the provided HTML page does not include a release date section,", function () {
      beforeEach(function () {
        this.result = getReleaseDate(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("the result is an empty string", function () {
        expect(this.result).toBe("");
      });
    });

    describe("if the provided HTML page includes a release date,", function () {
      beforeEach(function () {
        this.result = getReleaseDate(mortalDarknessGameHtmlDetailsPage);
      });

      it("the result is a date", function () {
        expect(this.result).toBeInstanceOf(Date);
      });
      it("the result is the correct date'", function () {
        expect(this.result.toISOString()).toEqual("2023-08-01T00:00:00.000Z");
      });
    });
  });

  describe(".getDevelopers checks for developers in the provided HTML page.", function () {
    describe("if the provided HTML page does not include any developers,", function () {
      beforeEach(function () {
        this.result = getDevelopers(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("the result is an empty array", function () {
        expect(this.result).toEqual([]);
      });
    });

    describe("if the provided HTML page includes one developer,", function () {
      beforeEach(function () {
        this.result = getDevelopers(mortalDarknessGameHtmlDetailsPage);
      });

      it("the result is an array with one value", function () {
        expect(this.result.length).toBe(1);
      });

      it("the result is 'Dark Faction Games'", function () {
        expect(this.result[0]).toBe("Dark Faction Games");
      });
    });

    describe("if the provided HTML page includes two developers,", function () {
      beforeEach(function () {
        this.result = getDevelopers(crusaderKingsDetailsPage);
      });

      it("the result is an array with two values", function () {
        expect(this.result.length).toBe(2);
      });

      it("the first result is 'Paradox Development Studio'", function () {
        expect(this.result[0]).toBe("Paradox Development Studio");
      });

      it("the second result is 'Paradox Thalassic'", function () {
        expect(this.result[1]).toBe("Paradox Thalassic");
      });
    });
  });

  describe(".getGenres checks for genres in the provided HTML page.", function () {
    describe("if the provided HTML page does not include any genres,", function () {
      beforeEach(function () {
        this.result = getGenres(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("the result is an empty array", function () {
        expect(this.result).toEqual([]);
      });
    });

    describe("if the provided HTML page includes genres,", function () {
      beforeEach(function () {
        this.result = getGenres(mortalDarknessGameHtmlDetailsPage);
      });

      it("the resulting array has a length of 4", function () {
        expect(this.result.length).toBe(4);
      });
      it("the first result is 'Action'", function () {
        expect(this.result[0]).toBe("Action");
      });
      it("the fourth result is 'RPG'", function () {
        expect(this.result[3]).toBe("RPG");
      });
    });
  });

  describe(".getDescription checks for a game's description in the provided HTML page.", function () {
    describe("if the provided HTML page does not include a game description,", function () {
      beforeEach(function () {
        this.result = getGameDescription(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("the result is an empty string", function () {
        expect(this.result).toEqual("");
      });
    });

    describe("if the provided HTML page includes a description,", function () {
      beforeEach(function () {
        this.result = getGameDescription(mortalDarknessGameHtmlDetailsPage);
      });

      it("the resulting is a specific string", function () {
        expect(this.result).toBe(
          "“One grim dawn and noble I wake, The darkness is rampant, our oath shall break. A noble warrior soon shall rise, and clear the air of the darkened skies.”",
        );
      });
    });
  });

  describe(".updateTypeSideEffectFree", function () {
    describe("discovers one steamApp out of a batch of one, so", function () {
      beforeEach(function () {
        this.apps = [
          {
            appid: 1,
            name: "Glitchhikers Soundtrack 2",
          },
        ];

        this.steamApps = SteamApp.manyFromSteamApi(this.apps);

        this.htmlDetailsPages = [glitchhikersSoundtrackHtmlDetailsPage];

        this.updatedSteamApps = updateTypeSideEffectFree(
          this.steamApps,
          this.htmlDetailsPages,
        );
      });

      it("the length of updatedSteamApps is 1", function () {
        expect(this.updatedSteamApps.length).toBe(1);
      });

      it("the first entry in the updatedSteamApps array is an instance of SteamApp", function () {
        expect(this.updatedSteamApps[0]).toBeInstanceOf(SteamApp);
      });

      it("the name of the first updatedSteamApps array entry is 'Glitchhikers Soundtrack 2'", function () {
        expect(this.updatedSteamApps[0].name).toBe(this.apps[0].name);
      });

      it("the first array entry in updatedSteamApps has a property 'triedVia', and it's value is 'steamWeb'", function () {
        expect(this.updatedSteamApps[0].triedVia[0]).toBe(
          ValidDataSources.validDataSources.steamWeb,
        );
      });

      it("the first array entry in updatedSteamApps has a property 'type', and it's value is 'unknown'", function () {
        expect(this.updatedSteamApps[0].type).toBe(SteamApp.validTypes.unknown);
      });
    });

    describe("discovers one game and one downloadable content out of a batch of three steamApps, so", function () {
      beforeEach(function () {
        this.apps = [
          {
            appid: 1,
            name: "Glitchhikers Soundtrack 2",
          },
          {
            appid: 2,
            name: "Animaddicts",
          },
          {
            appid: 3,
            name: "The Sims 4 Cats and Dogs DLC",
          },
        ];

        this.steamApps = SteamApp.manyFromSteamApi(this.apps);

        this.htmlDetailsPages = [
          glitchhikersSoundtrackHtmlDetailsPage,
          animaddicts2gameHtmlDetailsPage,
          theSims4dlcHtmlDetailsPage,
        ];

        this.updatedSteamApps = updateTypeSideEffectFree(
          this.steamApps,
          this.htmlDetailsPages,
        );
      });

      it("the length of updatedSteamApps is 3", function () {
        expect(this.updatedSteamApps.length).toBe(3);
      });

      it("the first entry in the updatedSteamApps array is an instance of SteamApp", function () {
        expect(this.updatedSteamApps[0]).toBeInstanceOf(SteamApp);
      });

      it("the second entry in the updatedSteamApps array is an instance of SteamApp", function () {
        expect(this.updatedSteamApps[1]).toBeInstanceOf(SteamApp);
      });

      it("the third entry in the updatedSteamApps array is an instance of SteamApp", function () {
        expect(this.updatedSteamApps[2]).toBeInstanceOf(SteamApp);
      });

      it("the name of the first updatedSteamApps array entry is 'Glitchhikers Soundtrack 2'", function () {
        expect(this.updatedSteamApps[0].name).toBe(this.apps[0].name);
      });

      it("the name of the second updatedSteamApps array entry is 'Animaddicts'", function () {
        expect(this.updatedSteamApps[1].name).toBe(this.apps[1].name);
      });

      it("the name of the third updatedSteamApps array entry is 'The Sims 4 Cats and Dogs DLC'", function () {
        expect(this.updatedSteamApps[2].name).toBe(this.apps[2].name);
      });

      it("the first array entry in updatedSteamApps has a property 'triedVia', and it's value is 'steamWeb'", function () {
        expect(this.updatedSteamApps[0].triedVia[0]).toBe(
          ValidDataSources.validDataSources.steamWeb,
        );
      });

      it("the second array entry in updatedSteamApps has a property 'triedVia', and it's value is 'steamWeb'", function () {
        expect(this.updatedSteamApps[1].triedVia[0]).toBe(
          ValidDataSources.validDataSources.steamWeb,
        );
      });

      it("the third array entry in updatedSteamApps has a property 'triedVia', and it's value is 'steamWeb'", function () {
        expect(this.updatedSteamApps[2].triedVia[0]).toBe(
          ValidDataSources.validDataSources.steamWeb,
        );
      });

      it("the first entry in updatedSteamApps has a property 'type', and it's value is 'unknown'", function () {
        expect(this.updatedSteamApps[0].type).toBe(SteamApp.validTypes.unknown);
      });

      it("the second entry in updatedSteamApps has a property 'type', and it's value is 'game'", function () {
        expect(this.updatedSteamApps[1].type).toBe(SteamApp.validTypes.game);
      });

      it("the third entry in updatedSteamApps has a property 'type', and it's value is 'downloadableContent'", function () {
        expect(this.updatedSteamApps[2].type).toBe(
          SteamApp.validTypes.downloadableContent,
        );
      });

      it("the second entry in updatedSteamApps has a property 'type', and it's value is 'game'", function () {
        expect(this.updatedSteamApps[1].type).toBe(SteamApp.validTypes.game);
      });

      it("the third entry in updatedSteamApps has a property 'type', and it's value is 'downloadableContent'", function () {
        expect(this.updatedSteamApps[2].type).toBe(
          SteamApp.validTypes.downloadableContent,
        );
      });
    });
  });

  describe(".identifyGames", function () {
    describe("checks which steam apps are games and instantiates them, so", function () {
      describe("when no games out of a batch of one steamApp is passed in,", function () {
        beforeEach(function () {
          this.updatedSteamApps = [
            {
              appid: 1,
              name: "Glitchiker Soundtrack",
            },
          ];

          this.instantiatedApps = SteamApp.manyFromSteamApi(this.updatedSteamApps);
          this.result = identifyGames(this.instantiatedApps);
        });

        it("the method returns an empty array", function () {
          expect(this.result).toEqual([]);
        });
      });

      describe("when one game out of a batch of two steamApps is passed in,", function () {
        beforeEach(function () {
          this.updatedSteamApps = [
            {
              appid: 1,
              name: "Glitchiker Soundtrack",
            },
            {
              appid: 2,
              name: "Feartress",
            },
          ];

          this.instantiatedApps = SteamApp.manyFromSteamApi(this.updatedSteamApps);
          this.instantiatedApps[1].type = SteamApp.validTypes.game;

          this.result = identifyGames(this.instantiatedApps);
        });

        it("the returned array length is one", function () {
          expect(this.result.length).toBe(1);
        });

        it("the name property in the first returned array index is 'Feartress'", function () {
          expect(this.result[0].name).toBe(this.updatedSteamApps[1].name);
        });
      });

      describe("when two games out of a batch of three steamApps is passed in,", function () {
        beforeEach(function () {
          this.updatedSteamApps = [
            {
              appid: 1,
              name: "Glitchiker Soundtrack",
            },
            {
              appid: 2,
              name: "Feartress",
            },
            {
              appid: 3,
              name: "Elden Ring",
            },
          ];

          this.instantiatedApps = SteamApp.manyFromSteamApi(this.updatedSteamApps);
          this.instantiatedApps[1].type = SteamApp.validTypes.game;
          this.instantiatedApps[2].type = SteamApp.validTypes.game;

          this.result = identifyGames(this.instantiatedApps);
        });

        it("the returned array length is two", function () {
          expect(this.result.length).toBe(2);
        });

        it("the name property in the first returned array index is 'Feartress'", function () {
          expect(this.result[0].name).toBe(this.updatedSteamApps[1].name);
        });

        it("the name property in the first returned array index is 'Elden Ring'", function () {
          expect(this.result[1].name).toBe(this.updatedSteamApps[2].name);
        });
      });
    });
  });

  describe(".assignType", function () {
    describe("checks if result contains a value. If so, sets the type property to 'games'. So", function () {
      describe("when result does not contain a value,", function () {
        beforeEach(function () {
          this.app = { id: 1, name: "Feartress" };
          this.steamApp = SteamApp.oneFromSteamApi(this.app);

          this.result = assignType(undefined, this.steamApp);
        });

        it("the function returns the steamApp. The type property remains 'unknown'", function () {
          expect(this.result.type).toBe(SteamApp.validTypes.unknown);
        });
      });

      describe("when the result contains a value,", function () {
        beforeEach(function () {
          this.app = { id: 1, name: "Feartress" };
          this.steamApp = SteamApp.oneFromSteamApi(this.app);

          this.result = assignType(true, this.steamApp);
        });

        it("the function returns the steamApp. The type property is 'game'", function () {
          expect(this.result.type).toBe(SteamApp.validTypes.game);
        });
      });
    });
  });

  describe(".updateMissingDetails.", function () {
    describe("When we try to update two games with missing details,", function () {
      beforeEach(function () {
        this.games = getXsteamchartsInstantiatedGames(2);

        const htmlDetailsPages = [
          counterStrikeHtmlDetailsSteamDb,
          riskOfRainHtmlDetailsSteamDb,
        ];

        updateMissingDetails(this.games, htmlDetailsPages);
      });

      it("two games are returned", function () {
        expect(this.games.length).toBe(2);
      });

      it("the first game's details are updated", function () {
        expect(this.games[0].developers).toEqual(["Valve", "Hidden Path Entertainment"]);
        expect(this.games[0].genres).toEqual(["Action", "Free to Play"]);
        expect(this.games[0].description).toBe(
          "Counter-Strike: Global Offensive (CS: GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago. CS: GO features new maps, characters, weapons, and game modes, and delivers updated versions of the classic CS content (de_dust2, etc.).",
        );
      });

      it("the second game's details are updated", function () {
        expect(this.games[1].developers).toEqual(["Hopoo Games"]);
        expect(this.games[1].genres).toEqual(["Action", "Indie"]);
        expect(this.games[1].description).toBe(
          "Escape a chaotic alien planet by fighting through hordes of frenzied monsters – with your friends, or on your own. Combine loot in surprising ways and master each character until you become the havoc you feared upon your first crash landing.",
        );
      });
    });
  });

  describe(".getSteamDbReleaseDate.", function () {
    describe("When we provide a html page that doesn't contain a valid date,", function () {
      beforeEach(function () {
        this.result = getSteamDbReleaseDate(karmazooHtmlDetailsPageSteamDb);
      });

      it("an empty string is returned", function () {
        expect(this.result).toBe("");
      });
    });

    describe("When we provide a html page that contains a valid date,", function () {
      beforeEach(function () {
        this.date = new Date("11 August 2020 UTC");

        this.result = getSteamDbReleaseDate(riskOfRainHtmlDetailsSteamDb);
      });

      it("a date is returned'", function () {
        expect(this.result).toBeInstanceOf(Date);
      });

      it("the result is the correct date", function () {
        expect(this.result.toISOString()).toEqual("2020-08-11T00:00:00.000Z");
      });
    });

    describe("When we provide a html page that doesn't contain a date section", function () {
      beforeEach(function () {
        this.result = getSteamDbReleaseDate(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("an empty string is returned", function () {
        expect(this.result).toBe("");
      });
    });
  });

  describe(".getSteamDbDevelopers.", function () {
    describe("When we provide a html page that contains two developers,", function () {
      beforeEach(function () {
        this.result = getSteamDbDevelopers(counterStrikeHtmlDetailsSteamDb);
      });

      it("two developers are returned", function () {
        expect(this.result.length).toBe(2);
      });

      it("the developer is 'Valve'", function () {
        expect(this.result[0]).toBe("Valve");
      });

      it("the developer is 'Hidden Path Entertainment'", function () {
        expect(this.result[1]).toBe("Hidden Path Entertainment");
      });
    });

    describe("When we provide a html page that doesn't contain a developer section", function () {
      beforeEach(function () {
        this.result = getSteamDbDevelopers(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("an empty array is returned", function () {
        expect(this.result).toEqual([]);
      });
    });
  });

  describe(".getSteamDbGenres.", function () {
    describe("When we provide a html page that contains the genres,", function () {
      beforeEach(function () {
        this.result = getSteamDbGenres(riskOfRainHtmlDetailsSteamDb);
      });

      it("two genres are returned", function () {
        expect(this.result.length).toBe(2);
      });

      it("the first genre is 'Action'", function () {
        expect(this.result[0]).toBe("Action");
      });

      it("the second genre is 'Indie'", function () {
        expect(this.result[1]).toBe("Indie");
      });
    });

    describe("When we provide a html page that doesn't contain a genres section,", function () {
      beforeEach(function () {
        this.result = getSteamDbGenres(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("an empty array is returned", function () {
        expect(this.result).toEqual([]);
      });
    });
  });

  describe(".getSteamDbDescription.", function () {
    describe("When we provide a html page that contains the description,", function () {
      beforeEach(function () {
        this.result = getSteamDbDescription(riskOfRainHtmlDetailsSteamDb);
      });

      it("the returned value is the game's description'", function () {
        expect(this.result).toEqual(
          "Escape a chaotic alien planet by fighting through hordes of frenzied monsters – with your friends, or on your own. Combine loot in surprising ways and master each character until you become the havoc you feared upon your first crash landing.",
        );
      });
    });

    describe("When we provide a html page that doesn't contain a description section,", function () {
      beforeEach(function () {
        this.result = getSteamDbDescription(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("an empty string is returned", function () {
        expect(this.result).toEqual("");
      });
    });
  });

  describe(".updateMissingReleaseDates.", function () {
    describe("When we try to update two games with missing release dates,", function () {
      beforeEach(function () {
        this.games = getXsteamchartsInstantiatedGames(2);

        const htmlDetailsPages = [
          counterStrikeHtmlDetailsSteamDb,
          riskOfRainHtmlDetailsSteamDb,
        ];

        updateMissingReleaseDates(this.games, htmlDetailsPages);
      });

      it("two games are returned", function () {
        expect(this.games.length).toBe(2);
      });

      it("the first game's release date is updated", function () {
        expect(this.games[0].releaseDate).toEqual(new Date("21 August 2012 UTC"));
      });

      it("the second game's release date is updated", function () {
        expect(this.games[1].releaseDate).toEqual(new Date("11 August 2020 UTC"));
      });
    });
  });

  describe(".getSteamDbReleaseDate.", function () {
    describe("When we provide a html page that doesn't contain a valid release date,", function () {
      beforeEach(function () {
        this.result = getSteamDbReleaseDate(karmazooHtmlDetailsPageSteamDb);
      });

      it("an empty string is returned", function () {
        expect(this.result).toBe("");
      });
    });

    describe("When we provide a html page that contains a valid release date,", function () {
      beforeEach(function () {
        this.date = new Date("11 August 2020 UTC");

        this.result = getSteamDbReleaseDate(riskOfRainHtmlDetailsSteamDb);
      });

      it("a date is returned'", function () {
        expect(this.result).toBeInstanceOf(Date);
      });

      it("the correct date is returned", function () {
        expect(this.result).toEqual(this.date);
      });
    });

    describe("When we provide a html page that doesn't contain a date section", function () {
      beforeEach(function () {
        this.result = getSteamDbReleaseDate(riskOfRainHtmlDetailsPageMissingInfo);
      });

      it("an empty string is returned", function () {
        expect(this.result).toBe("");
      });
    });
  });
});
