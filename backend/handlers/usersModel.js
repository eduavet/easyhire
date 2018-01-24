const db = require('./db.js')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id  : Schema.ObjectId,
    email: String,
    fname: String,
    lname: String,
    lastSync: Date
}, {
    versionKey: false
});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;
