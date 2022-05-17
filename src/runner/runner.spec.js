import { Runner } from "./runner.js";

fdescribe("runner.js", () => {
  describe("runs one function in a loop for one iteration", () => {
    let counter = 0;

    beforeAll(() => {
      const func = () => counter++;
      const options = { iterations: 1 };
      const runner = new Runner([func], options);

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
      const options = { iterations: 5 };
      const runner = new Runner([func], options);

      runner.run();
    });

    it("should increment the coutner by 5", () => {
      expect(counter).toBe(5);
    });
  });

  xdescribe("runs multiple functions in parallel in a loop for one iteration", () => {});

  xdescribe("runs multiple functions in parallel in a loop for multiple iterations", () => {});
});