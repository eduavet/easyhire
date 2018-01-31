const db = require('../db.js')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    googleUser_id: String,
    name: String,
    image: String,
    email: String,
}, {
    versionKey: false
});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;
