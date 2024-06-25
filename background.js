let socket = null;
const reconnectInterval = 5000; // 再接続の間隔（ミリ秒）
let reconnectTimeout = null;

// WebSocket接続を確立する関数
function connectWebSocket() {
  socket = new WebSocket('ws://localhost:8765');

  socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened');
    clearTimeout(reconnectTimeout); // 再接続タイマーをクリア
  });

  socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
  });

  socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed');
    socket = null;
    scheduleReconnect();
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    socket = null;
    scheduleReconnect();
  });
}

// 再接続をスケジュールする関数
function scheduleReconnect() {
  if (!reconnectTimeout) {
    reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      connectWebSocket();
    }, reconnectInterval);
  }
}

// WebSocketでメッセージを送信する関数
function sendWebSocketMessage(url, message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const payload = { url: url, message: message };
    console.log('Sending message to server:', payload);
    socket.send(JSON.stringify(payload));
  } else {
    console.error('WebSocket is not connected');
  }
}

// 拡張機能がインストールされたときにWebSocket接続を開始
chrome.runtime.onInstalled.addListener(() => {
  connectWebSocket();
});

// メッセージリスナーを追加。コンテンツスクリプトからメッセージを受け取る
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    // WebSocketメッセージを送信
    sendWebSocketMessage(sender.tab.url, request.data);
    sendResponse({ success: true });
    return true;
  }
});

// ナビゲーション完了イベントリスナーを追加。ページが完全に読み込まれた後にトリガーされる
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url && !details.url.startsWith('chrome://')) {
    // content.jsスクリプトを実行
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    }, () => {
      // コンテンツスクリプトにメッセージを送信してテキスト抽出を依頼
      chrome.tabs.sendMessage(details.tabId, { action: "extractText" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Runtime error:", chrome.runtime.lastError.message);
        } else {
          // WebSocketで通信
          sendWebSocketMessage(details.url, response.data);
        }
      });
    });
  }
});