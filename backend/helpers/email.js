const moment = require('moment');
const EmailsModel = require('../models/emailsModel.js');
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

emailHelpers.buildNewEmailModel = (userId, id, folder) => new EmailsModel({
  user_id: userId,
  email_id: id,
  folder: mongoose.Types.ObjectId(folder._id),
  isRead: false,
});
