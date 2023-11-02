import { daysToMs } from "../utils/time.utils.js";
import { Game } from "./game.js";
import { getXSampleSteamApps } from "./steam.app.mocks.js";

export const getXGamesWithoutDetails = (amount) => {
  const steamApps = getXSampleSteamApps(amount);

  return steamApps.map((app, i) => Game.fromSteamApp(steamApps[i], "", [], [], ""));
};

export const getOneSteamAppInstantiatedGame = () => {
  const steamApp = getXSampleSteamApps(1);

  const releaseDate = "21 July 2019";
  const developers = ["Valve", "Hopoo Games"];
  const genres = ["Action", "Adventure"];
  const description = "Best game";

  return Game.fromSteamApp(steamApp, releaseDate, developers, genres, description);
};

export const getXsteamchartsInstantiatedGames = (amount) => {
  return Array.from({ length: amount }, (x, index) =>
    Game.fromSteamcharts({ appid: index + 1, name: `Game #${index + 1}` }),
  );
};

export const getOneGameWithDetails = () => {
  return [
    {
      id: 239140,
      name: "Dying Light",
      releaseDate: "21.09.1989",
      developers: ["Techland"],
      genres: ["Action", "RPG"],
      description: "Best game",
    },
  ];
};

export const getGamesWithEmptyPlayerHistories = () => {
  return [
    {
      id: 1,
      name: "Risk of Train",
      playerHistory: [],
    },
    {
      id: 2,
      name: "Risk of Rain",
      playerHistory: [],
    },
    {
      id: 3,
      name: "Risk of Brain",
      playerHistory: [],
    },
  ];
};

export const getGamesWithTrackedPlayersNoDate = () => {
  return [
    {
      id: 1,
      name: "Risk of Train",
      playerHistory: [
        { trackedPlayers: [{ players: 4 }] },
        { trackedPlayers: [{ players: 6 }] },
      ],
    },
    {
      id: 2,
      name: "Risk of Rain",
      playerHistory: [
        { trackedPlayers: [{ players: 15 }] },
        { trackedPlayers: [{ players: 24 }] },
      ],
    },
    {
      id: 3,
      name: "Risk of Brain",
      playerHistory: [
        { trackedPlayers: [{ players: 64 }] },
        { trackedPlayers: [{ players: 87 }] },
      ],
    },
    {
      id: 4,
      name: "Risk of Strain",
      playerHistory: [],
    },
    {
      id: 4,
      name: "Risk of No",
      playerHistory: [
        { trackedPlayers: [{ players: 34 }] },
        { trackedPlayers: [{ players: 11 }] },
      ],
    },
  ];
};

export const getTrendingGamesMockData = () => {
  const todaysDate = new Date();
  const oneWeekAgo = new Date(new Date() - daysToMs(7));

  return [
    {
      id: 1,
      name: "Risk of Train",
      playerHistory: [
        { year: "year", month: "month", averagePlayers: 120 },
        {
          year: "year",
          month: "month",
          trackedPlayers: [
            { date: oneWeekAgo, players: 23 },
            { date: oneWeekAgo, players: 44 },
            { date: todaysDate, players: 15 },
            { date: todaysDate, players: 45 },
          ],
          averagePlayers: 105,
        },
      ],
    },
    {
      id: 2,
      name: "Risk of Rain",
      playerHistory: [{ averagePlayers: 85 }],
    },
    {
      id: 3,
      name: "Risk of Brain",
      playerHistory: [
        { averagePlayers: 70 },
        {
          year: "year",
          month: "month",
          trackedPlayers: [
            { date: oneWeekAgo, players: 53 },
            { date: oneWeekAgo, players: 78 },
            { date: todaysDate, players: 233 },
            { date: todaysDate, players: 455 },
          ],
          averagePlayers: 140,
        },
      ],
    },
    {
      id: 4,
      name: "Risk of Strain",
      playerHistory: [
        {
          year: "year",
          month: "month",
          trackedPlayers: [
            { date: oneWeekAgo, players: 22 },
            { date: oneWeekAgo, players: 44 },
            { date: todaysDate, players: 1400 },
            { date: todaysDate, players: 877 },
          ],
          averagePlayers: 102,
        },
      ],
    },
    {
      id: 5,
      name: "Risk of Crane",
      playerHistory: [
        { year: "year", month: "month", averagePlayers: 120 },
        {
          year: "year",
          month: "month",
          trackedPlayers: [
            { date: oneWeekAgo, players: 0 },
            { date: oneWeekAgo, players: null },
            { date: todaysDate, players: 0 },
            { date: todaysDate, players: null },
          ],
          averagePlayers: 105,
        },
      ],
    },
    {
      id: 6,
      name: "Risk of Hey",
      playerHistory: [
        { year: "year", month: "month", averagePlayers: 120 },
        {
          year: "year",
          month: "month",
          trackedPlayers: [
            { date: oneWeekAgo, players: 15 },
            { date: oneWeekAgo, players: 15 },
            { date: todaysDate, players: 15 },
            { date: todaysDate, players: 15 },
          ],
          averagePlayers: 105,
        },
      ],
    },
  ];
};

