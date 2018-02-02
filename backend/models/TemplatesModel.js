const mongoose = require('mongoose');

const { Schema } = mongoose;

const templatesSchema = new Schema({
  userId: { type: String, default: null },
  name: String,
  content: String,
  icon: String,
}, {
  versionKey: false,
});

const templatesModel = mongoose.model('templates', templatesSchema);
module.exports = templatesModel;
