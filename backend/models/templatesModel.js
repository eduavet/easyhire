const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const templatesSchema = new Schema({
    user_id: {type: String, default: null},
    name: String,
    content: String,
    icon: String
}, {
    versionKey: false
});

const templatesModel = mongoose.model('templates', templatesSchema);
module.exports = templatesSchema;
