// タブにあるアイコンがクリックされたらツイート生成コマンドを送る
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {
        command: "create_tweet",
    },
    (msg) => {
        console.log("result message: ", msg);
    })
});