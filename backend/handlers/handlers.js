const util = require('util');
const fetch = require('node-fetch');
const moment = require('moment');
const emailsModel = require('../models/emailsModel.js')
const usersModel = require('../models/usersModel.js')
const Handlers = {};
module.exports = Handlers;

Handlers.apiAddUser = (req, res) => {

  //if user doesn't exist in DB, add user
  usersModel.find({googleID: req.body.googleID}, (err, docs) => {
    if(docs.length < 1){
      const newUser = new usersModel({
          googleID: req.body.googleID,
          name: req.body.name,
          image: req.body.imageURL,
          email: req.body.email,
          lastSync: ''
      })
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
      const messages = res.messages
      const folders = [];
      const promises = [];

      for(let i = 0; i < emailsOnPage; i++) {
        const id = messages[i].id;
        promises.push(fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages/' + id + '?access_token=' + accessToken)
          .then(res => res.json())
          .then(res => {
            emailsToSend[i] = extractEmailData(res);
            emailsModel.find({"userId": userId})
              .then(res => {
                if(res.length < 1) {
                  console.log('user not found');
                  const newEmail = buildNewEmailModel(userId, id);
                  newEmail.save();
                } else {
                  // console.log('user found');
                  emailsModel.find({userId:userId, "allEmails.emails.emailId": id})
                    .then(res => {
                      if(res.length < 1) {
                        console.log('email not found');
                        emailsModel.update({userId:userId, "allEmails.status": "Not reviewed"},{ $push: { "allEmails.$.emails": { emailId: id, isRead: false }}}, (err, docs) => {
                          if(err) console.error(err);
                        })
                      }
                    })
                }
              })
          }))
      }
      promises.push(emailsModel.find({"userId": userId})
        .then(res => {
          if(res.length > 0) {
            res[0].allEmails.forEach((_item) => {
              const item = _item.toJSON();
              folders.push({
                id: item._id,
                name: item.status,
                count: item.emails.length,
                icon: item.icon,
                isActive: false
              })
            });
          }
        }))

      return Promise.all(promises)
        .then(() => {
          const packed = {
            name,
            emailsToSend,
            folders
          }
          // console.log(packed);
          response.json(packed)
        })
    })
    .catch(console.error);
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

const extractEmailData = (res) => {
  const emailID = res.id;
  const sender = res.payload.headers.filter((item) => {
    return item.name == 'From'
  })[0].value
  const subject = res.payload.headers.filter((item) => {
    return item.name == 'Subject'
  })[0].value
  const snippet = decodeHtmlEntity(res.snippet);
  const date = moment.unix(res.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
  return {emailID, sender, subject, snippet, date};
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
        return res.json({ errors });
    }
    const userId = req.session.userID;
    const status = req.body.folderName;
    const icon = req.body.icon ? req.body.icon : 'fa-folder' ;
    emailsModel.update({userId:userId},{ $push: { allEmails: {emails: [], status, icon  }    }})
        .then(result => {
            if(!result.nModified){
                res.json({ errors: [ { msg: 'User not found' }]});
                res.end();
            }
            res.json();
            res.end();
        })
        .catch(err => {
            res.json({ errors: [{ msg: 'Something went wrong' }] });
        })
};

Handlers.updateFolder = (req, res) => {
  req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
  emailsModel.find({userId: req.session.userID})
    .then((doc) => {
      console.log(req.session);
      // console.log(doc);
      res.json({yo: req.session.userID})
      // , "allEmails._id": req.params.ID
      // doc.allEmail[0].icon = 123;
      // return doc.save()
    })
    // .then(r => res.json(r));
  // emailsModel.update({userId: req.session.userID, "allEmails._id": req.params.ID}, {$set: {"allEmails._status": req.body.folderName}})
  // req.params.ID

}
// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text

Handlers.emailsMoveToFolder = (req, res)=>{
    console.log(req.body)
    res.send()
}