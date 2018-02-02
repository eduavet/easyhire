const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailsSchema = new Schema({
  userId: String,
  emailId: String,
  folder: { type: Schema.Types.ObjectId, ref: 'folders' },
  isRead: Boolean,
}, {
  versionKey: false,
});

const emailsModel = mongoose.model('emails', emailsSchema);
module.exports = emailsModel;
