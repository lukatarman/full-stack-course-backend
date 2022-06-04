export class Game {
  id;            // appid=123456
  name;          // name="Metro"
  image;         // imgData=['D%', '7Z', 'HJ', ')I', 'LK'...'M;'];
  imageUrl;      // imageUrl=`https://cdn.akamai.steamstatic.com/steam/apps/${this.id}/header.jpg`
  playerHistory; // playerHistory=[{ date: "05.04.22", players: 122 }, { date: "04.04.22", players: 200 }, { date: "03.04.22", players: 150 }]

  static fromSteamApp(steamApp) {
    const game         = new Game();
    game.id            = steamApp.appid;
    game.name          = steamApp.name;
    game.imageUrl      = `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`
    game.playerHistory = [];
    return game;
  }

  static fromDbEntry(dbEntry) {
    const game         = new Game();
    game.id            = dbEntry.id;
    game.name          = dbEntry.name;
    game.imageUrl      = dbEntry.imageUrl;
    game.playerHistory = dbEntry.playerHistory;
    return game;
  }

  get lastUpdate() {
    return (this.playerHistory.length !== 0)
    ? this.playerHistory[this.playerHistory.length - 1].date
    : undefined;
  }
}
