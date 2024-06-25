// メッセージリスナーを追加。コンテンツスクリプトからメッセージを受け取る。
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveText") { // アクションが"saveText"の場合
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // タイムスタンプを生成
    const key = `extracted_text_${timestamp}`; // タイムスタンプをキーとして使用
    let data = {};
    data[key] = request.data; // 保存するデータをオブジェクトに設定

    // ローカルストレージにデータを保存
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) { // エラーが発生した場合
        console.error("Error saving text:", chrome.runtime.lastError.message); // エラーメッセージをコンソールに出力
        sendResponse({ success: false, error: chrome.runtime.lastError.message }); // エラーレスポンスを送信
      } else {
        console.log(`Text saved successfully. Key: ${key}`); // 成功メッセージをコンソールに出力
        sendResponse({ success: true }); // 成功レスポンスを送信
      }
    });
    return true; // sendResponseを非同期で呼び出すことを示す
  }
});

// ナビゲーション完了イベントリスナーを追加。ページが完全に読み込まれた後にトリガーされる。
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url && !details.url.startsWith('chrome://')) { // chrome:// URLでないことを確認
    // content.jsスクリプトを実行
    chrome.scripting.executeScript({
      target: { tabId: details.tabId }, // 対象のタブID
      files: ['content.js'] // 実行するスクリプトファイル
    }, () => {
      // コンテンツスクリプトにメッセージを送信してテキスト抽出を依頼
      chrome.tabs.sendMessage(details.tabId, { action: "extractText" }, (response) => {
        if (chrome.runtime.lastError) { // エラーが発生した場合
          console.log("Runtime error:", chrome.runtime.lastError.message); // エラーメッセージをコンソールに出力
        }
      });
    });
  }
});