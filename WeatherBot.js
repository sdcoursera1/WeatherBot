"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiai = require('apiai');
const apiaiApp = apiai('8f013d59656846fca2f064ad5f127f2c');
var http = require('http-request');
var request = require('request');


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
		let restUrl = 'http://api.openweathermap.org/data/2.5/weather'+'?q='+city+'&units=metric&APPID=d0aad646908835ef3e99b559ff2d96c0';
		var options = {
			host: 'http://api.openweathermap.org/data/2.5',
			port: 80,
			path: 'forecast'+'&q='+city+'&APPID=d0aad646908835ef3e99b559ff2d96c0',
			method: 'POST'
		};
		
		/*http.get(restUrl, function(err, res) {
			if(err) {
				console.log(err);
			}
			else{
				console.log(res.code, res.headers, res.buffer.toString());
				var body = '';
				res.on('data', function(chunk){
					body += chunk;
				});
				res.on('end', function(){
					var json = JSON.parse(body);
				});
				
				console.log('Le JSON obtenu est : ', json);
				var temp =json.weather.temp;
				var m = 'Il fait '+temp+'°C à '+city;
				console.log(m);
			}
		})*/
		request.get({
			url: restUrl,
			json: true,
			headers: {'User-Agent': 'request'}
		}, (err, res, data) => {
			if(err) {
				console.log('Error:', err);
			} 
			else if (res.statusCode != 200) {
				console.log('Status: ', res.statusCode);
			}
			else{
				console.log('La température est: ',data.weather.temp);
			}
		})
	}
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
  
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