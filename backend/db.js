const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
exports.connectMongo = () => {
    return mongoose.connect(url);
};
