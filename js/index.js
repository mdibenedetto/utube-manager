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
  attachAnchorListeners();
});

function setSourceFromWindowParam() {
  const { search } = window.location;
  if (search.includes(PARAM_NAME)) {
    txtUrl.value = parseParamVideoUrl(search);
    onParseYoutubeVideoUrl();
  }
}

async function onProcessVideoCode() {
  await onPasteClipBoard();
  onParseYoutubeVideoUrl();
  syncState();
}

function onParseYoutubeVideoUrl() {
  const rawVideoUrl = txtUrl.value.trim();
  const source = parseInputVideoUrl(rawVideoUrl);

  if (!source) {
    alert(`The url: ${rawVideoUrl} cannot be parsed :( `);
  } else {
    txtUrl.value = source;
    iframe.setAttribute("src", source);
    updateHistory(source);
  }
}

async function onPasteClipBoard() {
  txtUrl.select();
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

function onToggleHistoryClick() {
  updateToggleHistory();
  loadButtonState(state.isHistoryHidden);
}

function attachAnchorListeners() {
  const anchors = document.querySelectorAll("a");

  anchors.forEach((anchor) => {
    anchor.addEventListener("mouseover", async function _mouseover() {
      const utubeURL = parseParamVideoUrl(anchor.href)[0];

      const title = await fetch(
        "https://textance.herokuapp.com/title/" + utubeURL
      ).then((res) => res.text());

      anchor.setAttribute("title", title);
      anchor.removeEventListener("mouseover", _mouseover);
    });
  });
}
