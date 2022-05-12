import { JSDOM } from "jsdom";

export function parsePlayerHistory(pageHttpDetailsHtml) {
    const dom = new JSDOM(pageHttpDetailsHtml);
    const playerHistoryEntries = dom.window.document.querySelectorAll(".common-table tbody tr");

    const gamePlayerHistories = [];
    
    for(let entry of playerHistoryEntries) {
        const firstElement = entry.firstElementChild;

        if(firstElement.textContent === "Last 30 Days") continue;

        const averagePlayers = parseInt(firstElement.nextElementSibling.textContent);
        
        const monthAndYear = firstElement.textContent;
        const date = new Date(monthAndYear);

        const playerHistory = {
            date,
            players: averagePlayers,
        }

        gamePlayerHistories.push(playerHistory);
    }

    return gamePlayerHistories;
}