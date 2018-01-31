const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foldersSchema = new Schema({
    name: String,
    icon: String,
    user_id:{ type: String, default: null }
}, {
    versionKey: false
});

const foldersModel = mongoose.model('folders', foldersSchema);
module.exports = foldersModel;
