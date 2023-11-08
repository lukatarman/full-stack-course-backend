import { TrackedPlayers } from "./tracked.players.js";

describe("TrackedPlayers", function () {
  describe("Instantiates the TrackedPlayers class.", function () {
    describe("When no date is provided", function () {
      beforeEach(function () {
        jasmine.clock().mockDate(new Date());

        this.players = new TrackedPlayers("24");
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("the current date is used.", function () {
        expect(this.players.date).toEqual(new Date());
      });
    });

    describe("when a date is provided", function () {
      beforeEach(function () {
        const currentDate = new Date("September 2000");
        const twelveHoursInMs = 12 * 60 * 60 * 1000;

        const datePlusTwelveHoursInMs = Date.parse(currentDate) + twelveHoursInMs;

        this.currentDatePlusTwelveHours = new Date(datePlusTwelveHoursInMs);
        this.players = new TrackedPlayers("24", "September 2000");
      });

      it("12 hours are added to it due to database discrepancies.", function () {
        expect(this.players.date).toEqual(this.currentDatePlusTwelveHours);
      });
    });
  });

  describe("Player numbers are tracked with one decimal precision", function () {
    it("5473.43 is stored as 5473.4", function () {
      expect(new TrackedPlayers("5473.43").players).toBe(5473.4);
    });
  });

  describe(".manyFromDbEntry creates a list of TrackedPlayers instances from a list of PlayerHistory objects", function () {
    describe("When an list of PlayerHistory objects is passed in,", function () {
      beforeEach(function () {
        const currentDate = new Date();

        const twelveHoursInMs = 12 * 60 * 60 * 1000;

        const datePlusTwelveHoursInMs = Date.parse(currentDate) + twelveHoursInMs;

        this.currentDatePlusTwelveHours = new Date(datePlusTwelveHoursInMs);

        this.trackedPlayersArray = [
          {
            players: 20,
            date: currentDate,
          },
          {
            players: 15,
            date: currentDate,
          },
        ];

        this.result = TrackedPlayers.manyFromDbEntry(this.trackedPlayersArray);
      });

      it("the first entry is an instance of TrackedPlayers.", function () {
        expect(this.result[0]).toBeInstanceOf(TrackedPlayers);
      });

      it("the first entry trackedPlayers instance players property equals 20", function () {
        expect(this.result[0].players).toBe(this.trackedPlayersArray[0].players);
      });

      it("the first entry trackedPlayers instance players property equals the passed in date plus twelve hours.", function () {
        expect(this.result[0].date).toEqual(this.currentDatePlusTwelveHours);
      });

      it("the second entry is an instance of TrackedPlayers.", function () {
        expect(this.result[1]).toBeInstanceOf(TrackedPlayers);
      });

      it("the second entry TrackedPlayers instance players property equals 15.", function () {
        expect(this.result[1].players).toBe(15);
      });

      it("the second entry trackedPlayers instance players property equals the passed in date plus twelve hours.", function () {
        expect(this.result[1].date).toEqual(this.currentDatePlusTwelveHours);
      });
    });

    describe("When the passed in array is empty,", function () {
      beforeEach(function () {
        this.result = TrackedPlayers.manyFromDbEntry([]);
      });

      it("the returned array's will be empty", function () {
        expect(this.result).toEqual([]);
      });
    });
  });
});
