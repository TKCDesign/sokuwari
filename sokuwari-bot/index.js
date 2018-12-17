
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging API SDK

const line_config = {
    channelAccessToken: process.env.LINE_ACCCESS_TOKEN,
    channelSercret: process.env.LINE_CHANNEL_SECRET
};

//webサーバー設定　
server.listen(process.env.PORT || 3000);


//ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    res.sendStatus(200);
    console.log(req.body);
});
