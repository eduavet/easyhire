const mongoose = require('mongoose');

const { Schema } = mongoose;

const statusesSchema = new Schema({
  name: String,
  icon: String,
  userId: { type: String, default: null },
}, {
  versionKey: false,
});

const StatusesSchema = mongoose.model('statuses', statusesSchema);
module.exports = StatusesSchema;
