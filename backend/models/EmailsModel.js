const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailsSchema = new Schema({
  userId: String,
  emailId: String,
  folder: { type: Schema.Types.ObjectId, ref: 'folders', default: null },
  isRead: Boolean,
  sender: String,
  subject: String,
  snippet: String,
  status: { type: Schema.Types.ObjectId, ref: 'statuses' },
  date: String,
  threadId: String,
  attachments: Array,
  deleted: Boolean,
}, {
  versionKey: false,
});

const EmailsModel = mongoose.model('emails', emailsSchema);
module.exports = EmailsModel;
