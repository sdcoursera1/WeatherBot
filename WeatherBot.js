"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiai = require('apiai');
const app2 = apiai('8f013d59656846fca2f064ad5f127f2c');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = app.listen(process.env.PORT || 5001, () => {
	console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


app.get('/webhook', (req,res) => {
	if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'azerty'){
		res.status(200).send(req.query['hub.challenge']);
	} 
	else{
		res.status(403).end();
	}
});


app.post('/webhook', (req, res) => {
	console.log(req.body);
	if (req.body.object === 'page') {
		req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
	}
});


function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat' // use any arbitrary id
  });

  apiai.on('response', (response) => {
    let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: 'EAAY119ZCG2X4BABOUJHxSkYMyzoe6Mz8PVEuOIXYnDLhaOH5oZAywhurcTZBFjs52qO1JQ36gsmZCxkgsu1jGMoL5V3vQmNqWZCVcJbij06QZCOT96OBWXenRflVbgyBo6rD3E4q9hMKKNbGrUSLGMm1Me7iZAaOK0lkUYNFqryawZDZD'},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}