const path = require("path");
const mongoose = require('mongoose');
const Handlers = {};
module.exports = Handlers;

const url = 'mongodb://Holykill:vPz-2u4-nNx-Bmg@ds113738.mlab.com:13738/ems'
const db = mongoose.connect(url);
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id  : Schema.ObjectId,
    email: String,
    fname: String,
    lname: String,
    lastSync: Date
}, {
    versionKey: false
});

const usersModel = mongoose.model('users', usersSchema);

const emailsSchema = new Schema({
    id  : Schema.ObjectId,
    owner: String,
    authorName: String,
    authorEmail: String,
    subject: String,
    content: String,
    status: String,
    timestamp: Date,
    attachments: Array
}, {
    versionKey: false
});

const emailsModel = mongoose.model('emails', emailsSchema);

// Handlers.apiGetToDos = (req, res) => {
//   todoModel.find({}, (err, docs) => {
//     res.json(docs);
//   })
// }
//
// Handlers.apiAddToDo = (req, res) => {
//   req.check('newToDo').notEmpty().withMessage('New todo field is empty');
//   const errors = req.validationErrors();
//   if (!errors) {
//     const newTodo = new todoModel({
//       text: req.body.newToDo
//     });
//
//     newTodo.save()
//     .then((item) => {
//       console.log('adding');
//       res.json(item);
//     })
//     .catch(console.error)
//   } else {
//     res.end(errors[0].msg)
//   }
// }
