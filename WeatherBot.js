/*var apiai = require('apiai');

var https = require('https');

var options = {
	hostname: 'api.api.ai',
	port: 443,
	path: '/v1/query',
	method: 'GET',
	header:{
		'Authorization':'Bearer 8f013d59656846fca2f064ad5f127f2c'
	}
};

var app = apiai("8f013d59656846fca2f064ad5f127f2c", options);


var reqOptions = {
	lang: "fr",
	timezone: "Europte/Paris",
	sessionId: "SessionID"
}
var request = app.textRequest*/

/*var callback=function(data) {
	console.log(data);
}

https.get(options, function(res) {
	var body='';
	res.on('data', function(data){
		body = body + data;
	});
	res.on('end', function(){
		var result=JSON.parse(body);
		callback(result);
	});
}).on('error', function(e){
	console.log('Error: '+e);
});*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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

/*
function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: EAAY119ZCG2X4BAHeKFpQRCtxtKmxCBjHbR1w3czdWK6NjQzekqJZBhlj4C1LeCHA2Yk4D9ZAi3eMyeuldsaCE57hZBZBIOf9bojJBBJsOvVjVVB8EP7LvP5Tux3u9p5kOQ9BrehZCIreLpPK3tZB11RKgg3XTZCA6RRLS7QnQ8IicQZDZD},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}
*/