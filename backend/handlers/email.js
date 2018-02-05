const mongoose = require('mongoose');
const fetch = require('node-fetch');
const util = require('util');
const EmailsModel = require('../models/EmailsModel.js');
const FoldersModel = require('../models/FoldersModel.js');
const StatusesModel = require('../models/StatusesModel.js');

const helper = require('../helpers/email.helper.js');


const emailHandlers = {};
module.exports = emailHandlers;

emailHandlers.emails = (req, response) => {
  const userId = req.session.userID;
  const { name, accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const emailsToSend = [];
  if (!userId) {
    return response.json({ emailsToSend });
  }
  return fetch(`${fetchUrl}${userId}/messages?access_token=${accessToken}`)
    .then(account => account.json())
    .then((account) => {
      const { messages } = account;
      const promises = [];
      for (let i = 0; i < 7; i += 1) {
        if (!messages) break;
        const { id } = messages[i];
        let upperEmail = '';
        let upperFolder = '';
        promises.push(EmailsModel.findOne({ emailId: id })
          .populate('folder')
          .populate('status')
          .then((group) => {
            if (group) {
              emailsToSend[i] = helper.groupExtract(group);
              return;
            }
            return fetch(`${fetchUrl}${userId}/messages/${id}?access_token=${accessToken}`)
              .then(email => email.json())
              .then((email) => {
                upperEmail = email;
                return FoldersModel.findOne({ name: 'Not Reviewed' }, '_id');
              })
              .then((folder) => {
                upperFolder = folder;
                return StatusesModel.findOne({ name: 'Not Reviewed' }, '_id');
              })
              .then((status) => {
                const newEmail = helper.buildNewEmailModel(userId, upperEmail, upperFolder, status);
                return newEmail.save();
              })
              .then(() => EmailsModel.findOne({ emailId: upperEmail.id })
                .populate('folder status').then((group1) => {
                  emailsToSend[i] = helper.groupExtract(group1);
                }));
          }));
      }

      return Promise.all(promises)
        .then(() => {
          const packed = {
            name,
            emailsToSend,
          };
          response.json(packed);
        });
    })
    .catch((err) => {
      response.json({
        name: '', emailsToSend: [], errors: [{ msg: 'Something went wrong' }],
      });
    });
};

// Moves email(s) to specified folder, one email can be only in one folder (and stays in Inbox)
emailHandlers.emailsMoveToFolder = (req, res) => {
  const emailsToMove = req.body.emailIds;
  const folderToMove = req.body.folderId;
  const originalFolder = [];
  let folderName = '';
  EmailsModel.find({ emailId: { $in: emailsToMove } }, { folder: true, _id: false })
    .then((result) => {
      result.forEach(r => originalFolder.push(r.folder));
    })
    .then(() => FoldersModel.findOne({ _id: mongoose.Types.ObjectId(folderToMove) }, 'name')
      .then((response) => { folderName = response.name; }))
    .then(() => {
      EmailsModel.updateMany(
        { emailId: { $in: emailsToMove } },
        { $set: { folder: mongoose.Types.ObjectId(folderToMove) } },
      );
    })
    .then(() => res.json({
      emailsToMove, errors: [], folderId: folderToMove, folderName, originalFolder,
    }))
    .catch(err => res.json({
      errors: err, emailsToMove: [], folderId: '', folderName: '', originalFolder: [],
    }));
};

// Marks emails 'read' or 'unread'
emailHandlers.mark = (req, res) => {
  const emailsToMark = req.body.emailIds;
  const newValue = req.body.isRead;
  EmailsModel.updateMany({ emailId: { $in: emailsToMark } }, { $set: { isRead: newValue } })
    .then(() => res.json({ emailsToMark, newValue, errors: [] }))
    .catch(err => res.json({ errors: err, emailsToMark: [], newValue: null }));
};

// Delete specified email(s) but only from db NOT from gmail
emailHandlers.deleteEmails = (req, res) => {
  const emailsToDelete = req.params.ID.split(',');
  const originalFolder = [];
  EmailsModel.find({ emailId: { $in: emailsToDelete } }, { folder: true, _id: false })
    .then((result) => {
      result.forEach(r => originalFolder.push(r.folder));
    })
    .then(() => EmailsModel.remove({ emailId: { $in: emailsToDelete } }))
    .then(() => res.json({ emailsToDelete, originalFolder, errors: [] }))
    .catch(err => res.json({ errors: err, emailsToDelete: [], originalFolder: [] }));
};

// Get specified email data | NOT FINISHED
emailHandlers.getEmail = (req, res) => {
  req.checkParams('id').notEmpty().withMessage('Email id is required');
  const userId = req.session.userID;
  const emailId = req.params.id;
  const { accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors });
  }
  return EmailsModel.findOne({ emailId, userId })
    .populate('folder')
    .then(email => fetch(`${fetchUrl}${userId}/messages/${emailId}?access_token=${accessToken}`)
      .then(response => response.json())
      .then((response) => {
        const emailToSend = helper.extract(response, email.folder, email.folder.name, email.isRead, '', '');
        const emailParts = {};
        const htmlBody = { value: '' };
        emailParts.findHtml = response.payload;
        if (emailParts.findHtml.mimeType !== 'text/html' && response.payload.parts) {
          emailParts.findHtml = response.payload.parts.find(item => item.mimeType === 'text/html');
          if (!emailParts.findHtml) {
            emailParts.findHtmlPartCountainer = response.payload.parts.find(item => item.mimeType === 'multipart/alternative') ? response.payload.parts.find(item => item.mimeType === 'multipart/alternative') : { parts: [] };
            emailParts.findHtml = emailParts.findHtmlPartCountainer.parts.find(item => item.mimeType === 'text/html');
          }
        }
        htmlBody.value = emailParts.findHtml ? emailParts.findHtml.body.data : '';
        emailToSend.htmlBody = Buffer.from(htmlBody.value, 'base64').toString();
        res.json({ email: emailToSend, errors: [] });
      }))
    .catch((err) => {
      console.log(err, 'errr');
      res.json({ errors: [{ msg: 'Something went wrong', err }] });
    });
};
// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
