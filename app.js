const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var logger = require('morgan');
const cors = require('cors');
const notificationRoutes = require('./src/routes/notifications');
require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api', notificationRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log("err: ", err)
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3001;
/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

module.exports = app
/*const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to generate Twilio token
app.get('/token', (req, res) => {
  const identity = 'Calls';  // Replace with the identity of the user (could be dynamic)

  const voiceGrant = new twilio.jwt.AccessToken.VoiceGrant({
    outgoingApplicationSid: 'Calls',  // Your TwiML App SID
    incomingAllow: true  // Allow incoming calls
  });

  const token = new twilio.jwt.AccessToken(accountSid, apiKeySid, apiKeySecret);
  token.addGrant(voiceGrant);
  token.identity = identity;

  res.send({ token: token.toJwt() });
});

// Route to handle the TwiML response
app.post('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial();
  dial.number(req.body.To);

  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/