// const db = require('../db.js')
// const mongoose = require('mongoose');
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

  // console.log(req.session);
  const userId = req.session.userID;
  const accessToken = req.session.accessToken;
  const emailsOnPage = 3;
  const name = req.session.name;
  const emailsToSend = []

  fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages?access_token=' + accessToken)
    .then(res => res.json())
    .then(res => {
      const messages = res.messages
      const promises = [];
        console.log(accessToken, 'accessToken111111111111111111111111111111111111111111111')
        console.log(res, 'res2222222222222222222222222222222222222222222222222222')
        console.log(req.session, 'req.session3333333333333333333333333')


      for(let i = 0; i < emailsOnPage; i++) {
        const id = messages[i].id;
          promises.push(fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages/' + id + '?access_token=' + accessToken)
            .then(res=> res.json())
            .then(res => {
              // console.log(util.inspect(res, { depth: 8 }));
              const emailID = res.id;
              const snippet = res.snippet;
              const date = moment(new Date(res.internalDate * 1000)).format('MMMM Do YYYY, h:mm:ss a');
              // const date = new Date(res.internalDate * 1000);
              const subject = res.payload.headers.filter((item) => {
                return item.name == 'Subject'
              })[0].value
              const sender = res.payload.headers.filter((item) => {
                return item.name == 'From'
              })[0].value
              // const subject = res.payload.headers[20].value;
              // const sender = res.payload.headers[17].value
              const data = {emailID, sender, subject, snippet, date};
              emailsToSend.push(data)
                emailsModel.find({"userId":userId})
                    .then(res => {
                        if(res.length<1) {
                            console.log('user not found');
                            const newEmail = new emailsModel({
                                userId: userId,
                                allEmails : [
                                    {
                                        status: 'Not reviewed',
                                        emails: [{ emailId: id, isRead: false }]
                                    }
                                ]
                            });
                            newEmail.save();
                        } else {
                            console.log('user found');
                            emailsModel.find({userId:userId, "allEmails.emails.emailId": id})
                                .then(res => {
                                    if(res.length<1) {
                                        console.log('email not found');
                                        emailsModel.update({userId:userId, "allEmails.status": "Not reviewed"},{ $push: { "allEmails.$.emails": { emailId: id, isRead: false }}})
                                    } else {
                                        console.log('email found')
                                    }
                                })
                        }
                    })
                    console.log('yo');
              }))

        }

      return Promise.all(promises)
        .then(() => {
          // console.log(res);
          const packed = {
            name,
            emailsToSend
          }
          response.json(packed)
        })
    })
    .catch(console.error);
}


// console.log(util.inspect(res, { depth: 8 }));
// console.log(res)
// // console.log(res.payload.parts[0].parts, 'payload parts')
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
