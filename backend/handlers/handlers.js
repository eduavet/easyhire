const util = require('util');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const moment = require('moment');
const emailsModel = require('../models/emailsModel.js')
const usersModel = require('../models/usersModel.js')
const foldersModel = require('../models/foldersModel.js')
const Handlers = {};

module.exports = Handlers;

Handlers.apiAddUser = (req, res) => {

  //if user doesn't exist in DB, add user
  usersModel.find({google_id: req.body.googleID}, (err, docs) => {
    if(docs.length < 1){
      const newUser = new usersModel({
          google_id: req.body.googleID,
          name: req.body.name,
          image: req.body.imageURL,
          email: req.body.email,
      });
      newUser.save()
      .catch(console.error)
      console.log('user added in DB');
    }
  })
}

Handlers.username = (req, res) => {
  if(req.session.name) {
    res.json({name : req.session.name});
  } else {
      res.json({name : ''});
  }
}

Handlers.emails = (req, response) => {

    const userId = req.session.userID;
    const accessToken = req.session.accessToken;
    const emailsOnPage = 3;
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
                                        const newEmail = new emailsModel({
                                            user_id: userId,
                                            email_id: id,
                                            folder: mongoose.Types.ObjectId(folder._id),
                                            isRead: false
                                        });
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
                    const packed = {
                        name,
                        emailsToSend,
                        folders
                    }
                    response.json(packed)
                })
        })
        .catch(err => {
            response.json({ name: '', emailsToSend: '', folders: [], errors: [{ msg: 'Something went wrong, try again later' }]})
        })
}

Handlers.logout = (req, res) => {
  ["userID", "accessToken", "name", "passport"].forEach(e => delete req.session[e]);
  res.redirect("http://localhost:8080");
}

const decodeHtmlEntity = (str) => {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

const extractEmailData = (res, folderId, folderName) => {
  const emailID = res.id;
  const sender = res.payload.headers.filter((item) => {
    return item.name == 'From'
  })[0].value
  const subject = res.payload.headers.filter((item) => {
    return item.name == 'Subject'
  })[0].value
  const snippet = decodeHtmlEntity(res.snippet);
  const date = moment.unix(res.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
  return { emailID, sender, subject, snippet, date, folderId, folderName };
}

const buildNewEmailModel = (userId, id) => {
  return new emailsModel({
    userId: userId,
    allEmails : [
      {
        status: 'Not reviewed',
        emails: [{ emailId: id, isRead: false }]
      }
    ]
  });
}

Handlers.createFolder = (req, res) => {
    req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
    const errors = req.validationErrors();
    if (errors) {
        return res.json({ errors, createdFolder: {} });
    }
    const userId = req.session.userID;
    const status = req.body.folderName;
    const icon = req.body.icon ? req.body.icon : 'fa-folder' ;
    emailsModel.findOne({userId:userId})
        .then(result => {
            result.allEmails.push({ emails: [], status, icon });
            const createdFolder = result.allEmails[result.allEmails.length - 1];
            const createdFolderToSend = { id: createdFolder._id, name: createdFolder.status, count: 0, icon: createdFolder.icon, isActive: false }
            result.save().then(result => {
                return res.json({ createdFolder: createdFolderToSend, errors: [] });
            });
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
  emailsModel.findOne({userId: req.session.userID})
    .then((result) => {
      result.allEmails.forEach((item) => {
        if(item._id == req.params.ID) {
          item.status = req.body.folderName
        }
      })
      result.save();
      return res.json({updatedFolder: {id: req.params.ID, name: req.body.folderName}, errors: []})
    })
    .catch(err => res.json({ errors: [{ msg: 'Something went wrong' }], updatedFolder: {} }))
}

Handlers.deleteFolder = (req, res) => {
  emailsModel.findOne({userId: req.session.userID})
    .then((result) => {
      result.allEmails.forEach((item, index, object) => {
        if(item._id == req.params.ID) {
          if(item.emails.length < 1) {
            object.splice(index, 1);
          } else {
            return res.json({ errors: [{ msg: 'Folder contains emails and cannot be deleted' }], deletedFolderID: '' });
          }
        }
      })
      result.save();
      return res.json({deletedFolderID: req.params.ID, errors: []})
    })
    .catch(err => res.json({errors: err, deletedFolderID: ''}))
}

Handlers.emailsMoveToFolder = (req, res)=>{
    res.send()
}


// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
