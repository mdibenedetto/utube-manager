const HISTORY_KEY = "utube-history";
let stateHistory = [];

function updateHistory(videoUrl) {
  if (stateHistory.includes(videoUrl)) return;
  stateHistory.push(videoUrl);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(stateHistory));
}

function loadHistory() {
  const plainHistory = localStorage.getItem(HISTORY_KEY);
  stateHistory = plainHistory ? JSON.parse(plainHistory) : [];
}

function removeVideoFromHistory(index) {
  stateHistory.splice(index, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(stateHistory));
}

function getYoutubeVideoCode(rawUrl) {
  const url = rawUrl.split("&")[0];

  const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  const matches = (url + " ").match(REGEX);
  const videoCode = (matches || []).length > 0 ? matches[0] : null;

  return videoCode;
}
