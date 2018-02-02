require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const { connectMongo } = require('./db.js');
const myRouter = require('./routes/routes');


connectMongo();
require('./config/passport');

const app = express();
app.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
}));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.set('Access-Control-Allow-Credentials', true);
  // res.set("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  // res.set('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, () => {
  console.log('Listening to port 3000');
});

app.use('/', myRouter);
