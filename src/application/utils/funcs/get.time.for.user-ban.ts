export function getTimeForUserBan(isBanning: boolean) {
  let time;
  isBanning ? (time = new Date().toISOString()) : (time = null);
  return time;
}
