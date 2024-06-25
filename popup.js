document.getElementById('extractButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (response) => {
      if (response && response.data) {
        console.log("Text extracted and saved.");
      }
    });
  });
});

function displaySavedTexts() {
  chrome.storage.local.get(null, (items) => {
    const savedTextsDiv = document.getElementById('savedTexts');
    savedTextsDiv.innerHTML = '';
    for (let key in items) {
      const div = document.createElement('div');
      div.innerHTML = `<strong>Key:</strong> ${key}<br><strong>Text:</strong> ${items[key]}<br><strong>Saved Path:</strong> chrome.storage.local`;
      savedTextsDiv.appendChild(div);
    }
  });
}

document.addEventListener('DOMContentLoaded', displaySavedTexts);