export const getGamesDatasetMock = () => {
  return [
    {
      id: 582660,
      name: "Black Desert",
      releaseDate: new Date("24 May, 2017"),
      developers: ["Pearl Abyss"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/582660/header.jpg",
      playerHistory: [],
      currentPlayers: 22933,
    },
    {
      id: 227300,
      name: "Euro Truck Simulator 2",
      releaseDate: new Date("17 Oct, 2999"),
      developers: ["SCS Software"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/227300/header.jpg",
      playerHistory: [],
      genres: ["Indie", "Simulation"],
      description:
        "Travel across Europe as king of the road, a trucker who delivers important cargo across impressive distances! With dozens of cities to explore, your endurance, skill and speed will all be pushed to their limits.",
      currentPlayers: 22769,
    },
    {
      id: 255710,
      name: "Cities: Skylines",
      releaseDate: new Date("23 Sep, 2015"),
      developers: ["Colossal Order Ltd."],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/255710/header.jpg",
      playerHistory: [],
      genres: ["Simulation", "Strategy"],
      description:
        "Cities: Skylines is a modern take on the classic city simulation. The game introduces new game play elements to realize the thrill and hardships of creating and maintaining a real city whilst expanding on some well-established tropes of the city building experience.",
      currentPlayers: 16128,
    },
    {
      id: 648800,
      name: "Raft",
      releaseDate: new Date("19 Jun, 2022"),
      developers: ["Redbeet Interactive"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/648800/header.jpg",
      playerHistory: [],
      genres: ["Adventure", "Indie", "Simulation"],
      description:
        "Raft throws you and your friends into an epic oceanic adventure! Alone or together, players battle to survive a perilous voyage across a vast sea! Gather debris, scavenge reefs and build your own floating home, but be wary of the man-eating sharks!",
      currentPlayers: 7619,
    },
    {
      id: 1293830,
      name: "Forza Horizon 4",
      releaseDate: new Date("9 Mar, 2021"),
      developers: ["Playground Games"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1293830/header.jpg",
      playerHistory: [],
      currentPlayers: 7231,
    },
    {
      id: 1283970,
      name: "YoloMouse",
      releaseDate: new Date("1 May, 2020"),
      developers: ["Dragonrise Games"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1283970/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:30:13.137Z",
              },
              players: 4374,
            },
          ],
          averagePlayers: 4374,
        },
      ],
      currentPlayers: 4374,
    },
    {
      id: 2218750,
      name: "Halls of Torment",
      releaseDate: "",
      developers: ["Chasing Carrots"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/2218750/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:30:13.125Z",
              },
              players: 4220,
            },
          ],
          averagePlayers: 4220,
        },
      ],
      currentPlayers: 4220,
    },
    {
      id: 239140,
      name: "Dying Light",
      releaseDate: "",
      developers: ["Sample Dev"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/239140/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:31:43.075Z",
              },
              players: 3654,
            },
          ],
          averagePlayers: 3654,
        },
      ],
      genres: ["Sample Genre"],
      description: "Sample Description",
      currentPlayers: 3654,
    },
    {
      id: 1263850,
      name: "Football Manager 2021",
      releaseDate: new Date("24 Nov, 2020"),
      developers: ["Sports Interactive"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1263850/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:33:18.609Z",
              },
              players: 2929,
            },
          ],
          averagePlayers: 2929,
        },
      ],
      genres: ["Simulation", "Strategy"],
      description:
        "Anno 1800™ – Lead the Industrial Revolution! Welcome to the dawn of the Industrial Age. The path you choose will define your world. Are you an innovator or an exploiter? A conqueror or a liberator? How the world remembers your name is up to you.",
      currentPlayers: 2929,
    },
    {
      id: 311210,
      name: "Call of Duty: Black Ops III",
      releaseDate: new Date("11.09.2005"),
      developers: [""],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/311210/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 5,
          trackedPlayers: [
            {
              date: {
                $date: "2023-06-04T10:26:50.232Z",
              },
              players: 3481,
            },
            {
              date: {
                $date: "2023-06-04T12:32:22.852Z",
              },
              players: 3945,
            },
          ],
          averagePlayers: 3713,
        },
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:33:18.618Z",
              },
              players: 2890,
            },
          ],
          averagePlayers: 2890,
        },
      ],
      genres: ["Action", "FPS"],
      description: "Great game",
      currentPlayers: 2890,
    },
    {
      id: 221380,
      name: "Age of Empires II (2013)",
      releaseDate: new Date("22 Aug 2013"),
      developers: [
        "Skybox Labs",
        "Hidden Path Entertainment",
        "Ensemble Studios",
        "Forgotten Empires",
      ],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/221380/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:31:43.076Z",
              },
              players: 2576,
            },
          ],
          averagePlayers: 2576,
        },
      ],
      genres: ["Strategy"],
      description:
        "Age of Empires II has been re-imagined in high definition with new features, trading cards, improved AI, workshop support, multiplayer, Steamworks integration and more!",
      currentPlayers: 2576,
    },
    {
      id: 240,
      name: "Counter-Strike: Source",
      releaseDate: new Date("31 Oct 2004"),
      developers: ["Valve"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/240/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:30:59.462Z",
              },
              players: 2477,
            },
          ],
          averagePlayers: 2477,
        },
      ],
      genres: ["Action"],
      description:
        "Counter-Strike: Source blends Counter-Strike's award-winning teamplay action with the advanced technology of Source™ technology.",
      currentPlayers: 2477,
    },
    {
      id: 232090,
      name: "Killing Floor 2",
      releaseDate: new Date("14.10.2004"),
      developers: [],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/232090/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:31:43.074Z",
              },
              players: 2320,
            },
          ],
          averagePlayers: 2320,
        },
      ],
      genres: ["Indie", "RPG", "Strategy"],
      description:
        "Killing Floor 2 is a challenging gothic roguelike turn-based RPG about the psychological stresses of adventuring. Recruit, train, and lead a team of flawed heroes against unimaginable horrors, stress, disease, and the ever-encroaching dark. Can you keep your heroes together when all hope is lost?",
      currentPlayers: 2320,
    },
    {
      id: 286160,
      name: "Tabletop Simulator",
      releaseDate: new Date("22 Apr 2015"),
      developers: ["Berserk Games"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/286160/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:30:59.462Z",
              },
              players: 2230,
            },
          ],
          averagePlayers: 2230,
        },
      ],
      genres: ["Casual", "Indie", "RPG", "Simulation", "Strategy"],
      description:
        "Tabletop Simulator is the only simulator where you can let your aggression out by flipping the table! There are no rules to follow: just you, a physics sandbox, and your friends. Make your own online board games or play the thousands of community created mods. Unlimited gaming possibilities!",
      currentPlayers: 2230,
    },
    {
      id: 881100,
      name: "Noita",
      releaseDate: new Date("14 Oct 2020"),
      developers: ["Nolla Games"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/881100/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:32:29.026Z",
              },
              players: 2073,
            },
          ],
          averagePlayers: 2073,
        },
      ],
      genres: [],
      description:
        "Noita is a magical action roguelite set in a world where every pixel is physically simulated. Fight, explore, melt, burn, freeze and evaporate your way through the procedurally generated world using spells you've created yourself.",
      currentPlayers: 2073,
    },
    {
      id: 620,
      name: "Portal 2",
      releaseDate: "",
      developers: ["Valve"],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:30:59.461Z",
              },
              players: 2038,
            },
          ],
          averagePlayers: 2038,
        },
      ],
      genres: ["Action", "Adventure"],
      description: "",
      currentPlayers: 2038,
    },
    {
      id: 646910,
      name: "The Crew 2",
      releaseDate: "",
      developers: [],
      image: null,
      imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/646910/header.jpg",
      playerHistory: [
        {
          year: 2023,
          month: 5,
          trackedPlayers: [
            {
              date: {
                $date: "2023-06-04T12:05:15.546Z",
              },
              players: 999,
            },
          ],
          averagePlayers: 999,
        },
        {
          year: 2023,
          month: 6,
          trackedPlayers: [
            {
              date: {
                $date: "2023-07-21T10:33:18.621Z",
              },
              players: 1981,
            },
          ],
          averagePlayers: 1981,
        },
      ],
      genres: ["Action", "Massively Multiplayer", "Racing"],
      description:
        "Take on the American motorsports scene as you explore and dominate the land, air, and sea across the entire USA. With a wide variety of cars, bikes, boats, and planes, compete in a wide range of driving disciplines.",
      currentPlayers: 1981,
    },
  ];
};
