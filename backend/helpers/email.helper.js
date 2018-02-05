const moment = require('moment');
const EmailsModel = require('../models/EmailsModel.js');
const mongoose = require('mongoose');

const emailHelpers = {};
module.exports = emailHelpers;

// Helper functions

emailHelpers.decodeHtmlEntity = str => str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

emailHelpers.extract = (res, folderId, folderName, isReadParam) => {
  const emailID = res.id;
  const sender = res.payload.headers.find(item => item.name === 'From').value;
  const subject = res.payload.headers.find(item => item.name === 'Subject').value;
  const snippet = emailHelpers.decodeHtmlEntity(res.snippet);
  const date = moment.unix(res.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
  const isRead = isReadParam;
  return {
    emailID, sender, subject, snippet, date, folderId, folderName, isRead,
  };
};

emailHelpers.groupExtract = (group) => {
  const emailID = group.emailId;
  const sender = group.sender;
  const subject = group.subject;
  const snippet = group.snippet;
  const date = group.date;
  const folderId = group.folder._id;
  const folderName = group.folder.name;
  const isRead = group.isRead;
  return {
    emailID, sender, subject, snippet, date, folderId, folderName, isRead,
  };
};

emailHelpers.buildNewEmailModel = (userId, email, folder) => {
  const emailId = email.id;
  const threadId = email.threadId;
  const sender = email.payload.headers.find(item => item.name === 'From').value;
  const subject = email.payload.headers.find(item => item.name === 'Subject').value;
  const snippet = emailHelpers.decodeHtmlEntity(email.snippet);
  const date = moment.unix(email.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
  return new EmailsModel({
    userId,
    emailId,
    threadId,
    sender,
    subject,
    snippet,
    date: date.toString(),
    folder: mongoose.Types.ObjectId(folder._id),
    isRead: false,
  })
};
