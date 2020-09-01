// import {
//   stateHistory,
//   updateHistory,
//   loadHistory,
//   removeVideoFromHistory,
// } from "./state-manager.js";

const txtUrl = document.querySelector("#txtUrl");
const iframe = document.querySelector("#player");
const btnParseUrl = document.querySelector("#txtUrl");

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  syncState();
  setSourceFromWindowParam();
});

function setSourceFromWindowParam() {
  const PARAM_NAME = "videoUrl";
  const { search } = window.location;

  if (search.includes(PARAM_NAME)) {
    var REGEX = new RegExp(`(?<=${PARAM_NAME}=).*$`);
    const videoUrl = search.match(REGEX);
    txtUrl.value = videoUrl;
    parseYoutubeVideoUrl();
  }
}

function selectText() {
  txtUrl.select();
}

function setSource() {
  const source = txtUrl.value.trim();
  iframe.setAttribute("src", source);
}

async function processVideoCode() {
  await pasteClipBoard();
  parseYoutubeVideoUrl();
  syncState();
}

function parseYoutubeVideoUrl() {
  const rawVideoUrl = txtUrl.value.trim();
  const template = "https://www.youtube.com/embed/";
  let parsedUrl, source;

  if (rawVideoUrl.includes("www.youtube.com/embed/")) {
    source = rawVideoUrl;
  } else {
    parsedUrl = getYoutubeVideoCode(rawVideoUrl);
    source = template + parsedUrl;
  }

  if (!source) {
    alert(`The url: ${rawVideoUrl} cannot be parsed :( `);
  } else {
    txtUrl.value = source;
    iframe.setAttribute("src", source);
    updateHistory(source);
  }
}

async function pasteClipBoard() {
  selectText();
  const text = await navigator.clipboard.readText();
  txtUrl.value = text;
}

function syncState() {
  loadHistory(state.stateHistory);
  loadButtonState(state.isHistoryHidden);
}

function loadHistory(stateHistory) {
  const listHistory = document.querySelector("#listHistory");

  listHistory.innerHTML = "";

  (stateHistory || []).forEach((item, index) => {
    listHistory.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item">
          <a href = "?videoUrl=${item}">
            ${item}
          </a>
          <button
          class = "btn-remove"  
          onclick="btnRemoveClick(${index})">X</button>
        </li>`
    );
  });
}

function loadButtonState(isHistoryHidden = null) {
  document.body.classList.toggle("is-history-hidden", isHistoryHidden);
}

function btnRemoveClick(index) {
  if (confirm("Are you sure to want to remove this video url?")) {
    removeVideoFromHistory(index);
    syncState();
  }
}

function btnToggleHistoryClick() {
  updateToggleHistory();
  loadButtonState(state.isHistoryHidden);
}
/*
   const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  https://www.youtube.com/watch?v=code_code
  https://www.youtube.com/watch?v=code_code&some_other_code
  */
