const mongoose = require('mongoose');

const { Schema } = mongoose;

const foldersSchema = new Schema({
  name: String,
  icon: String,
  userId: { type: String, default: null },
}, {
  versionKey: false,
});

const foldersModel = mongoose.model('folders', foldersSchema);
module.exports = foldersModel;
