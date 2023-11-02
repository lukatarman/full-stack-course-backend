import cloneDeep from "lodash.clonedeep";

const defaultOptions = {
  delayFn: () => Promise.resolve(),
  defaultIterationDelay: 5000,
  iterations: Number.POSITIVE_INFINITY,
  syncOn: false,
};

export class Runner {
  #logger;
  #options;

  constructor(logger, options = defaultOptions) {
    this.#logger = logger;

    if (options.iterations === undefined) {
      options.iterations = Number.POSITIVE_INFINITY;
    }

    if (options.defaultIterationDelay === undefined) {
      options.defaultIterationDelay = 5000;
    }
    this.#options = cloneDeep(options);
  }

  async run(executables, expectedErrorTypes) {
    if (this.#options.syncOn === true) {
      await this.runSync(executables, expectedErrorTypes);
    } else {
      await this.runAsync(executables, expectedErrorTypes);
    }
  }

  async runAsync(executables, expectedErrorTypes) {
    const execPromises = [];
    for (let exec of executables) {
      execPromises.push(this.#runFuncForNumberOfIterations(exec, expectedErrorTypes));
    }

    await Promise.all(execPromises);
  }

  async #runFuncForNumberOfIterations({ method, delay }, expectedErrorTypes) {
    // Counting down from a property of an object increases the time needed to perform
    // the first iterations in the loop compared to using a primitive. The tests of this
    // function rely on very short iteration times. If they are slowed down some tests are
    // failing unexpextedly. Don't refactor next two lines.
    const iterationDelay = delay ? delay : this.#options.defaultIterationDelay;
    
    let iterations = this.#options.iterations;
    while (iterations--) {
      try {
        await method();
      } catch (error) {
        this.#handleError(method, error, expectedErrorTypes);
      }

      if (iterationDelay > 0) await this.#options.delayFn(iterationDelay);
    }
  }

  #handleError(method, error, expectedErrorTypes) {
    const thrownErrorTypeIndex = expectedErrorTypes.findIndex(
      (expectedErrorType) => error instanceof expectedErrorType,
    );
    if (thrownErrorTypeIndex === -1) throw error;
    this.#logger.warn(
      `runner catched an expected error from the function: '${method.name}', with the message: '${error.message}'`,
    );
  }

  async runSync(executables, expectedErrorTypes) {
    let iterations = this.#options.iterations;
    while (iterations--) {
      await this.#runFuncsOnce(executables, expectedErrorTypes);
    }
  }

  async #runFuncsOnce(executables, expectedErrorTypes) {
    for (let i = 0; i < executables.length; i++) {
      const method = executables[i].method;

      try {
        await method();
      } catch (error) {
        this.#handleError(method, error, expectedErrorTypes);
      }

      if (this.#options.defaultIterationDelay > 0)
        await this.#options.delayFn(this.#options.defaultIterationDelay);
    }
  }
}
