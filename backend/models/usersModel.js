const db = require('../db.js')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id  : Schema.ObjectId,
    googleID: String,
    name: String,
    image: String,
    email: String,
    lastSync: Date
}, {
    versionKey: false
});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;
