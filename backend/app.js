require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const { connectMongo } = require('./db.js');
const initializeRoutes = require('./routes/index');

connectMongo();
require('./config/passport');

const app = express();

// app.use(morgan('combined'));
app.use(require('morgan')(':method :url :status - :response-time ms'));
app.use(express.static(path.join(__dirname, 'attachments')));
app.use(cors({
  origin: process.env.HOMEPAGE,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
}));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', process.env.HOMEPAGE);
  res.set('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());

initializeRoutes(app);

app.listen(3000, () => {
  console.log('Listening to port 3000');
});

