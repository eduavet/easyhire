const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailsSchema = new Schema({
  user_id: String,
  email_id: String,
  folder: { type: Schema.Types.ObjectId, ref: 'folders' },
  isRead: Boolean,
}, {
  versionKey: false,
});

const emailsModel = mongoose.model('emails', emailsSchema);
module.exports = emailsModel;
