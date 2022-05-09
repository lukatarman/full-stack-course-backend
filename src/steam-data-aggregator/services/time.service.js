import { delay } from "../../shared/time.utils.js";

export function moreThanXhoursPassedSince(x, date) {
  return (msPassedSince(date)) > x;
}

export function msPassedSince(date) {
  const now = new Date().getTime();
  const dateInMs = date.getTime();
  return Math.abs(now - dateInMs);
}

export async function runFuncInLoopWithDelayOfXmsFromDate(func, x, date) {
  const ms = msPassedSince(date);
  const tillNextRun = ms > x ? x : x - ms;
  await delay(tillNextRun);

  while(true) {
    func();
    await delay(x);
  }
}
