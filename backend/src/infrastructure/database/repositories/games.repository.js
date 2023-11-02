import { Game } from "../../../models/game.js";
import { daysToMs } from "../../../utils/time.utils.js";

export class GamesRepository {
  #dbClient;

  constructor(dbClient) {
    this.#dbClient = dbClient;
  }

  async insertManyGames(data) {
    await this.#dbClient.insertMany("games", data);
  }

  async getOneGameById(id) {
    return await this.#dbClient.get("games").findOne({ id });
  }

  async getAllGames() {
    return await this.#dbClient.getAll("games");
  }

  async getGamesWithoutDetails(amount) {
    return (
      await this.#dbClient
        .get("games")
        .aggregate([
          {
            $match: {
              $or: [
                { developers: { $eq: [] } },
                { genres: { $eq: [] } },
                { description: { $eq: "" } },
              ],
            },
          },
          { $limit: amount },
        ])
        .toArray()
    ).map((dbEntry) => Game.fromDbEntry(dbEntry));
  }

  async updateGameDetails(games) {
    await Promise.all(
      games.map((game) =>
        this.#dbClient.updateOne(
          "games",
          { id: { $eq: game.id } },
          {
            $set: {
              developers: game.developers,
              genres: game.genres,
              description: game.description,
            },
          },
        ),
      ),
    );
  }

  async getGamesWithoutReleaseDates(amount) {
    return (
      await this.#dbClient
        .get("games")
        .aggregate([
          {
            $match: {
              $or: [{ releaseDate: { $eq: "" } }, { releaseDate: { $gt: new Date() } }],
            },
          },
          { $limit: amount },
        ])
        .toArray()
    ).map((dbEntry) => Game.fromDbEntry(dbEntry));
  }

  async updateReleaseDates(games) {
    await Promise.all(
      games.map((game) =>
        this.#dbClient.updateOne(
          "games",
          { id: { $eq: game.id } },
          {
            $set: {
              releaseDate: game.releaseDate,
            },
          },
        ),
      ),
    );
  }

  async getXgamesWithUncheckedPlayerHistory(amount) {
    return (
      await this.#dbClient
        .get("history_checks")
        .aggregate([
          {
            $lookup: {
              from: "games",
              localField: "gameId",
              foreignField: "id",
              as: "game",
            },
          },
          { $match: { checked: false } },
          { $unwind: "$game" },
          { $replaceWith: "$game" },
          { $limit: amount },
        ])
        .toArray()
    ).map((dbEntry) => Game.fromDbEntry(dbEntry));
  }

  async getXgamesCheckedMoreThanYmsAgo(amount, ms) {
    return (
      await this.#dbClient
        .get("games")
        .aggregate([
          {
            $addFields: {
              lastHistory: { $last: "$playerHistory" },
            },
          },
          {
            $addFields: {
              lastUpdateDate: { $last: "$lastHistory.trackedPlayers.date" },
            },
          },
          {
            $match: {
              $or: [
                { playerHistory: { $eq: [] } },
                { lastUpdateDate: { $lt: new Date(Date.now() - ms) } },
              ],
            },
          },
          { $unset: "lastUpdateDate" },
          { $unset: "lastHistory" },
          { $limit: amount },
        ])
        .toArray()
    ).map((dbEntry) => Game.fromDbEntry(dbEntry));
  }

  async getXgamesSortedByCurrentPlayers(amount) {
    return await this.#dbClient
      .get("games")
      .aggregate([
        { $match: { playerHistory: { $ne: [] } } },
        { $addFields: { lastPlayerHistory: { $last: "$playerHistory" } } },
        {
          $addFields: {
            currentPlayers: { $last: "$lastPlayerHistory.trackedPlayers.players" },
          },
        },
        { $unset: "lastPlayerHistory" },
        { $sort: { currentPlayers: -1 } },
        { $limit: amount },
      ])
      .toArray();
  }

  async getGamesBySearchTerm(term) {
    return await this.#dbClient
      .get("games")
      .aggregate([
        {
          $match: {
            $and: [
              { playerHistory: { $ne: [] } },
              { name: { $regex: ".*" + term + ".*", $options: "i" } },
            ],
          },
        },
        { $addFields: { lastPlayerHistory: { $last: "$playerHistory" } } },
        {
          $addFields: {
            currentPlayers: { $last: "$lastPlayerHistory.trackedPlayers.players" },
          },
        },
        { $unset: "lastPlayerHistory" },
        { $sort: { currentPlayers: -1 } },
        { $limit: 15 },
      ])
      .toArray();
  }

  async getTrendingGames(timePeriodInMs, returnAmount = 10, minimumPlayers = 100) {
    return await this.#dbClient
      .get("games")
      .aggregate([
        this.#getGamesWithMinimumXPlayers(minimumPlayers),
        this.#addAveragePlayersTodayProperty(),
        this.#addAveragePlayersAtCustomDayProperty(timePeriodInMs),
        this.#getGamesWithAveragePlayersValues(),
        this.#addPercentagePlayerIncreaseProperty(),
        { $unset: "averagePlayersToday" },
        { $unset: "averagePlayersAtCustomDay" },
        {
          $match: {
            percentagePlayerIncrease: { $gt: 0 },
          },
        },
        { $sort: { percentagePlayerIncrease: -1 } },
        { $limit: returnAmount },
      ])
      .toArray();
  }

  #getGamesWithMinimumXPlayers = (minimumPlayers) => {
    return {
      $match: {
        $expr: {
          $gt: [{ $arrayElemAt: ["$playerHistory.averagePlayers", -1] }, minimumPlayers],
        },
      },
    };
  };

  #addAveragePlayersTodayProperty = () => {
    return {
      $addFields: {
        averagePlayersToday: {
          $arrayElemAt: [
            {
              $filter: {
                input: {
                  $map: {
                    input: "$playerHistory",
                    as: "entry",
                    in: {
                      $avg: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$$entry.trackedPlayers",
                              as: "players",
                              cond: {
                                $gte: [
                                  "$$players.date",
                                  { $subtract: [new Date(), daysToMs(1)] },
                                ],
                              },
                            },
                          },
                          as: "filteredPlayers",
                          in: "$$filteredPlayers.players",
                        },
                      },
                    },
                  },
                },
                as: "players",
                cond: {
                  $and: [{ $ne: ["$$players", []] }, { $ne: ["$$players", null] }],
                },
              },
            },
            0,
          ],
        },
      },
    };
  };

  #addAveragePlayersAtCustomDayProperty = (timePeriodInMs) => {
    return {
      $addFields: {
        averagePlayersAtCustomDay: {
          $arrayElemAt: [
            {
              $filter: {
                input: {
                  $map: {
                    input: "$playerHistory",
                    as: "entry",
                    in: {
                      $avg: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$$entry.trackedPlayers",
                              as: "players",
                              cond: {
                                $and: [
                                  {
                                    $lte: [
                                      "$$players.date",
                                      { $subtract: [new Date(), timePeriodInMs] },
                                    ],
                                  },
                                  {
                                    $gte: [
                                      "$$players.date",
                                      {
                                        $subtract: [
                                          { $subtract: [new Date(), timePeriodInMs] },
                                          daysToMs(1),
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          },
                          as: "filteredPlayers",
                          in: "$$filteredPlayers.players",
                        },
                      },
                    },
                  },
                },
                as: "players",
                cond: {
                  $and: [{ $ne: ["$$players", []] }, { $ne: ["$$players", null] }],
                },
              },
            },
            0,
          ],
        },
      },
    };
  };

  #getGamesWithAveragePlayersValues = () => {
    return {
      $match: {
        $and: [
          { averagePlayersToday: { $gt: 0 } },
          { averagePlayersAtCustomDay: { $gt: 0 } },
        ],
      },
    };
  };

  #addPercentagePlayerIncreaseProperty = () => {
    return {
      $addFields: {
        percentagePlayerIncrease: {
          $round: [
            {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: ["$averagePlayersToday", "$averagePlayersAtCustomDay"],
                    },
                    "$averagePlayersAtCustomDay",
                  ],
                },
                100,
              ],
            },
            1,
          ],
        },
      },
    };
  };
}
