const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  googleID: String,
  name: String,
  image: String,
  email: String,
}, {
  versionKey: false,
});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;
