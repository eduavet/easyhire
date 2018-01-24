const db = require('../db.js')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailsSchema = new Schema({
    id  : Schema.ObjectId,
    owner: String,
    authorName: String,
    authorEmail: String,
    subject: String,
    content: String,
    status: String,
    timestamp: Date,
    attachments: Array
}, {
    versionKey: false
});

const emailsModel = mongoose.model('emails', emailsSchema);
module.exports = emailsModel;
