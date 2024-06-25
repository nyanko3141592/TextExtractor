function extractText() {
  let text = document.body.innerText;
  console.log("Text extracted:", text); // テキスト抽出時にコンソール出力
  return text;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    let text = extractText();
    chrome.runtime.sendMessage({ action: "saveText", data: text }, (response) => {
      if (response.success) {
        console.log("Text saved successfully.");
      } else {
        console.error("Error saving text:", response.error);
      }
    });
    sendResponse({ data: text });
  }
});