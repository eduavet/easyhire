const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const url = process.env.MONGO_URL;
exports.connectMongo = () => mongoose.connect(url);
