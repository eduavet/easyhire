const moment = require('moment');
const EmailsModel = require('../models/EmailsModel.js');
const SentEmailsModel = require('../models/SentEmailsModel.js');
const mongoose = require('mongoose');
const Entities = require('html-entities').XmlEntities;

const entities = new Entities();
const emailHelpers = {};
module.exports = emailHelpers;

// Helper functions

emailHelpers.extract = (res, folderId, folderName, isReadParam, statusId = '', statusName = '') => {
  const emailId = res.id;
  const sender = res.payload.headers.find(item => item.name === 'From').value;
  const subject = res.payload.headers.find(item => item.name === 'Subject').value;
  const snippet = entities.decode(res.snippet);
  const date = moment.unix(res.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
  const isRead = isReadParam;
  return {
    emailId, sender, subject, snippet, date, folderId, folderName, statusId, statusName, isRead,
  };
};

emailHelpers.groupExtract = (group) => {
  const {
    emailId, sender, subject, date, isRead, attachments, threadId,
  } = group;
  const receiver = group.receiver ? group.receiver : '';
  const folderId = group.folder._id;
  const folderName = group.folder.name;
  const statusId = group.status ? group.status._id : null;
  const statusName = group.status ? group.status.name : '';
  const snippet = entities.decode(group.snippet);
  return {
    emailId,
    threadId,
    sender,
    receiver,
    subject,
    snippet,
    date,
    folderId,
    folderName,
    statusId,
    statusName,
    isRead,
    attachments,
  };
};

emailHelpers.buildNewEmailModel = (userId, email, folder, status) => {
  const attachments = [];
  if (email.payload.parts) {
    email.payload.parts.forEach((item) => {
      if ('attachmentId' in item.body) {
        attachments.push({ attachmentId: item.body.attachmentId, attachmentName: item.filename });
      }
    });
  }
  const emailId = email.id;
  const { threadId } = email;
  const sender = email.payload.headers.find(item => item.name === 'From').value;
  const subject = email.payload.headers.find(item => item.name === 'Subject') ?
    email.payload.headers.find(item => item.name === 'Subject').value : '';
  const snippet = entities.decode(email.snippet);
  const date = moment.unix(email.internalDate / 1000).format('MM/DD/YYYY, HH:mm:ss');
  return new EmailsModel({
    userId,
    emailId,
    threadId,
    sender,
    subject,
    snippet,
    date: date.toString(),
    folder: mongoose.Types.ObjectId(folder._id),
    status: mongoose.Types.ObjectId(status._id),
    isRead: false,
    attachments,
    deleted: false,
  });
};


emailHelpers.buildSentEmailModel = (userId, email, folder) => {
  const attachments = [];
  if (email.payload.parts) {
    email.payload.parts.forEach((item) => {
      if ('attachmentId' in item.body) {
        attachments.push({ attachmentId: item.body.attachmentId, attachmentName: item.filename });
      }
    });
  }
  const emailId = email.id;
  const { threadId } = email;
  const sender = email.payload.headers.find(item => item.name === 'From').value;
  const receiver = email.payload.headers.find(item => item.name === 'To').value;
  const subject = email.payload.headers.find(item => item.name === 'Subject') ?
    email.payload.headers.find(item => item.name === 'Subject').value : '';
  const snippet = entities.decode(email.snippet);
  const date = moment.unix(email.internalDate / 1000).format('MM/DD/YYYY, HH:mm:ss');
  return new SentEmailsModel({
    userId,
    emailId,
    threadId,
    sender,
    receiver,
    subject,
    snippet,
    date: date.toString(),
    folder: mongoose.Types.ObjectId(folder._id),
    isRead: true,
    attachments,
    deleted: false,
  });
};
