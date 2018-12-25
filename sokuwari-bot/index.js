
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
                            "text": "次に人数を教えて下さい！下のボタンからも入力できます！",
                            "quickReply": { 
                                "items": [
                                    {
                                        "action": {
                                            "type": "message",
                                            "label": "2人",
                                            "text": "2人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "3人",
                                            "text": "3人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "4人",
                                            "text": "4人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "5人",
                                            "text": "5人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "6人",
                                            "text": "6人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "7人",
                                            "text": "7人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "8人",
                                            "text": "8人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "9人",
                                            "text": "9人"
                                          }
                                    },{
                                        "action": {
                                            "type": "message",
                                            "label": "10人",
                                            "text": "10人"
                                          }
                                    }
                                ]
                            }
                        }
                    ];
            } else if(Number.isInteger(parseInt(event.message.text))) {
                if(isNumberPeople(event.message.text)) {
                    let numberPeople = parseInt(event.message.text);
                    let result = Math.round(price / numberPeople);
                    /*
                    message_text = 
                    {
                        type: "text",
                        text: "ありがとうございます。\n" + event.message.text + "だと一人当たりの金額は" + result +"円です！"
                    };
                    */
                   message_text = {
                    "type": "template",
                    "altText": "一人あたりの金額は"+ result + "です。",
                    "template": {
                        "type": "text",  
                        "actions": [
                            {
                                "type": "message",
                                "label": "ああ",
                                "text": "確認しました！"
                            }
                        ],                
                        "text": "テキストです"
                    }
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
                text: "「割り勘」と入力していただければすぐに割り勘金額を計算をしますよー！"
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
