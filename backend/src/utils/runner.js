export class Runner {
  #logger;
  #delayFn;
  #iterations;
  #defaultIterationDelay;

  constructor(
    logger,
    delayFn,
    defaultIterationDelay,
    iterations = Number.POSITIVE_INFINITY,
  ) {
    this.#logger = logger;
    this.#delayFn = delayFn;
    this.#defaultIterationDelay = defaultIterationDelay;
    this.#iterations = iterations;
  }

  async run(executables, expectedErrorTypes) {
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
    let iterations = this.#iterations;

    const iterationDelay = delay ? delay : this.#defaultIterationDelay;

    while (iterations--) {
      try {
        await method();
      } catch (error) {
        const thrownErrorTypeIndex = expectedErrorTypes.findIndex(
          (expectedErrorType) => error instanceof expectedErrorType,
        );
        if (thrownErrorTypeIndex === -1) throw error;
        this.#logger.warn(
          `runner catched an expected error from the function: '${method.name}', with the message: '${error.message}'`,
        );
      }

      if (iterationDelay > 0) await this.#delayFn(iterationDelay);
    }
  }
}
