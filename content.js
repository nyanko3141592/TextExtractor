function extractText() {
  let text = document.body.innerText;
  return text;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    let text = extractText();
    sendResponse({ data: text });
  }
});