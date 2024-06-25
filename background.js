chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveText") {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `extracted_text_${timestamp}`;
    let data = {};
    data[key] = request.data;

    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving text:", chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log(`Text saved successfully. Key: ${key}`);
        sendResponse({ success: true });
      }
    });
    return true; // sendResponseを非同期で呼び出すことを示す
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url && !details.url.startsWith('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(details.tabId, { action: "extractText" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Runtime error:", chrome.runtime.lastError.message);
        }
      });
    });
  }
});