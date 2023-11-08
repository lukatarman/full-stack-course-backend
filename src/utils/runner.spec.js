import { delay } from "../utils/time.utils.js";
import { Runner } from "./runner.js";

describe("runner.js", () => {
  describe("runs one function in a loop for one iteration", () => {
    let counter = 0;

    beforeAll(() => {
      const func = () => counter++;
      const iterations = 1;
      const options = { iterationDelay: 0 };
      const runner = new Runner([func], options, iterations);

      runner.run();
    });

    it("should increment the coutner by 1", () => {
      expect(counter).toBe(1);
    });
  });

  describe("runs one function in a loop for multiple iterations", () => {
    let counter = 0;

    beforeAll(() => {
      const func = () => counter++;
      const iterations = 5;
      const options = { iterationDelay: 0 };
      const runner = new Runner([func], options, iterations);

      runner.run();
    });

    it("should increment the coutner by 5", () => {
      expect(counter).toBe(5);
    });
  });

  describe("runs multiple functions in parallel for 280 miliseconds", () => {
    let counterOne = 0;
    let counterTwo = 0;

    beforeAll(async () => {
      const funcOne = async () => {
        await delay(80);
        counterOne++;
      };
      const funcTwo = async () => {
        await delay(80);
        counterTwo++;
      };
      const iterations = 10;
      const options = { iterationDelay: 0 };
      const runner = new Runner([funcOne, funcTwo], iterations, iterations);

      runner.run();
      await delay(280);
    });

    it("should increment coutner one by 3", () => {
      expect(counterOne).toBe(3);
    });

    it("should increment coutner two by 3", () => {
      expect(counterTwo).toBe(3);
    });
  });

  describe("runs multiple functions with different delays in parallel for 130 miliseconds", () => {
    let counterOne = 0;
    let counterTwo = 0;
    let counterThree = 0;
    let counterFour = 0;
    let counterHasDuplicates = true;

    beforeAll(async () => {
      const funcOne = async () => {
        await delay(10);
        counterOne++;
      };
      const funcTwo = async () => {
        await delay(30);
        counterTwo++;
      };
      const funcThree = async () => {
        await delay(50);
        counterThree++;
      };
      const funcFour = async () => {
        await delay(90);
        counterFour++;
      };
      const iterations = 10;
      const options = { iterationDelay: 0 };
      const runner = new Runner(
        [funcOne, funcTwo, funcThree, funcFour],
        options,
        iterations,
      );
      function checkIfHasDuplicates(arr) {
        return new Set(arr).size !== arr.length;
      }
      runner.run();
      await delay(130);
      const results = [counterOne, counterTwo, counterThree, counterFour];

      counterHasDuplicates = checkIfHasDuplicates(results);
    });

    it("the different functions should run different amount of times", () => {
      expect(counterHasDuplicates).toBe(false);
    });
  });
});
