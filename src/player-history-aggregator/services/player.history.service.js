import { JSDOM } from "jsdom";
import { Players } from "../../models/players.js";

export function parsePlayerHistory(pageHttpDetailsHtml) {
  const dom = new JSDOM(pageHttpDetailsHtml);
  const playerHistoryEntries = dom.window.document.querySelectorAll(".common-table tbody tr");

  return Array.from(playerHistoryEntries)
              .map(entry => entry.firstElementChild)
              .map(firstElement => firstElement.textContent === "Last 30 Days" ? undefined: firstElement)
              .filter(element => !!element)
              .map(element => new Players(element.nextElementSibling.textContent, element.textContent));
}
