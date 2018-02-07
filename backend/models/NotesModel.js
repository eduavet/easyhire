const mongoose = require('mongoose');

const { Schema } = mongoose;

const notesSchema = new Schema({
  content: String,
  userId: String,
  sender: String,
  emailId: String,
  dateCreated: Date,
  dateUpdated: { type: Date, default: Date.now() },
}, {
  versionKey: false,
});

const notesModel = mongoose.model('notes', notesSchema);
module.exports = notesModel;
