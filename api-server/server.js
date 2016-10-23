var express = require('express');
var app = express();
var twilio = require('twilio');
var parser = require('body-parser');
app.use(parser.urlencoded());
var twilio = require('twilio')(process.env['twilio_sid'],process.env['twilio_auth']);

app.post('/', function(req, res) {
  var resp = new twilio.TwimlResponse();
  console.log(req.body);
  resp.message('test message');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(resp.toString());
});

app.get('/send', function(req, res) {
  var number = req.query.phone;
  if (typeof number === undefined) {
    return res.sendStatus(400);
  }
  var message = req.query.message;
  if (typeof message === undefined) {
    message = 'Please provide a message.';
  }
  twilio.sendMessage({
    to: '+1' + number,
    from: '+16303184442',
    body: message
  }, function(err, response) {
    if (!err) {
      res.send(response);
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  });
});

var server = app.listen(8890, function() {
  console.log('Server listening on port 8890');
});
