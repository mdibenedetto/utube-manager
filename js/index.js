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
  txtUrl.value = await navigator.clipboard.readText();
}

function syncState() {
  onLoadHistory(state.stateHistory);
  onTogglePanelHistory(state.isHistoryHidden);
}

function onLoadHistory(stateHistory) {
  const listHistory = document.querySelector("#listHistory");
  listHistory.innerHTML = "";

  (stateHistory || []).forEach((item, index) => {
    listHistory.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item">
          <a href = "?videoUrl=${item.url}"
              title = ${item.text || ""} >
            ${item.text || item.url}
          </a>
          <button
          class = "btn-remove"  
          onclick="onRemoveClick(${index})">X</button>
        </li>`
    );
  });
}

function onTogglePanelHistory(isHistoryHidden = null) {
  document.body.classList.toggle("is-history-hidden", isHistoryHidden);
}

function onRemoveClick(index) {
  if (confirm("Are you sure to want to remove this video url?")) {
    removeVideoFromHistory(index);
    syncState();
  }
}

function onToggleHistoryClick() {
  updateToggleHistory();
  onTogglePanelHistory(state.isHistoryHidden);
}

function attachAnchorListeners() {
  const anchors = document.querySelectorAll("a");

  anchors.forEach((anchor, index) => {
    if (!anchor.title) {
      debugger;
      anchor.addEventListener("mouseover", async function _onMouseOver() {
        const utubeURL = parseParamVideoUrl(anchor.href)[0];
        const title = await findTitle(utubeURL);

        anchor.setAttribute("title", title);
        anchor.innerText = title;

        anchor.removeEventListener("mouseover", _onMouseOver);
        updateTextLink(index, title);
      });
    }
  });
}
