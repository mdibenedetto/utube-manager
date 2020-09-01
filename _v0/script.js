const txtUrl = document.querySelector("#txtUrl");
const iframe = document.querySelector("#player");
const btnParseUrl = document.querySelector("#txtUrl");

document.addEventListener("DOMContentLoaded", () => {
  setSourceFromWindowParam();
  parseYoutubeVideoUrl();
});
function setSourceFromWindowParam() {
  const PARAM_NAME = "videoUrl";
  const { search } = window.location;

  if (search.includes(PARAM_NAME)) {
    var REGEX = new RegExp(`(?<=${PARAM_NAME}=).*$`);
    const videoUrl = search.match(REGEX);
    txtUrl.value = videoUrl;
  }
}

function selectText() {
  txtUrl.select();
}

function setSource() {
  const source = txtUrl.value.trim();
  iframe.setAttribute("src", source);
}

function parseYoutubeVideoUrl() {
  const url = txtUrl.value.trim();
  const parsedUrl = getYoutubeVideoCode(url);
  const template = "https://www.youtube.com/embed/";
  const source = template + parsedUrl;

  if (!source) {
    alert(`The url: ${url} cannot be parsed :( `);
  } else {
    txtUrl.value = source;
    iframe.setAttribute("src", source);
  }
}

async function pasteClipBoard() {
  selectText();
  const text = await navigator.clipboard.readText();
  txtUrl.value = text;
}

function getYoutubeVideoCode(rawUrl) {
  const url = rawUrl.split("&")[0];

  const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  const matches = (url + " ").match(REGEX);
  const videoCode = (matches || []).length > 0 ? matches[0] : null;

  return videoCode;
}

/*
   const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  https://www.youtube.com/watch?v=code_code
  https://www.youtube.com/watch?v=code_code&some_other_code
  */
