const mongoose = require('mongoose');

const { Schema } = mongoose;

const notesSchema = new Schema({
  content: String,
  userId: String,
  emailId: String,
  date: Date,
}, {
  versionKey: false,
});

const notesModel = mongoose.model('notes', notesSchema);
module.exports = notesModel;
