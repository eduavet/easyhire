const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const cors = require('cors');

const myRouter = require('./routes/routes');

const app = express();
app.use(cors())

app.listen(3000, () => {
  console.log('Listening to port 3000');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use('/', myRouter);
