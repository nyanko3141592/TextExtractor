chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadText") {
    const blob = new Blob([request.data], { type: 'text/plain' });
    const reader = new FileReader();
    reader.onload = function(event) {
      const url = event.target.result;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // タイムスタンプをファイル名に追加
      const filename = `extracted_text_${timestamp}.txt`;

      chrome.downloads.download({
        url: url,
        filename: filename
      });
      sendResponse({ success: true });
    };
    reader.readAsDataURL(blob);
    return true; // sendResponseを非同期で呼び出すことを示す
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabId, { action: "extractText" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Runtime error:", chrome.runtime.lastError.message);
        }
      });
    });
  }
});