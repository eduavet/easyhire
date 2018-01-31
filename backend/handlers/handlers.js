const util = require('util');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const moment = require('moment');
const emailsModel = require('../models/emailsModel.js');
const usersModel = require('../models/usersModel.js');
const foldersModel = require('../models/foldersModel.js');
const Handlers = {};

module.exports = Handlers;
ObjectId = require('mongodb').ObjectID;
Handlers.apiAddUser = (req, res) => {

  //if user doesn't exist in DB, add user
  usersModel.findOne({googleUser_id: req.body.googleID}, (err, user) => {
    if(user){
      const newUser = new usersModel({
          googleUser_id: req.body.googleID,
          name: req.body.name,
          image: req.body.imageURL,
          email: req.body.email,
      });
      newUser.save().then(user => {
          // foldersModel.insertMany( [
          //     { name: "Approved", icon: 'fa-check-square', user_id: user._id },
          //     { item: "Rejected", icon: "fa-times-circle", user_id: user._id  },
          //     { item: "Interview Scheduled" , icon: "fa-clock", user_id: user._id  },
          //     { item: "Not Reviewed" , icon: 'fa-question', user_id: user._id  }
          // ] );
      })
      .catch(console.error);
      console.log('user added in DB');
    }
  })
};

Handlers.username = (req, res) => {
  if(req.session.name) {
    res.json({name : req.session.name});
  } else {
      res.json({name : ''});
  }
};

Handlers.emails = (req, response) => {

    const userId = req.session.userID;
    const accessToken = req.session.accessToken;
    const emailsOnPage = 7;
    const name = req.session.name;
    const emailsToSend = [];

     if(!userId){
        response.json({emailsToSend});
        return;
    }
    fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages?access_token=' + accessToken)
        .then(res => res.json())
        .then(res => {
            const messages = res.messages;
            const folders = [];
            const promises = [];
            for(let i = 0; i < emailsOnPage; i++) {
                const id = messages[i].id;
                promises.push(fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages/' + id + '?access_token=' + accessToken)
                    .then(res => res.json())
                    .then(msgRes => {
                        return emailsModel
                            .findOne({email_id: id})
                            .populate('folder')
                            .then(res => {
                                if (res) {
                                    emailsToSend[i] = extractEmailData(msgRes, res.folder._id, res.folder.name);
                                } else{
                                    return foldersModel.findOne({name: 'Not Reviewed'}, '_id').then(folder => {
                                        const newEmail= buildNewEmailModel(userId, id, folder);
                                        return newEmail.save().then((email)=>{
                                            return emailsModel
                                                .findOne({email_id: email.email_id})
                                                .populate('folder').then((res) => {
                                                    emailsToSend[i] = extractEmailData(msgRes, res.folder._id, res.folder.name);
                                                })
                                        })
                                    });
                                }
                            })
                    })
                )
            }
            return Promise.all(promises)
                .then(() => {
                    return foldersModel

                        .aggregate([
                            { $match: { $or:[ { 'user_id':null}, { 'user_id':userId }] } },
                            {
                                $lookup: {
                                            from: 'emails',
                                            localField: "_id",
                                            foreignField: "folder",
                                            as: "emails"
                                       }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    icon: 1,
                                    count: { $size: "$emails" }
                                }
                            },
                        ])
                        .then((folders) => {
                            console.log(folders,'folders')
                            const packed = {
                                name,
                                emailsToSend,
                                folders
                            };
                            response.json(packed)
                        })
                })
        })
        .catch(err => {
            response.json({ name: '', emailsToSend: '', folders: [], errors: [{ msg: 'Something went wrong, try again later' }]})
        })
};

Handlers.logout = (req, res) => {
  ["userID", "accessToken", "name", "passport"].forEach(e => delete req.session[e]);
  res.redirect("http://localhost:8080");
};

const decodeHtmlEntity = (str) => {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

const extractEmailData = (res, folderId, folderName) => {
  const emailID = res.id;
  const sender = res.payload.headers.filter((item) => {
    return item.name == 'From'
  })[0].value;
  const subject = res.payload.headers.filter((item) => {
    return item.name == 'Subject'
  })[0].value;
  const snippet = decodeHtmlEntity(res.snippet);
  const date = moment.unix(res.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
  return { emailID, sender, subject, snippet, date, folderId, folderName };
};

const buildNewEmailModel = (userId, id, folder) => {
  return new emailsModel({
      user_id: userId,
      email_id: id,
      folder: mongoose.Types.ObjectId(folder._id),
      isRead: false
  });
};

Handlers.createFolder = (req, res) => {
    req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
    const errors = req.validationErrors();
    if (errors) {
        return res.json({ errors, createdFolder: {} });
    }
    const userId = req.session.userID;
    const name = req.body.folderName;
    const icon = req.body.icon ? req.body.icon : 'fa-folder' ;
    const newFolder = new foldersModel({
        name: name,
        icon: icon,
        user_id: userId
    });
    newFolder.save()
        .then((createdFolder)=>{
            const createdFolderToSend = { _id: createdFolder._id, name: createdFolder.name, count: 0, icon: createdFolder.icon, isActive: false }
            return res.json({ createdFolder: createdFolderToSend, errors: [] });
        })
        .catch(err => {
            return res.json({ errors: [{ msg: 'Something went wrong' }],  createdFolder: {} });
        })
};

Handlers.updateFolder = (req, res) => {
    req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
    const errors = req.validationErrors();
    if (errors) {
        return res.json({ errors, updatedFolder: {} });
    }
    const folderId = req.params.ID ? req.params.ID : '';
    const folderNewName = req.body.folderName;
    foldersModel.findByIdAndUpdate(folderId, { $set: { name: folderNewName }}, { new: true }).then((folder) =>{
        res.json({ updatedFolder: folder, errors: []})
    })
    .catch(err => res.json({ errors: [{ msg: 'Something went wrong' }], updatedFolder: {} }))
};

Handlers.deleteFolder = (req, res) => {
  foldersModel.findOne({user_id: req.session.userID, _id: req.params.ID})
    .then((folder) => {
      if(folder) {
        return emailsModel.find({folder: folder.id})
          .then((emails) => {
            if(emails.length > 0) {
              res.json({ errors: [{ msg: 'Folder contains emails and cannot be deleted' }], deletedFolderID: '' });
            } else {
              foldersModel.findOne({user_id: req.session.userID, _id: req.params.ID}).remove().exec()
              res.json({deletedFolderID: req.params.ID, errors: []})
            }
          })
      } else {
        return res.json({ errors: [{ msg: 'Main folders "Approved", "Rejected", "Interview Scheduled" and "Not Reviewed" cannot be deleted' }], deletedFolderID: '' })
      }
    })
    .catch(err => res.json({errors: err, deletedFolderID: ''}))
};

Handlers.emailsMoveToFolder = (req, res)=> {
    const userId = req.session.userID;
    const emailsToMove = req.body.emailIds;
    const folderToMove=req.body.folderId;
    emailsModel.update({email_id: {$in: emailsToMove}}, { $set: {folder: mongoose.Types.ObjectId(folderToMove)}})
        .then(res=>{

        })
};

// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
