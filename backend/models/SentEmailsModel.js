const mongoose = require('mongoose');

const { Schema } = mongoose;

const sentEmailsSchema = new Schema({
  userId: String,
  emailId: String,
  folder: { type: Schema.Types.ObjectId, ref: 'folders', default: null },
  sender: String,
  subject: String,
  snippet: String,
  date: String,
  threadId: String,
  attachments: Array,
  deleted: Boolean,
  isRead: Boolean,
}, {
  versionKey: false,
});

const SentEmailsModel = mongoose.model('sentEmails', sentEmailsSchema);
module.exports = SentEmailsModel;
