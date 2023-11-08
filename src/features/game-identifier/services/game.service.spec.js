import {
  getSteamAppType,
  discoverGamesFromSteamWeb,
  updateTypeSideEffectFree,
  identifyGames,
  assignType,
} from "./game.service.js";
import { animaddicts2gameHtmlDetailsPage } from "../../../../assets/steam-details-pages/animaddicts.2.game.html.details.page.js";
import { feartressGameHtmlDetailsPage } from "../../../../assets/steam-details-pages/feartress.game.html.details.page.js";
import { glitchhikersSoundtrackHtmlDetailsPage } from "../../../../assets/steam-details-pages/glitchhikers.soundtrack.html.details.page.js";
import { gta5ageRestrictedHtmlDetailsPage } from "../../../../assets/steam-details-pages/gta.5.age.restricted.html.details.page.js";
import { padakVideoHtmlDetailsPage } from "../../../../assets/steam-details-pages/padak.video.html.details.page.js";
import { theSims4dlcHtmlDetailsPage } from "../../../../assets/steam-details-pages/the.sims.4.dlc.html.details.page.js";
import { Game } from "../../../models/game.js";
import { SteamApp } from "../../../models/steam.app.js";

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
          SteamApp.validDataSources.steamWeb,
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
          SteamApp.validDataSources.steamWeb,
        );
      });

      it("the second array entry in updatedSteamApps has a property 'triedVia', and it's value is 'steamWeb'", function () {
        expect(this.updatedSteamApps[1].triedVia[0]).toBe(
          SteamApp.validDataSources.steamWeb,
        );
      });

      it("the third array entry in updatedSteamApps has a property 'triedVia', and it's value is 'steamWeb'", function () {
        expect(this.updatedSteamApps[2].triedVia[0]).toBe(
          SteamApp.validDataSources.steamWeb,
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
});
