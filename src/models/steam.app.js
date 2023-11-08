export class SteamApp {
  appid;
  name;
  type;
  triedVia;
  static validTypes = this.#createValidTypesEnum([
    "game",
    "downloadableContent",
    "unknown",
  ]);
  static validDataSources = this.#createValidDataSourcesEnum(["steamWeb", "steamCharts"]);

  copy() {
    const copy = new SteamApp();
    copy.appid = this.appid;
    copy.name = this.name;
    copy.type = this.type;
    copy.triedVia = this.triedVia.slice();

    return copy;
  }

  triedViaSteamWeb() {
    this.triedVia.push(SteamApp.validDataSources.steamWeb);
  }

  triedViaSteamchartsWeb() {
    this.triedVia.push(SteamApp.validDataSources.steamCharts);
  }

  isGame() {
    return this.type === SteamApp.validTypes.game;
  }

  set appType(type) {
    this.type = type;
  }

  static #createValidTypesEnum(values) {
    const enumObject = {};
    for (const val of values) {
      enumObject[val] = val;
    }
    return Object.freeze(enumObject);
  }

  static #createValidDataSourcesEnum(values) {
    const enumObject = {};
    for (const val of values) {
      enumObject[val] = val;
    }
    return Object.freeze(enumObject);
  }

  static manyFromSteamApi(apps) {
    return apps.map((app) => SteamApp.oneFromSteamApi(app));
  }

  // prettier-ignore
  static oneFromSteamApi(data) {
    const steamApp      = new SteamApp();
    steamApp.appid      = data.appid;
    steamApp.name       = data.name;
    steamApp.type       = SteamApp.validTypes.unknown;
    steamApp.triedVia   = [];
    return steamApp;
  }

  static manyFromDbEntries(dbEntries) {
    return dbEntries.map((dbEntry) => SteamApp.oneFromDbEntry(dbEntry));
  }

  // prettier-ignore
  static oneFromDbEntry(dbEntry) {
    const steamApp      = new SteamApp();
    steamApp.appid      = dbEntry.appid;
    steamApp.name       = dbEntry.name;
    steamApp.type       = dbEntry.type;
    steamApp.triedVia   = dbEntry.triedVia.slice();
    return steamApp;
  }

  static diff(steamAppsSource, steamAppsTarget) {
    const targetAppIds = steamAppsTarget.map((app) => app.appid);

    return steamAppsSource.filter((app) => !targetAppIds.includes(app.appid));
  }
}
