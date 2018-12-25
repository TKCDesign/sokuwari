
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
    /**
     * ユーザーが入力した値が金額か判定
     * @param {string} input　入力された文字列 
     */
    function isPrice(input) {
        let price = input.slice( -1 );
        if(price == "円") {
            return true;
        }
        return false;
    }
    

    /**
     * ユーザーが入力した値が人数か判定
     * @param {string} input 入力された文字列
     */
    
    function isNumberPeople(input) {
        let numberPeople = input.slice( -1 );
        if(numberPeople == "人") {
            return true;
        }
        return false;
    }
    
    //イベントオブジェクトの処理を書く
    req.body.events.forEach((event) => {
        
        if (event.type == "message" && event.message.type == "text"){
            let message_text = [];
            if (event.message.text == "割り勘"){
                message_text = 
                {
                    type: "text",
                    text: "割り勘する金額を教えて下さい！\n例:1000円"
                };
            } else if (Number.isInteger(parseInt(event.message.text))) {
                if(isPrice(event.message.text)){
                    price = parseInt(event.message.text);
                    message_text = [
                    {
                        "type": "text",
                        "text": "ありがとうございます。\n金額は" + event.message.text +"ですね！" 
                    },
                    {
                        "type": "text",
                        "text": "次に人数を教えて下さい！",
                        "quickReply": { 
                            "items": [
                                {
                                    "type": "action", 
                                    "imageUrl": "https://example.com/sushi.png",
                                    "action": {
                                    "type": "message",
                                    "label": "Sushi",
                                    "text": "Sushi"
                                    }
                                },
                                {
                                    "type": "action",
                                    "imageUrl": "https://example.com/tempura.png",
                                    "action": {
                                    "type": "message",
                                    "label": "Tempura",
                                    "text": "Tempura"
                                    }
                                },
                                {
                                    "type": "action", // ④
                                    "action": {
                                        "type": "location",
                                        "label": "Send location"
                                    }
                                }
                            ]}
                    }];
            } else if(Number.isInteger(parseInt(event.message.text))) {
                if(isNumberPeople(event.message.text)) {
                    let numberPeople = parseInt(event.message.text);
                    let result = Math.round(price / numberPeople);
                    message_text = 
                    {
                        type: "text",
                        text: "ありがとうございます。\n" + event.message.text + "だと一人当たりの金額は" + result +"円です！"
                    };
                }
            } else {
                message_text = 
                {
                    type: "text",
                    text: "入力に誤りがあります。\n数字に単位がついていない、数字が全角になってしまっているか等の原因が考えられます。"
                }
            }
        } else {
            message_text = 
            {
                type: "text",
                text: "「割り勘」と入力していただければすぐに割り勘計算をしますよー！"
            }
        }
            /*elseif(isPrice(event.message.text) && ) {
                message_text = 
                {
                    type: "text",
                    text: "ありがとうございます！金額は" + event.message.text + "ですね。"
                },
                {
                    type: "text",
                    text: "次に人数を入力して下さい！"
                };
            }
            */
            events_processed.push(bot.replyMessage(event.replyToken, message_text));
            }
    });

    //イベント処理が終わったら
    Promise.all(events_processed).then(
        (Response) => {
            console.log('${response.length} event(s) processed.');
        }
    );
});
