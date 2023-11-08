import { SteamAppsAggregator } from "./steam.apps.aggregator.js";
import { smallestGamesMock } from "../../../assets/smallest.data.set.js";
import { gamesMock } from "../../../assets/small.data.set.js";
import { hoursToMs } from "../../utils/time.utils.js";
import { SteamApp } from "../../models/steam.app.js";

describe("SteamAppsAggregator", () => {
  describe(".collectSteamApps()", () => {
    let steamClientMock;
    let updateTimestampsRepositoryMock;
    let steamAppsRepositoryMock;
    let updateTimestamp;

    beforeEach(() => {
      updateTimestamp = { updatedOn: new Date("2020") };
    });

    describe("collects steam apps for the first time and finishes", () => {
      beforeEach(async () => {
        steamClientMock = createSteamMock(smallestGamesMock);

        updateTimestampsRepositoryMock = createUpdateTimestampsRepositoryMock(null);
        steamAppsRepositoryMock = createSteamAppsRepositoryMock(undefined);

        const agg = new SteamAppsAggregator(
          steamClientMock,
          updateTimestampsRepositoryMock,
          steamAppsRepositoryMock,
          {},
        );

        await agg.collectSteamApps();
      });

      it("calls .getLastUpdateTimestamp once", () => {
        expect(
          updateTimestampsRepositoryMock.getLastUpdateTimestamp,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getLastUpdateTimestamp before .getAppList", () => {
        expect(
          updateTimestampsRepositoryMock.getLastUpdateTimestamp,
        ).toHaveBeenCalledBefore(steamClientMock.getAppList);
      });

      it("calls .getAppList once", () => {
        expect(steamClientMock.getAppList).toHaveBeenCalledTimes(1);
      });

      it("calls .getAppList before .insertManySteamApps", () => {
        expect(steamClientMock.getAppList).toHaveBeenCalledBefore(
          steamAppsRepositoryMock.insertManySteamApps,
        );
      });

      it("calls .insertManySteamApps once", () => {
        expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledTimes(1);
      });

      it("calls .insertManySteamApps with enrichedSteamApps parameter", () => {
        expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledOnceWith(
          smallestGamesMock,
        );
      });

      it("calls .insertManySteamApps before .insertOneUpdateTimestamp", () => {
        expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledBefore(
          updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
        );
      });

      it("calls .insertOneUpdateTimestamp once", () => {
        expect(
          updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .insertOneUpdateTimestamp with a new date", () => {
        expect(
          updateTimestampsRepositoryMock.insertOneUpdateTimestamp.calls.argsFor(0)[0],
        ).toBeInstanceOf(Date);
      });
    });

    describe("collects steam apps for the n-th (n > 1) time", () => {
      let steamAppsDifference;

      describe("while finding new games and finishes", () => {
        beforeEach(async () => {
          steamClientMock = createSteamMock(gamesMock);

          updateTimestampsRepositoryMock =
            createUpdateTimestampsRepositoryMock(updateTimestamp);
          steamAppsRepositoryMock = createSteamAppsRepositoryMock(smallestGamesMock);

          const agg = new SteamAppsAggregator(
            steamClientMock,
            updateTimestampsRepositoryMock,
            steamAppsRepositoryMock,
            {
              updateIntervalDelay: 100,
            },
          );

          steamAppsDifference = SteamApp.diff(gamesMock, smallestGamesMock);

          await agg.collectSteamApps();
        });

        it("calls .getLastUpdateTimestamp once", () => {
          expect(
            updateTimestampsRepositoryMock.getLastUpdateTimestamp,
          ).toHaveBeenCalledTimes(1);
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(
            updateTimestampsRepositoryMock.getLastUpdateTimestamp,
          ).toHaveBeenCalledBefore(steamClientMock.getAppList);
        });

        it("calls .getAppList once", () => {
          expect(steamClientMock.getAppList).toHaveBeenCalledTimes(1);
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(steamClientMock.getAppList).toHaveBeenCalledBefore(
            steamAppsRepositoryMock.getAllSteamApps,
          );
        });

        it("calls .getAllSteamApps once", () => {
          expect(steamAppsRepositoryMock.getAllSteamApps).toHaveBeenCalledTimes(1);
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(steamAppsRepositoryMock.getAllSteamApps).toHaveBeenCalledBefore(
            steamAppsRepositoryMock.insertManySteamApps,
          );
        });

        it("calls .insertManySteamApps once", () => {
          expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledTimes(1);
        });

        it("calls .insertManySteamApps with enrichedSteamApps parameter", () => {
          expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledOnceWith(
            steamAppsDifference,
          );
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledBefore(
            updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
          );
        });

        it("calls .insertOneUpdateTimestamp once", () => {
          expect(
            updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
          ).toHaveBeenCalledTimes(1);
        });

        it("calls .insertOneUpdateTimestamp with a new date", () => {
          expect(
            updateTimestampsRepositoryMock.insertOneUpdateTimestamp.calls.argsFor(0)[0],
          ).toBeInstanceOf(Date);
        });
      });

      describe("without new games and finishes", () => {
        beforeEach(async () => {
          steamClientMock = createSteamMock(smallestGamesMock);

          updateTimestampsRepositoryMock =
            createUpdateTimestampsRepositoryMock(updateTimestamp);
          steamAppsRepositoryMock = createSteamAppsRepositoryMock(smallestGamesMock);

          const agg = new SteamAppsAggregator(
            steamClientMock,
            updateTimestampsRepositoryMock,
            steamAppsRepositoryMock,
            {
              updateIntervalDelay: 100,
            },
          );

          steamAppsDifference = SteamApp.diff(smallestGamesMock, smallestGamesMock);

          await agg.collectSteamApps();
        });

        it("calls .getLastUpdateTimestamp once", () => {
          expect(
            updateTimestampsRepositoryMock.getLastUpdateTimestamp,
          ).toHaveBeenCalledTimes(1);
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(
            updateTimestampsRepositoryMock.getLastUpdateTimestamp,
          ).toHaveBeenCalledBefore(steamClientMock.getAppList);
        });

        it("calls .getAppList once", () => {
          expect(steamClientMock.getAppList).toHaveBeenCalledTimes(1);
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(steamClientMock.getAppList).toHaveBeenCalledBefore(
            steamAppsRepositoryMock.getAllSteamApps,
          );
        });

        it("calls .getAllSteamApps once", () => {
          expect(steamAppsRepositoryMock.getAllSteamApps).toHaveBeenCalledTimes(1);
        });

        it("calls .getLastUpdateTimestamp before .getAppList", () => {
          expect(steamAppsRepositoryMock.getAllSteamApps).toHaveBeenCalledBefore(
            updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
          );
        });

        it("calls .insertOneUpdateTimestamp once", () => {
          expect(
            updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
          ).toHaveBeenCalledTimes(1);
        });

        it("calls .insertOneUpdateTimestamp with a new date", () => {
          expect(
            updateTimestampsRepositoryMock.insertOneUpdateTimestamp.calls.argsFor(0)[0],
          ).toBeInstanceOf(Date);
        });

        it("calls .insertManySteamApps zero times", () => {
          expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe("executes successfully by not performing any updates", () => {
      beforeEach(async () => {
        steamClientMock = createSteamMock(smallestGamesMock);

        updateTimestampsRepositoryMock =
          createUpdateTimestampsRepositoryMock(updateTimestamp);
        steamAppsRepositoryMock = createSteamAppsRepositoryMock(smallestGamesMock);

        jasmine.clock().mockDate(new Date("2020"));

        const agg = new SteamAppsAggregator(
          steamClientMock,
          updateTimestampsRepositoryMock,
          steamAppsRepositoryMock,
          {
            updateIntervalDelay: hoursToMs(12),
          },
        );

        await agg.collectSteamApps();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("calls .getLastUpdateTimestamp once", () => {
        expect(
          updateTimestampsRepositoryMock.getLastUpdateTimestamp,
        ).toHaveBeenCalledTimes(1);
      });

      it("calls .getAppList zero times", () => {
        expect(steamClientMock.getAppList).toHaveBeenCalledTimes(0);
      });

      it("calls .getAllSteamApps zero times", () => {
        expect(steamAppsRepositoryMock.getAllSteamApps).toHaveBeenCalledTimes(0);
      });

      it("calls .insertOneUpdateTimestamp zero times", () => {
        expect(
          updateTimestampsRepositoryMock.insertOneUpdateTimestamp,
        ).toHaveBeenCalledTimes(0);
      });

      it("calls .insertManySteamApps zero times", () => {
        expect(steamAppsRepositoryMock.insertManySteamApps).toHaveBeenCalledTimes(0);
      });
    });
  });
});

function createSteamMock(ret) {
  return jasmine.createSpyObj("SteamClient", {
    getAppList: Promise.resolve(ret),
  });
}

function createUpdateTimestampsRepositoryMock(updateTs) {
  return jasmine.createSpyObj("UpdateTimestampsRepository", {
    getLastUpdateTimestamp: Promise.resolve(updateTs),
    insertOneUpdateTimestamp: Promise.resolve(undefined),
  });
}

function createSteamAppsRepositoryMock(steamApps) {
  return jasmine.createSpyObj("DatabaseClient", {
    insertManySteamApps: Promise.resolve(undefined),
    getAllSteamApps: Promise.resolve(steamApps),
  });
}
