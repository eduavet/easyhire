const mongoose = require('mongoose');
const fetch = require('node-fetch');
const fs = require('fs');
const request = require('request');
const EmailsModel = require('../models/EmailsModel.js');
const SentEmailsModel = require('../models/SentEmailsModel.js');
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
    return response.json({ emailsToSend, errors: [{ msg: 'Log in to see emails' }], responseMsgs: [] });
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
                  status,
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
            errors: [],
            responseMsgs: [],
          };
          response.json(packed);
        });
    })
    .catch(() => {
      response.json({
        name: '', emailsToSend: [], errors: [{ msg: 'Something went wrong' }], responseMsgs: [],
      });
    });
};

// Sync
emailHandlers.syncEmails = (req, response) => {
  const userId = req.session.userID;
  const { name, accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const emailsToSend = [];
  if (!userId) {
    return response.json({ emailsToSend, errors: [{ msg: 'Log in to see emails' }], responseMsgs: [] });
  }
  return fetch(`${fetchUrl}${userId}/messages?access_token=${accessToken}&maxResults=10000`)
    .then(account => account.json())
    .then((account) => {
      const { messages } = account;
      const promises = [];
      for (let i = 0; i < messages.length; i += 1) {
        if (!messages) {
          return response.json({
            emailsToSend,
            errors: [{
              msg: 'Log out and log in' +
            ' to see emails',
            }],
            responseMsgs: [],
          });
        }
        const { id } = messages[i];
        let upperEmail = '';
        let upperFolder = '';
        promises.push(EmailsModel.findOne({ emailId: id })
          .then((emailDb) => {
            if (emailDb) {
              return;
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
                const newEmail = helper.buildNewEmailModel(
                  userId,
                  upperEmail,
                  upperFolder,
                  status,
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
            errors: [],
            responseMsgs: [],
          };
          response.json(packed);
        });
    })
    .catch(() => {
      response.json({
        name: '', emailsToSend: [], errors: [{ msg: 'Something went wrong' }], responseMsgs: [],
      });
    });
};


// Get emails from db

emailHandlers.getEmailsFromDb = (req, res) => {
  const userId = req.session.userID;
  const emailsToSend = [];
  const promises = [];
  if (!userId) {
    return res.json({ emailsToSend, errors: [{ msg: 'Log in to see emails' }], responseMsgs: [] });
  }
  return EmailsModel.find({ userId, deleted: false })
    .populate('folder status')
    .then(result =>
      Promise.all(promises)
        .then(() => {
          res.json({ emailsToSend: result, errors: [], responseMsgs: [] });
        }))
    .catch(err => res.json({
      emailsToSend: [],
      errors: [{ msg: 'something went wrong when getting emails of specified folder' }, err],
      responseMsgs: [],
    }));
};

emailHandlers.getSentEmailsFromDb = (req, res) => {
  const userId = req.session.userID;
  const emailsToSend = [];
  const promises = [];
  if (!userId) {
    return res.json({ emailsToSend, errors: [{ msg: 'Log in to see emails' }], responseMsgs: [] });
  }
  return SentEmailsModel.find({ userId, deleted: false })
    .populate('folder status')
    .then(result =>
      Promise.all(promises)
        .then(() => {
          res.json({ emailsToSend: result, errors: [], responseMsgs: [] });
        }))
    .catch(err => res.json({
      emailsToSend: [],
      errors: [{ msg: 'something went wrong when getting emails of specified folder' }, err],
      responseMsgs: [],
    }));
};

// Get sent emails from gmail
emailHandlers.emailsSent = (req, response) => {
  const userId = req.session.userID;
  const { name, accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const emailsToSend = [];
  if (!userId) {
    return response.json({ emailsToSend, errors: [{ msg: 'Log in to continue' }], responseMsgs: [] });
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
        promises.push(SentEmailsModel.findOne({ emailId: id })
          .populate('folder')
          .then((group) => {
            if (group) {
              if (!group.deleted) emailsToSend[i] = helper.groupExtract(group);
              return '';
            }
            return fetch(`${fetchUrl}${userId}/messages/${id}?access_token=${accessToken}`)
              .then(email => email.json())
              .then((email) => {
                upperEmail = email;
                return FoldersModel.findOne({ name: 'Sent' }, '_id');
              })
              .then((folder) => {
                upperFolder = folder;
                if (!upperEmail.payload.headers.find(item => item.name === 'From').value.includes(req.session.email)) {
                  return null;
                }
                const newEmail = helper.buildSentEmailModel(
                  userId,
                  upperEmail,
                  upperFolder,
                );
                return newEmail.save();
              })
              .then(() => SentEmailsModel.findOne({ emailId: upperEmail.id })
                .populate('folder').then((group1) => {
                  emailsToSend[i] = group1 ? helper.groupExtract(group1) : null;
                }));
          }));
      }

      return Promise.all(promises)
        .then(() => {
          const packed = {
            name,
            emailsToSend: emailsToSend.filter(email => email != null),
            errors: [],
            responseMsgs: [],
          };
          response.json(packed);
        });
    })
    .catch(() => {
      response.json({
        name: '',
        emailsToSend: [],
        errors: [{ msg: 'Something went wrong' }],
        responseMsgs: [],
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
      { $set: { folder: mongoose.Types.ObjectId(folderToMove) } },
    ))
    .then(() => EmailsModel.find({ emailId: { $in: emailsToMove } })
      .populate('folder').then(result => res.json({
        errors: [], emailsToMove: result, originalFolder, responseMsgs: [{ msg: 'Emails(s) moved!', type: 'success' }],
      })))
    .catch(() => res.json({
      errors: [{ msg: 'Something went wrong' }], emailsToMove: [], originalFolder: [], responseMsgs: [],
    }));
};

// Marks emails 'read' or 'unread'
emailHandlers.mark = (req, res) => {
  const emailsToMark = req.body.emailIds;
  const newValue = req.body.isRead;
  EmailsModel.updateMany({ emailId: { $in: emailsToMark } }, { $set: { isRead: newValue } })
    .then(() => res.json({
      emailsToMark, newValue, errors: [], responseMsgs: [{ msg: 'Email(s) updated!', type: 'success' }],
    }))
    .catch(() => res.json({
      emailsToMark: [],
      newValue: null,
      errors: [{
        msg: 'Something went wrong',
      }],
      responseMsgs: [],
    }));
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
      { $set: { deleted: true } },
    ))
    .then(() => res.json({
      emailsToDelete, originalFolder, errors: [], responseMsgs: [{ msg: 'Email(s) deleted!', type: 'success' }],
    }))
    .catch(() => res.json({
      errors: [{
        msg: 'Something went wrong',
      }],
      emailsToDelete: [],
      originalFolder: [],
      responseMsgs: [],
    }));
};

// Get specified email data from database
emailHandlers.getEmailFromDb = (req, res) => {
  req.checkParams('id').notEmpty().withMessage('Email id is required');
  const userId = req.session.userID;
  const emailId = req.params.id;
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  return EmailsModel.findOne({ emailId, userId })
    .then((email) => {
      if (email) {
        email.isRead = true;
        return email.save()
          .then((response) => {
            res.json({ email: response, errors: [], responseMsgs: [] });
          });
      } else {
        return SentEmailsModel.findOne({ emailId, userId })
          .then(sentEmail => (
            sentEmail.save()
              .then((response) => {
                res.json({ email: response, errors: [], responseMsgs: [] });
              })));
      }
    })
    .catch((err) => {
      res.json({ email: [], errors: [{ msg: 'Something went wrong', err }], responseMsgs: [] });
    });
};

emailHandlers.getThreadFromDb = (req, res) => {
  req.checkParams('threadId').notEmpty().withMessage('Thread id is required');
  const userId = req.session.userID;
  const threadId = req.params.threadId;
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  return EmailsModel.update({ threadId, userId }, { $set: { isRead: true } }).then(() => (
    EmailsModel.find({ threadId, userId })
      .then(emails => SentEmailsModel.find({ threadId, userId })
        .then(sentEmails => res.json({
          emails, sentEmails, errors: [], responseMsgs: [],
        })))
      .catch((err) => {
        res.json({
          emails: [], sentEmails: [], errors: [{ msg: 'Something went wrong', err }], responseMsgs: [],
        });
      })));
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
    return res.json({ errors, responseMsgs: [] });
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
      res.json({
        email: emailToSend, errors: [], isPlainText, responseMsgs: [],
      });
    })
    .catch(() => {
      res.json({
        errors: [{
          msg: 'Something went wrong',
        }],
        isPlainText: { value: false },
        responseMsgs: [],
      });
    });
};

emailHandlers.getThreadFromGapi = (req, res) => {
  req.checkParams('threadId').notEmpty().withMessage('Thread id is required');
  const userId = req.session.userID;
  const threadId = req.params.threadId;
  const { accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const errors = req.validationErrors();
  const threadEmails = [];
  const emailsToSend = {};
  const isPlainText = {};
  const promises = [];
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  return fetch(`${fetchUrl}${userId}/threads/${threadId}?access_token=${accessToken}`)
    .then(response => response.json())
    .then(response => response.messages.map((message) => { threadEmails.push(message.id); return message; }))
    .then(() => (
      threadEmails.map(emailId => promises.push(fetch(`${fetchUrl}${userId}/messages/${emailId}?access_token=${accessToken}`)
        .then(response => response.json())
        .then((response) => {
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
          isPlainText[emailId] = { value: emailParts.findHtml.mimeType === 'text/plain' };
          emailsToSend[emailId] = { htmlBody: Buffer.from(htmlBody.value, 'base64').toString() };
        })))))
    .then(() => Promise.all(promises)
      .then(() => res.json({
        emails: emailsToSend, errors: [], isPlainText, responseMsgs: [],
      })))
    .catch(() => {
      res.json({
        emails: {},
        errors: [{
          msg: 'Something went wrong',
        }],
        isPlainText: { value: false },
        responseMsgs: [],
      });
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
    return res.json({ errors, status: '', responseMsgs: [] });
  }
  return EmailsModel.findOne({ emailId, userId })
    .then((email) => {
      email.status = mongoose.Types.ObjectId(statusId);
      email.save()
        .then(() => res.json({
          errors: [],
          status: statusId,
          emailId,
          responseMsgs: [{
            msg: 'Email status has been changed',
            type: 'success',
          }],
        }));
    })
    .catch(() => {
      res.json({
        errors: [{ msg: 'Something went wrong' }], status: '', emailId: '', responseMsgs: [],
      });
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
        if (!messages) return res.json({ emailsToSend, errors: [], responseMsgs: [] });
        for (let i = 0; i < messages.length; i += 1) {
          emailsToSend[i] = helper.groupExtract(messages[i]);
        }
        return res.json({ emailsToSend, errors: [], responseMsgs: [] });
      });
  }
  // If search field is NOT empty
  return fetch(`${fetchUrl}${userId}/messages?access_token=${accessToken}&q=${text}`)
    .then(result => result.json())
    .then((result) => {
      const { messages } = result;
      if (!messages) return res.json({ emailsToSend, errors: [], responseMsgs: [] });
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
            errors: [],
            responseMsgs: [],
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
    return res.json({ errors, responseMsgs: [] });
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
    .catch(() => {
      res.json({ errors: [{ msg: 'Something went wrong' }], responseMsgs: [] });
    });
};

// Reply
emailHandlers.reply = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id id is required');
  req.checkBody('content').notEmpty().withMessage('Content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, status: '', responseMsgs: [] });
  }
  const userId = req.session.userID;
  const { accessToken } = req.session;
  const { emailId } = req.params;
  const { content } = req.body;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const uri = `${fetchUrl}${userId}/messages/send`;
  const sender = { name: '', email: '' };
  return UsersModel.findOne({ googleID: userId }, { email: true, name: true, _id: false })
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
            const { threadId } = email;
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
                const respMsg = response.ok ? 'Email has been sent' : "Couldn't send" +
                  ' email.Please try again';
                const respType = response.ok ? 'success' : 'error';
                res.json({
                  ok: response.ok,
                  status: response.status,
                  errors: [],
                  responseMsgs: [{ msg: respMsg, type: respType }],
                });
              });
          }));
    })
    .catch(() => res.json({
      ok: false,
      status: 700,
      errors: [{
        msg: "Couldn't send" +
        ' email.Please try again',
      }],
      responseMsgs: [],
    }));
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
    return res.json({ errors, responseMsgs: [] });
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
        body: JSON.stringify({ raw: encodedEmail.body }),
        headers: {
          'Content-Type': 'application/json',
        },
      }))
      .then((resp) => {
        const respMsg = resp.ok ? 'Email has been sent' : "Couldn't send" +
          ' email.Please try again';
        const respType = resp.ok ? 'success' : 'error';
        res.json({
          ok: resp.ok,
          status: resp.status,
          errors: [],
          responseMsgs: [{ msg: respMsg, type: respType }],
        });
      }))
    .catch(() => res.json({
      ok: false,
      status: null,
      errors: [{
        msg: "Couldn't send email.Please" +
        ' try again',
      }],
      responseMsgs: [],
    }));
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
    .then(result => res.json({ result, errors: [], responseMsgs: [] }))
    .catch(() => res.json({ errors: [{ msg: "Couldn't send email.Please try again" }], responseMsgs: [] }));
};
