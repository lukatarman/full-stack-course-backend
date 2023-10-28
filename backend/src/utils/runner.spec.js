import { createLoggerMock } from "./logger.mock.js";
import { Runner } from "./runner.js";
import { delay } from "./time.utils.js";

fdescribe("runner.js", () => {
  describe(".run()", () => {
    describe("runs one function in a loop without a delay", () => {
      describe("for one iteration", () => {
        it("and calls the function once", async () => {
          const funcSpy = jasmine.createSpy("funcSpy");
          const result = new Runner(createLoggerMock(), options()).run(
            [{ method: funcSpy }],
            [],
          );

          await expectAsync(result).toBeResolved();
          expect(funcSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("for two iterations", () => {
        it("and calls the function twice", async () => {
          const funcSpy = jasmine.createSpy("funcSpy");
          const result = new Runner(createLoggerMock(), options(delayMock, 2)).run(
            [{ method: funcSpy }],
            [],
          );

          await expectAsync(result).toBeResolved();
          expect(funcSpy).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe("runs one function in a loop with a delay", () => {
      describe("for two iterations", () => {
        beforeEach(async function () {
          const testFunc = () => {
            return Promise.resolve();
          };

          const iterationDelayIsMs = 200;

          const runner = new Runner(createLoggerMock(), options(delay, 2));

          const timeBeforeRunning = new Date().getTime();
          await runner.run([{ method: testFunc, delay: iterationDelayIsMs }], []);
          const timeAfterRunning = new Date().getTime();

          this.result = timeAfterRunning - timeBeforeRunning;
        });

        it("the functions ran with the correct delay in between", function () {
          expect(this.result).toBeGreaterThan(300);
          expect(this.result).toBeLessThan(500);
        });
      });
    });

    describe("runs two functions in a loop", function () {
      describe("for one iteration", function () {
        beforeEach(function () {
          this.funcOneSpy = jasmine.createSpy("funcOneSpy");
          this.funcTwoSpy = jasmine.createSpy("funcTwoSpy");
          this.result = new Runner(createLoggerMock(), options()).run(
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
          const result = new Runner(createLoggerMock(), options(delayMock, 2)).run(
            [{ method: funcOneSpy }, { method: funcTwoSpy }],
            [],
          );

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

        this.result = new Runner(this.logger, options(delayMock, 2)).run(
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
        this.unexpectedErrorThrower = async function () {
          throw new UnexpectedError();
        };

        this.result = new Runner(createLoggerMock(), options(delayMock, 2)).run(
          [{ method: this.unexpectedErrorThrower }],
          [ExpectedError],
        );
      });

      it("the unexpected errror rethrown", async function () {
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

        this.result = new Runner(this.logger, options(delayMock, 2)).run(
          [{ method: funcOne }, { method: funcTwo }],
          [ExpectedError],
        );
      });

      it("the expected errror is catched", async function () {
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

function options(delayFn = delayMock, iterations = 1) {
  return {
    delayFn,
    iterations,
  };
}

function delayMock() {
  return Promise.resolve();
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
