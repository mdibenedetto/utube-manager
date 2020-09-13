const HISTORY_KEY = "utube-history";
const PARAM_NAME = "videoUrl";

/*
   const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  https://www.youtube.com/watch?v=code_code
  https://www.youtube.com/watch?v=code_code&some_other_code
  */

let state = {
  stateHistory: [],
  isHistoryHidden: false,
};

function updateToggleHistory() {
  state.isHistoryHidden = !state.isHistoryHidden;
  updateState();
}

function updateHistory(videoUrl) {
  if (
    state.stateHistory.includes(videoUrl) ||
    state.stateHistory.find((st) => st.url === videoUrl)
  )
    return;

  state.stateHistory.push({
    text: null,
    url: videoUrl,
  });
  updateState();
}

function loadState() {
  const plainState = localStorage.getItem(HISTORY_KEY);
  const testState = plainState ? JSON.parse(plainState) : {};
  // old data model
  if (testState && typeof testState?.stateHistory[0] === "string") {
    testState.stateHistory = testState.stateHistory.map((url) => ({
      url,
    }));
    state = testState;
  }
  // new data model
  else if (testState) {
    state = testState;
  }
}

function removeVideoFromHistory(index) {
  state.stateHistory.splice(index, 1);
  updateState();
}

function updateTextLink(index, title) {
  state.stateHistory[index].text = title;
  updateState();
}

function getYoutubeVideoCode(rawUrl) {
  const url = rawUrl.split("&")[0];

  const FB_REGEXs = [
    /(?<=(watch%3Fv%3D))(.*)(?=(%26fbclid))/,
    /(?<=(youtu.be%2F))(.*)(?=(%3Ffbclid))/,
  ];
  const YT_REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  const REGEXs = [...FB_REGEXs, YT_REGEX];

  for (const REGEX of REGEXs) {
    const matches = (url + " ").match(REGEX);
    const videoCode = (matches || []).length > 0 ? matches[0] : null;
    if (videoCode) {
      return videoCode;
    }
  }

  return null;
}

function updateState() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state));
}

function parseInputVideoUrl(rawVideoUrl) {
  const template = "https://www.youtube.com/embed/";
  let parsedUrl, source;

  if (rawVideoUrl.includes("www.youtube.com/embed/")) {
    source = rawVideoUrl;
  } else {
    parsedUrl = getYoutubeVideoCode(rawVideoUrl);
    source = template + parsedUrl;
  }

  return source;
}

function parseParamVideoUrl(search) {
  const PARAM_NAME = "videoUrl";

  var REGEX = new RegExp(`(?<=${PARAM_NAME}=).*$`);
  const videoUrl = search.match(REGEX);
  return videoUrl;
}

function findTitle(utubeURL) {
  return fetch("https://textance.herokuapp.com/title/" + utubeURL).then((res) =>
    res.text()
  );
}
