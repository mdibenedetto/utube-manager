const HISTORY_KEY = "utube-history";
let state = {
  stateHistory: [],
  isHistoryHidden: false,
};

function updateToggleHistory() {
  state.isHistoryHidden = !state.isHistoryHidden;
  updateState();
}

function updateHistory(videoUrl) {
  if (state.stateHistory.includes(videoUrl)) return;
  state.stateHistory.push(videoUrl);
  updateState();
}

function loadState() {
  const plainState = localStorage.getItem(HISTORY_KEY);
  const testState = plainState ? JSON.parse(plainState) : {};
  if (testState.stateHistory) {
    state = testState;
  }
}

function removeVideoFromHistory(index) {
  state.stateHistory.splice(index, 1);
  updateState();
}

function getYoutubeVideoCode(rawUrl) {
  const url = rawUrl.split("&")[0];

  const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  const matches = (url + " ").match(REGEX);
  const videoCode = (matches || []).length > 0 ? matches[0] : null;

  return videoCode;
}

function updateState() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state));
}
