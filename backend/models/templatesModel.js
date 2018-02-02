const mongoose = require('mongoose');

const { Schema } = mongoose;

const templatesSchema = new Schema({
  user_id: { type: String, default: null },
  name: String,
  content: String,
  icon: String,
}, {
  versionKey: false,
});

const templatesModel = mongoose.model('templates', templatesSchema);
module.exports = templatesModel;
