
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging API SDK

const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const bot = new line.Client(line_config);

//webサーバー設定　
server.listen(process.env.PORT || 3000);


//ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    //最初に成功ステータスを返す
    res.sendStatus(200);
    //イベント処理のプロミスを格納
    let events_processed = [];
    //イベントオブジェクトの処理を書く
    req.body.events.forEach((event) => {
        /*
        if (event.type == "message" && event.message.type == "text"){
            if (event.message.text == "おはよう"){
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "おはよう"
                }));
            }
            if (event.message.text == "こんにちは"){
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "こんにちは"
                }));
            }
            if (event.message.text == "こんばんは"){
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "こんばんは"
                }));
            }
        }
        */
       if (event.message.text == "割り勘"){
            events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "それでは金額を計算します。"
            }));
            events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "それでは金額を計算します。"
            }));
       }
    });

    //イベント処理が終わったら
    Promise.all(events_processed).then(
        (Response) => {
            console.log('${response.length} event(s) processed.');
        }
    );
});
