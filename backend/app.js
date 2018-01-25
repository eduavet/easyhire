const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const cors = require('cors');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('./config/passport');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use( passport.initialize());
app.use( passport.session());

const myRouter = require('./routes/routes');

app.listen(3000, () => {
  console.log('Listening to port 3000');
});



app.use('/', myRouter);
