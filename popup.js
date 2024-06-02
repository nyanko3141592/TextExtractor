document.getElementById('extractButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (response) => {
      if (response && response.data) {
        chrome.runtime.sendMessage({ action: "downloadText", data: response.data }, (response) => {
          if (response.success) {
            alert("Text has been downloaded!");
          } else {
            alert("Failed to download text.");
          }
        });
      }
    });
  });
});