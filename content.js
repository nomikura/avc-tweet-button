// タイトルを取得する
function getTitle(text) {
    // 文字列を後ろから探索し、最初のスペースを見つける。前から探索しないのは、ユーザが入力した情報に不用意に触れないため。あと、マルチバイト文字列の扱いが面倒なので。
    let lastSpacePosition = 0;
    for (let i = text.length-1; i >= 0; i--) {
        lastSpacePosition++;
        if (text[i] == ' ') {
            break;
        }
    }
    return text.slice(0, -lastSpacePosition);
}

// 説明を取得する
function getDescription(nextElement) {
    // 次の要素がpタグでなければ説明は書いてない
    if (nextElement.tagName != 'P') {
        return "";
    }
    // 説明のあるpタグには子要素がない。なので、子要素がある場合は説明は書いてない
    if (nextElement.childElementCount != 0) {
        return "";
    }
    // 説明が書いてあるので、それを返す
    return nextElement.innerText;
}

// テキストを取得
function getTweetText() {
    // 必要なテキストの大枠を取得する
    const headerTag = document.getElementsByClassName('page-header')[0]; // h1タグ
    const mainInformation = headerTag.innerText; // 例: [ゴリラジオ体操第140 ペナルティ5分 / 2018-12-04 06:25:00 ~ 2018-12-04 07:10:00]
    const firstHalf = mainInformation.slice(0, -44); // 例: [ゴリラジオ体操第140 ペナルティ5分]
    const latterHalf = mainInformation.slice(-41); // 例: [2018-12-04 06:25:00 ~ 2018-12-04 07:10:00]

    // ツイートで表示するテキストを取得する
    const titleText = getTitle(firstHalf);
    const urlText = headerTag.baseURI;
    const startTimeText = latterHalf.slice(5, 16).replace('-', '月').replace(' ', '日  ');
    const endingTimeText = latterHalf.slice(27, 38).replace('-', '月').replace(' ', '日  ');
    const descriptionText = getDescription(headerTag.nextElementSibling); // 次の要素を渡す

    // 実際にツイートする内容
    const tweetText = '#AtCoder_Virtual_Contest' + '\n'
                    + 'タイトル: ' + titleText + '\n'
                    + '開始: ' + startTimeText + '\n'
                    + '終了: ' + endingTimeText + '\n'
                    + 'URL: ' + urlText + '\n\n'
                    + descriptionText

    return tweetText;
}

// background.jsからコマンドが送られてきたら、ツイート画面とその内容を表示させる
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command && (msg.command == 'create_tweet')) {
        const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(getTweetText());
        const width = screen.width / 2;
        const height = screen.height / 2;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        window.open(url, null, 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',location=no');
    }
});
