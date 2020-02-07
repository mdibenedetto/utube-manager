const txtUrl = document.querySelector('#txtUrl');
const iframe = document.querySelector('#player');
const btnParseUrl = document.querySelector('#txtUrl');

function selectText() {
	txtUrl.select();
}

function setSource() {
	const source = txtUrl.value.trim();
	iframe.setAttribute('src', source);
}

function parseYoutubeVideoUrl() {
	const url = txtUrl.value.trim();
	const parsedUrl = getYoutubeVideoCode(url);
	const template = 'https://www.youtube.com/embed/';
	const source = template + parsedUrl;

	if (!source) {
		alert(`The url: ${url} cannot be parsed :( `);
	} else {
		txtUrl.value = source;
		iframe.setAttribute('src', source);
	}
}

async function pasteClipBoard() {
	selectText();
	const text = await navigator.clipboard.readText();
	txtUrl.value = text;
}

function getYoutubeVideoCode(url) {
	const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
	const matches = (url + ' ').match(REGEX);
	const videoCode = (matches || []).length > 0 ? matches[0] : null;

	return videoCode;
}

/*
   const REGEX = /(?<=watch\?v=).*(?=[&\s])/;
  https://www.youtube.com/watch?v=code_code
  https://www.youtube.com/watch?v=code_code&some_other_code
  */
