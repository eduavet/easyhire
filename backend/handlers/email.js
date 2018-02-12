const mongoose = require('mongoose');
const fetch = require('node-fetch');
const fs = require('fs');
const request = require('request');
const util = require('util');
const EmailsModel = require('../models/EmailsModel.js');
const UsersModel = require('../models/UsersModel.js');
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
  return fetch(`${fetchUrl}${userId}/messages?access_token=${accessToken}&maxResults=10000`)
    .then(account => account.json())
    .then((account) => {
      const { messages } = account;
      const promises = [];
      for (let i = 0; i < messages.length; i += 1) {
        if (!messages) break;
        const { id } = messages[i];
        let upperEmail = '';
        let upperFolder = '';
        promises.push(EmailsModel.findOne({ emailId: id })
          .populate('folder')
          .populate('status')
          .then((group) => {
            if (group) {
              if (!group.deleted) emailsToSend[i] = helper.groupExtract(group);
              return '';
            }
            return fetch(`${fetchUrl}${userId}/messages/${id}?access_token=${accessToken}`)
              .then(email => email.json())
              .then((email) => {
                upperEmail = email;
                return FoldersModel.findOne({ name: 'Uncategorized' }, '_id');
              })
              .then((folder) => {
                upperFolder = folder;
                return StatusesModel.findOne({ name: 'Not Reviewed' }, '_id');
              })
              .then((status) => {
                if (!upperEmail.payload.headers.find(item => item.name === 'To').value.includes(req.session.email)) {
                  return null;
                }
                // const isRecieved = upperEmail.payload.headers
                //   .find((item) => {
                //     const itemValue = item.name === 'To' ? item.value : '';
                //     return itemValue !== req.session.email;
                //   });
                // if (!isRecieved) {
                //   return null;
                // }
                const newEmail = helper.buildNewEmailModel(
                  userId,
                  upperEmail,
                  upperFolder,
                  status
                );
                return newEmail.save();
              })
              .then(() => EmailsModel.findOne({ emailId: upperEmail.id })
                .populate('folder status').then((group1) => {
                  emailsToSend[i] = group1 ? helper.groupExtract(group1) : null;
                }));
          }));
      }

      return Promise.all(promises)
        .then(() => {
          const packed = {
            name,
            emailsToSend: emailsToSend.filter(email => email != null),
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
  EmailsModel.find({ emailId: { $in: emailsToMove } }, { folder: true, _id: false })
    .then((result) => {
      result.forEach(r => originalFolder.push(r.folder));
    })
    .then(() => EmailsModel.updateMany(
      { emailId: { $in: emailsToMove } },
      { $set: { folder: mongoose.Types.ObjectId(folderToMove) } }
    ))
    .then(() => EmailsModel.find({ emailId: { $in: emailsToMove } })
      .populate('folder').then(result => res.json({
        errors: [], emailsToMove: result, originalFolder,
      })))
    .catch(err => res.json({
      errors: err, emailsToMove: [], originalFolder: [],
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
    .then(() => EmailsModel.updateMany(
      { emailId: { $in: emailsToDelete } },
      { $set: { deleted: true } }
    ))
    .then(() => res.json({ emailsToDelete, originalFolder, errors: [] }))
    .catch(err => res.json({ errors: err, emailsToDelete: [], originalFolder: [] }));
};

// Get specified email data from database
emailHandlers.getEmailFromDb = (req, res) => {
  req.checkParams('id').notEmpty().withMessage('Email id is required');
  const userId = req.session.userID;
  const emailId = req.params.id;
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors });
  }
  return EmailsModel.findOne({ emailId, userId })
    .then((email) => {
      email.isRead = true;
      return email.save()
        .then((response) => {
          res.json({ email: response, errors: [] });
        });
    })
    .catch((err) => {
      res.json({ errors: [{ msg: 'Something went wrong', err }] });
    });
};
// Get specified email data from gmail such as email body
emailHandlers.getEmailFromGapi = (req, res) => {
  req.checkParams('id').notEmpty().withMessage('Email id is required');
  const userId = req.session.userID;
  const emailId = req.params.id;
  const { accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const errors = req.validationErrors();
  const emailToSend = {};
  if (errors) {
    return res.json({ errors });
  }
  return fetch(`${fetchUrl}${userId}/messages/${emailId}?access_token=${accessToken}`)
    .then(response => response.json())
    .then((response) => {
      const emailParts = {};
      const htmlBody = { value: '' };
      const isPlainText = { value: false };
      emailParts.findHtml = response.payload;
      if (emailParts.findHtml.mimeType !== 'text/html' && response.payload.parts) {
        emailParts.findHtml = response.payload.parts.find(item => item.mimeType === 'text/html');
        if (!emailParts.findHtml) {
          emailParts.findHtmlPartCountainer = response.payload.parts.find(item => item.mimeType === 'multipart/alternative') ? response.payload.parts.find(item => item.mimeType === 'multipart/alternative') : { parts: [] };
          emailParts.findHtml = emailParts.findHtmlPartCountainer.parts.find(item => item.mimeType === 'text/html');
        }
      }
      htmlBody.value = emailParts.findHtml ? emailParts.findHtml.body.data : '';
      isPlainText.value = emailParts.findHtml.mimeType === 'text/plain';
      emailToSend.htmlBody = Buffer.from(htmlBody.value, 'base64').toString();
      res.json({ email: emailToSend, errors: [], isPlainText });
    })
    .catch((err) => {
      res.json({ errors: [{ msg: 'Something went wrong', err, isPlainText: { value: false } }] });
    });
};

// Change Email Status
emailHandlers.changeEmailStatus = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  req.checkParams('statusId').notEmpty().withMessage('Status id is required');
  const userId = req.session.userID;
  const { emailId, statusId } = req.params;
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, status: '' });
  }
  return EmailsModel.findOne({ emailId, userId })
    .then((email) => {
      email.status = mongoose.Types.ObjectId(statusId);
      email.save()
        .then(() => res.json({ errors: [], status: statusId }));
    })
    .catch((err) => {
      res.json({ errors: [{ msg: 'Something went wrong', err }], status: '' });
    });
};

// Search query to google API
emailHandlers.search = (req, res) => {
  const { text, folderId } = req.body;
  const userId = req.session.userID;
  const { accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const promises = [];
  let emailsToSend = [];
  req.checkBody('text').notEmpty().withMessage('Search field is required');
  const errors = req.validationErrors();
  // If search field is empty
  if (errors) {
    if (folderId === 'allEmails') {
      return emailHandlers.emails(req, res);
    }
    return EmailsModel.find({ userId, folder: folderId, deleted: false })
      .then((messages) => {
        if (!messages) return res.json({ emailsToSend });
        for (let i = 0; i < messages.length; i += 1) {
          emailsToSend[i] = helper.groupExtract(messages[i]);
        }
        return res.json({ emailsToSend });
      });
  }
  // If search field is NOT empty
  return fetch(`${fetchUrl}${userId}/messages?access_token=${accessToken}&q=${text}`)
    .then(result => result.json())
    .then((result) => {
      const { messages } = result;
      if (!messages) return res.json({ emailsToSend });
      for (let i = 0; i < messages.length; i += 1) {
        const { id } = messages[i];
        promises.push(EmailsModel.findOne({ emailId: id, deleted: false })
          .populate('folder')
          .populate('status')
          .then((group) => {
            if (group) {
              emailsToSend[i] = helper.groupExtract(group);
            }
          }));
      }

      return Promise.all(promises)
        .then(() => {
          if (folderId !== 'allEmails') {
            emailsToSend = emailsToSend.filter(email => String(email.folderId) === folderId);
          }
          const packed = {
            emailsToSend: emailsToSend.filter(email => email != null),
          };
          res.json(packed);
        });
    })
    .catch();
};

// Get email attachment data from gmail such as attachment body
emailHandlers.getAttachmentFromGapi = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  const userId = req.session.userID;
  const { emailId } = req.params;
  const { attachment } = req.body;
  const { accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const errors = req.validationErrors();
  const attach = {};
  const body = { value: '' };
  const splitted = attachment.attachmentName.split('.');
  const extension = splitted[splitted.length - 1];
  const filename = `${attachment.attachmentId.slice(0, 20)}.${extension}`;
  const fullpath = `http://localhost:3000/${userId}/${emailId}/${filename}`;
  if (errors) {
    return res.json({ errors });
  }
  return fetch(`${fetchUrl}${userId}/messages/${emailId}/attachments/${attachment.attachmentId}?access_token=${accessToken}`)
    .then(response => response.json())
    .then((response) => {
      body.value = response.data ? response.data : '';
      attach.body = Buffer.from(body.value, 'base64');
      if (!fs.existsSync('attachments')) {
        fs.mkdirSync('attachments');
      }
      if (!fs.existsSync(`attachments/${userId}`)) {
        fs.mkdirSync(`attachments/${userId}`);
      }
      if (!fs.existsSync(`attachments/${userId}/${emailId}`)) {
        fs.mkdirSync(`attachments/${userId}/${emailId}`);
      }
      if (!fs.existsSync(`attachments/${userId}/${emailId}/${filename}`)) {
        fs.writeFileSync(`attachments/${userId}/${emailId}/${filename}`, attach.body);
      }
      request(fullpath).pipe(res);
    })
    .catch((err) => {
      res.json({ errors: [{ msg: 'Something went wrong', err }] });
    });
};

// Reply
emailHandlers.reply = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id id is required');
  req.checkBody('content').notEmpty().withMessage('Content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, status: '' });
  }
  const userId = req.session.userID;
  const accessToken = req.session.accessToken;
  const emailId = req.params.emailId;
  const content = req.body.content;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const uri = `${fetchUrl}${userId}/messages/send`;
  const sender = { name: '', email: '' };
  UsersModel.findOne({ googleID: userId }, { email: true, name: true, _id: false })
    .then((user) => {
      sender.name = user.name;
      sender.email = user.email;
      EmailsModel.findOne({ emailId })
        .then(email => fetch(`${fetchUrl}${userId}/messages/${emailId}?access_token=${accessToken}&format=metadata&metadataHeaders=In-Reply-To&metadataHeaders=References&metadataHeaders=Message-ID&metadataHeaders=Subject&fields=payload%2Fheaders`)
          .then(metadataResponse => metadataResponse.json())
          .then((metadataResponse) => {
            const findMessageIdContainer = metadataResponse.payload.headers.find(header => header.name === 'Message-Id');
            const messageIdContainer = findMessageIdContainer || metadataResponse.payload.headers.find(header => header.name === 'Message-ID');
            const messageId = messageIdContainer.value;
            const inReplyTo = metadataResponse.payload.headers.find(header => header.name === 'In-Reply-To') ? metadataResponse.payload.headers.find(header => header.name === 'In-Reply-To').value : messageId;
            const subject = metadataResponse.payload.headers.find(header => header.name === 'Subject').value;
            const id = email.emailId;
            const to = email.sender;
            const threadId = email.threadId;
            const emailLines = [];
            const contentType = 'text/html';
            emailLines.push(`From: ${sender.name} ${sender.email}`);
            emailLines.push(`To: ${to}`);
            emailLines.push(`In-Reply-To: ${inReplyTo}`);
            emailLines.push(`Content-type: ${contentType};charset=iso-8859-1`);
            emailLines.push(`Subject: ${subject}`);
            emailLines.push('');
            emailLines.push(content);
            const emailLinesJoined = emailLines.join('\r\n').trim();
            const base64EncodedEmail = Buffer.from(emailLinesJoined).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
            return fetch(`${uri}?access_token=${accessToken}`, {
              method: 'POST',
              body: JSON.stringify({
                raw: base64EncodedEmail, id, threadId,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((response) => {
                res.json({ ok: response.ok, status: response.status, errors: [] });
              });
          }));
    })
    .catch(() => res.json({ ok: false, errors: [{ msg: "Couldn't send email.Please try again" }] }));
};
emailHandlers.sendNewEmail = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  const userId = req.session.userID;
  const { accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const { emailId } = req.params;
  const sender = {};
  const { subject, messageBody } = req.body;
  const errors = req.validationErrors();
  const recipient = {};
  const emailLines = [];
  const encodedEmail = {};
  if (errors) {
    return res.json({ errors });
  }
  return UsersModel.findOne({ googleID: userId }, { email: true, name: true, _id: false })
    .then((user) => { sender.address = user.email; sender.name = user.name; })
    .then(() => EmailsModel.findOne({ emailId }, { sender: true, _id: false })
      .then((result) => { recipient.address = result.sender; })
      .then(() => {
        emailLines.push(`From: ${sender.name} ${sender.address}`);
        emailLines.push(`To: ${recipient.address}`);
        emailLines.push('Content-type: text/html;charset=iso-8859-1');
        emailLines.push('MIME-Version: 1.0');
        emailLines.push(`Subject: ${subject}`);
        emailLines.push('');
        emailLines.push(`${messageBody}`);
        const email = emailLines.join('\r\n').trim();
        encodedEmail.body = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
      })
      .then(() => fetch(`${fetchUrl}${userId}/messages/send?access_token=${accessToken}`, {
        method: 'POST',
        body: JSON.stringify({ raw: encodedEmail.body, id: '1616f8cdd817db87', threadId: '1616f8cdd817db87' }),
        headers: {
          'Content-Type': 'application/json',
        },
      }))
      .then(resp => res.json({ status: resp.status, errors: [] })))
    .catch(err => res.json({ status: null, errors: ['Message is not sent', err] }));
};
// console.log(util.inspect(res, { depth: 8 }));
emailHandlers.getSignature = (req, res) => {
  const userId = req.session.userID;
  const { accessToken } = req.session;
  const sender = {};
  return UsersModel.findOne({ googleID: userId }, { email: true, name: true, _id: false })
    .then((user) => { sender.address = user.email; sender.name = user.name; })
    .then(() => fetch(`https://www.googleapis.com/gmail/v1/users/${userId}/settings/sendAs/${sender.address}?access_token=${accessToken}`))
    .then(result => result.json())
    .then(result => res.json({ result, errors: [] }))
    .catch(err => res.json({ errors: [err] }));
}
