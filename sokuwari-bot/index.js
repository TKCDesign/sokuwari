const LINE_CHANNEL_ACCESS_TOKEN = 'channl Access Token';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

app.post('/webhook', function(req, res, next){
    res.status(200).end();
    for(var event of req.body.events){
        if(event.type == 'massage' && event.massage.text == 'hello'){
            var headers = {
                'Cinst-Type': 'application/json',
                'Authorization': 'Bearer' + LINE_CHANNEL_ACCESS_TOKEN
            }
            var body = {
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: 'hello'
                }]
            }
            var url = 'https://api.line.me/v2/bot/message/reply';
            request({
                url: url,
                method: 'POST',
                headers: headers,
                body: body,
                json: true
            });
        }
    }
});