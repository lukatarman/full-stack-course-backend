import { createLoggerMock } from "./logger.mock.js";
import { Runner } from "./runner.js";

describe("runner.js", () => {
  describe(".run()", () => {
    describe("calls .runSync() if sync option is set to true", () => {
      beforeAll(function () {
        this.runner = new Runner(createLoggerMock(), options(delayMock, 2, 0, true));

        spyOn(this.runner, "runAsync");
        spyOn(this.runner, "runSync");

        this.runner.run([], []);
      });

      it(".runSync() was called", function () {
        expect(this.runner.runSync).toHaveBeenCalled();
      });

      it(".runAsync() was not called", function () {
        expect(this.runner.runAsync).not.toHaveBeenCalled();
      });

    describe("calls .runAsync() if sync option is set to false", () => {
      beforeAll(function () {
        this.runner = new Runner(createLoggerMock(), options(delayMock, 2, 0, false));

        spyOn(this.runner, "runAsync");
        spyOn(this.runner, "runSync");

        this.runner.run([], []);
      });

      it(".runSync() was not called", function () {
        expect(this.runner.runSync).not.toHaveBeenCalled();
      });

      it(".runAsync() was called", function () {
        expect(this.runner.runAsync).toHaveBeenCalled();
      });
    });
  });

  describe(".runAsync()", () => {
    describe("runs one function in a loop", () => {
      describe("for one iteration", () => {
        it("and calls the function once", async () => {
          const funcSpy = jasmine.createSpy("funcSpy");
          const result = new Runner(createLoggerMock(), options()).runAsync(
            [{ method: funcSpy }],
            [],
          );

          await expectAsync(result).toBeResolved();
          expect(funcSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("for two iterations", () => {
        describe("with the default delay", () => {
          beforeEach(async function () {
            jasmine.clock().install();
            jasmine.clock().mockDate();

            this.funcSpy = jasmine.createSpy("funcSpy");

            const runner = new Runner(createLoggerMock(), options(timeMock, 2));

            const timeBeforeRunning = new Date().getTime();
            this.runnerResult = runner.runAsync([{ method: this.funcSpy }], []);
            await this.runnerResult;
            const timeAfterRunning = new Date().getTime();

            this.result = timeAfterRunning - timeBeforeRunning;
          });

          afterEach(() => {
            jasmine.clock().uninstall();
          });

          it("the functions ran with the correct delay", function () {
            expect(this.result).toBe(10000);
          });

          it("the function ran two times", async function () {
            await expectAsync(this.runnerResult).toBeResolved();
            expect(this.funcSpy).toHaveBeenCalledTimes(2);
          });
        });

        describe("with a set delay", () => {
          beforeEach(async function () {
            jasmine.clock().install();
            jasmine.clock().mockDate();

            this.funcSpy = jasmine.createSpy("funcSpy");

            const runner = new Runner(createLoggerMock(), options(timeMock, 2));

            const timeBeforeRunning = new Date().getTime();
            this.runnerResult = runner.runAsync(
              [{ method: this.funcSpy, delay: 2000 }],
              [],
            );
            await this.runnerResult;
            const timeAfterRunning = new Date().getTime();

            this.result = timeAfterRunning - timeBeforeRunning;
          });

          afterEach(() => {
            jasmine.clock().uninstall();
          });

          it("the functions ran with the correct delay", function () {
            expect(this.result).toBe(4000);
          });

          it("the function ran two times", async function () {
            await expectAsync(this.runnerResult).toBeResolved();
            expect(this.funcSpy).toHaveBeenCalledTimes(2);
          });
        });
      });
    });

    describe("runs two functions in a loop", function () {
      describe("for one iteration", function () {
        beforeEach(function () {
          this.funcOneSpy = jasmine.createSpy("funcOneSpy");
          this.funcTwoSpy = jasmine.createSpy("funcTwoSpy");
          this.result = new Runner(createLoggerMock(), options()).runAsync(
            [{ method: this.funcOneSpy }, { method: this.funcTwoSpy }],
            [],
          );
        });
        it("and calls the functions once", async function () {
          await expectAsync(this.result).toBeResolved();
          expect(this.funcOneSpy).toHaveBeenCalledTimes(1);
          expect(this.funcTwoSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("for two iterations", () => {
        it("and calls the functions twice", async () => {
          const funcOneSpy = jasmine.createSpy("funcOneSpy");
          const funcTwoSpy = jasmine.createSpy("funcTwoSpy");
          const result = new Runner(
            createLoggerMock(),
            options(delayMock, 2, 0),
          ).runAsync([{ method: funcOneSpy }, { method: funcTwoSpy }], []);

          await expectAsync(result).toBeResolved();
          expect(funcOneSpy).toHaveBeenCalledTimes(2);
          expect(funcTwoSpy).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe("when one running function throws an expected error,", function () {
      beforeAll(function () {
        const expectedErrorThrower = async function () {
          throw new ExpectedError("Expected error");
        };
        this.logger = createLoggerMock();

        this.result = new Runner(this.logger, options(delayMock, 2)).runAsync(
          [{ method: expectedErrorThrower }],
          [ExpectedError],
        );
      });

      it("the expected error is caught", async function () {
        await expectAsync(this.result).toBeResolved();
      });

      it("a warn message is logged", function () {
        expect(this.logger.warn).toHaveBeenCalled();
      });
    });

    describe("when one running function throws an unexpected error,", function () {
      beforeEach(function () {
        const unexpectedErrorThrower = async function () {
          throw new UnexpectedError();
        };

        this.result = new Runner(createLoggerMock(), options(delayMock, 2)).runAsync(
          [{ method: unexpectedErrorThrower }],
          [ExpectedError],
        );
      });

      it("the unexpected error rethrown", async function () {
        await expectAsync(this.result).toBeRejected();
      });
    });

    describe("when one of two running functions throws an expected error,", function () {
      let counterFuncOne = 0;
      let counterFuncTwo = 0;

      beforeAll(function () {
        const funcOne = async function () {
          counterFuncOne++;
          throw new ExpectedError();
        };
        const funcTwo = async function () {
          counterFuncTwo++;
        };

        this.logger = createLoggerMock();

        this.result = new Runner(this.logger, options(delayMock, 2)).runAsync(
          [{ method: funcOne }, { method: funcTwo }],
          [ExpectedError],
        );
      });

      it("the expected error is caught", async function () {
        await expectAsync(this.result).toBeResolved();
      });

      it("a warn message is logged", function () {
        expect(this.logger.warn).toHaveBeenCalled();
      });

      it("funcOne and funcTwo are executed twice", function () {
        expect(counterFuncOne).toBe(2);
        expect(counterFuncTwo).toBe(2);
      });
    });
  });
});

describe("runSync()", () => {
  describe("runs two functions in a loop sequentially", () => {
    describe("for one iteration", () => {
      it("and calls each functions once", async () => {
        const funcOneSpy = jasmine.createSpy("funcOneSpy");
        const funcTwoSpy = jasmine.createSpy("funcTwoSpy");
        const result = new Runner(createLoggerMock(), options()).runSync(
          [{ method: funcOneSpy }, { method: funcTwoSpy }],
          [],
        );

        await expectAsync(result).toBeResolved();
        expect(funcOneSpy).toHaveBeenCalledTimes(1);
        expect(funcOneSpy).toHaveBeenCalledBefore(funcTwoSpy);
        expect(funcTwoSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("for two iterations", () => {
      it("and calls the functions twice sequentially", async () => {
        const funcOneSpy = jasmine.createSpy("funcOneSpy");
        const funcTwoSpy = jasmine.createSpy("funcTwoSpy");
        const result = new Runner(createLoggerMock(), options(delayMock, 2, 0)).runSync(
          [{ method: funcOneSpy }, { method: funcTwoSpy }],
          [],
        );

        await expectAsync(result).toBeResolved();
        const funcOneSpyCalls = funcOneSpy.calls.all();
        const funcTwoSpyCalls = funcTwoSpy.calls.all();
        expect(
          funcOneSpyCalls[0].invocationOrder <
            funcTwoSpyCalls[0].invocationOrder <
            funcOneSpyCalls[1].invocationOrder,
        ).toBe(true);
        expect(
          funcTwoSpyCalls[0].invocationOrder <
            funcOneSpyCalls[1].invocationOrder <
            funcTwoSpyCalls[1].invocationOrder,
        ).toBe(true);
        expect(funcOneSpy).toHaveBeenCalledTimes(2);
        expect(funcTwoSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe("when one of two running functions throws an expected error,", function () {
      let funcOneSpy;
      let funcTwoSpy;
      beforeEach(async function () {
        funcOneSpy = jasmine.createSpy("funcOneSpy").and.throwError(new ExpectedError());
        funcTwoSpy = jasmine.createSpy("funcTwoSpy");

        this.logger = createLoggerMock();

        this.result = new Runner(this.logger, options(delayMock, 2, 0)).runSync(
          [{ method: funcOneSpy }, { method: funcTwoSpy }],
          [ExpectedError],
        );

        await this.result;
      });

      it("the expected error is catched", async function () {
        await expectAsync(this.result).toBeResolved();
      });

      it("a warn message is logged", function () {
        expect(this.logger.warn).toHaveBeenCalled();
      });

      it("funcOne and funcTwo are executed twice", function () {
        expect(funcOneSpy).toHaveBeenCalledTimes(2);
        expect(funcTwoSpy).toHaveBeenCalledTimes(2);
      });

      it("funcOne and funcTwo are executed in the right order", function () {
        const funcOneSpyCalls = funcOneSpy.calls.all();
        const funcTwoSpyCalls = funcTwoSpy.calls.all();
        expect(
          funcOneSpyCalls[0].invocationOrder <
            funcTwoSpyCalls[0].invocationOrder <
            funcOneSpyCalls[1].invocationOrder,
        ).toBe(true);
        expect(
          funcTwoSpyCalls[0].invocationOrder <
            funcOneSpyCalls[1].invocationOrder <
            funcTwoSpyCalls[1].invocationOrder,
        ).toBe(true);
      });
    });
  });
});

function options(
  delayFn = delayMock,
  iterations = 1,
  defaultIterationDelay = undefined,
  syncOn = false,
) {
  return {
    delayFn,
    iterations,
    defaultIterationDelay,
    syncOn,
  };
}

function delayMock() {
  return Promise.resolve();
}

function timeMock(delay) {
  jasmine.clock().tick(delay);
}

class ExpectedError extends Error {
  constructor() {
    super("expected error");
  }
}
class UnexpectedError extends Error {
  constructor() {
    super("unexpected error");
  }
}
