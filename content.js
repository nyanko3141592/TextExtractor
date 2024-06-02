function extractText() {
  let text = document.body.innerText;
  return text;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    let text = extractText();
    chrome.runtime.sendMessage({ action: "downloadText", data: text });
    sendResponse({ data: text });
  }
});

// 初期ロード時にもテキストを抽出する
chrome.runtime.sendMessage({ action: "downloadText", data: extractText() });