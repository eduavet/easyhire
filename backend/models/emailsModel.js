const db = require('../db.js')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailsSchema = new Schema({
    // id  : Schema.ObjectId,
    userId: String,
    allEmails : [
        {
            status: String,
            emails: [{ emailId: String, isRead: Boolean }],
            icon: String,
        }
    ]
}, {
    versionKey: false
});

const emailsModel = mongoose.model('emails', emailsSchema);
module.exports = emailsModel;
