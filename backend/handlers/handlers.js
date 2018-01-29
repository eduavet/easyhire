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

Handlers.getEmails = (req, response) => {

  const userId = req.session.userID;
  const accessToken = req.session.accessToken;
  const emailsOnPage = 5;
  const name = req.session.name;
  const emailsToSend = []

  fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages?access_token=' + accessToken)
    .then(res => res.json())
    .then(res => {
      const messages = res.messages
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
                  const newEmail = buildNewEmailModel(userId, id);
                  newEmail.save();
                } else {
                  emailsModel.find({userId:userId, "allEmails.emails.emailId": id})
                    .then(res => {
                      if(res.length < 1) {
                        emailsModel.update({userId:userId, "allEmails.status": "Not reviewed"},{ $push: { "allEmails.$.emails": { emailId: id, isRead: false }}})
                      }
                    })
                }
              })
          }))
      }

      return Promise.all(promises)
        .then(() => {
          const packed = {
            name,
            emailsToSend
          }
          response.json(packed)
        })
    })
    .catch(console.error);
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
  const date = moment.unix(res.internalDate / 1000).format('MMMM Do YYYY, h:mm:ss a');
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

// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
