"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiai = require('apiai');
const apiaiApp = apiai('8f013d59656846fca2f064ad5f127f2c');

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

app.post('/weather', (req, res) => {
	if (req.body.result.action === 'weather') {
		let city = req.body.result.parameters['geo-city'];
		console.log('The city name is: ', city);
		let restUrl = 'http://api.openweathermap.org/data/2.5/forecast'+'&q='+city+'&APPID=d0aad646908835ef3e99b559ff2d96c0';

		request.get(restUrl, (err, response, body) => {
			if (!err && response.statusCode == 200) {
				let json = JSON.parse(body);
				var msg = json.weather[0].description + ' and the temperature is ' + json.main.temp + ' °F';
				console.log(msg);
				return res.json({
					speech: msg,
					displayText: msg,
					source: 'weather'});
				//apiaiApp.textRequest(json);
			} else {
				return res.status(400).json({
					status: {
						code: 400,
						errorType: 'I failed to look up the city name.'}});
			}})
	}
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
  /*
  var request = apiaiApp.textRequest(text, { sessionId: 'azerty'});

  request.on('response', function(response) {
  	console.log(response);
  });

  request.on('error', function(error) {
  	console.log(error);
  });

  request.end();*/
  request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: text,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}