
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
    /*
    function isPrice(inputPrice) {
        //文字列最後の円を取り除く

        //var price  = inputPrice.slice( 0, -1) ;
        parseInt(inputPrice);
        if(Number.isInteger(inputPrice)) {
            return false;
        }
        return true;
    };
    */
    /**
     * ユーザーが入力した値が金額か判定
     * @param {string} input　入力された文字列 
     */
    function isPrice(input) {
        var price = input.slice( -1 ) ;
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
        var numberPeople = input.slice( -1 );
        if(price == "人") {
            return true;
        }
        return false;
    }
    //イベントオブジェクトの処理を書く
    req.body.events.forEach((event) => {
        if (event.type == "message" && event.message.type == "text"){
            let message_text = [];
             var price = 0;
            if (event.message.text == "割り勘"){
                message_text = 
                {
                    type: "text",
                    text: "それでは割り勘金額を計算します！"
                },
                {
                    tpye: "text",
                    text: "割り勘する金額を教えて下さい！ 例:1000円"
                };
            } else if (Number.isInteger(parseInt(event.message.text))) {
                if(isPrice()){
                    message_text = 
                    {
                        type: "text",
                        text: "ありがとうございます。金額は" + event.message.text +"ですね！"
                    },
                    {
                        type: "text",
                        text: "次に人数を教えて下さい！"
                    };
                } else if(isNumberPeople()) {
                    message_text = 
                    {
                        type: "text",
                        text: "ありがとうございます。" + event.message.text + "だと一人当たりの金額は" + price +"です！"
                    };
                } else {
                    message_text = 
                    {
                        type: "text",
                        text: "入力に誤りがあります。数字に単位がついていない、数字が全角になってしまっているか等の原因が考えられます。"
                    }
                };
            };
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
