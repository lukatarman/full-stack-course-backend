import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyHealthcheck from "fastify-healthcheck";

export class WebServer {
  #server;

  constructor(gameQueriesRouter, _logger) {
    this.#server = Fastify({ logger: _logger.config });

    this.#server.register(cors, gameQueriesRouter.routes);
    this.#server.register(fastifyHealthcheck);
  }

  async start() {
    this.#server.log.info("starting server...");
    try {
      await this.#server.listen(3000, "0.0.0.0");
    } catch (err) {
      this.#server.log.error(err);
      process.exit(1);
    }
  }

  async stop() {
    this.#server.log.info("stopping server...");
    try {
      this.#server.close();
    } catch (err) {
      this.#server.log.error(err, "stopping server failed");
    }
  }
}
