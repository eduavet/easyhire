/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const emailsModel = require('../models/emailsModel.js');
const foldersModel = require('../models/foldersModel.js');
const helper = require('../helpers/email.helper.js');

const emailHandlers = {};
module.exports = emailHandlers;

emailHandlers.emails = (req, response) => {
  const userId = req.session.userID;
  const { name, accessToken } = req.session;
  const fetchUrl = 'https://www.googleapis.com/gmail/v1/users/';
  const emailsToSend = [];

  if (!userId) {
    return response.json({ emailsToSend, folders: [] });
  }
  return fetch(`${fetchUrl}${userId}/messages?access_token=${accessToken}`)
    .then(account => account.json())
    .then((account) => {
      const { messages } = account;
      const promises = [];
      for (let i = 0; i < messages.length; i += 1) {
        const { id } = messages[i];
        promises.push(fetch(`${fetchUrl}${userId}/messages/${id}?access_token=${accessToken}`)
          .then(email => email.json())
          .then(email => emailsModel
            .findOne({ email_id: id })
            .populate('folder')
            .then((group1) => {
              if (group1) {
                const { folder } = group1;
                emailsToSend[i] = helper.extract(email, folder._id, folder.name, group1.isRead);
              } else {
                return foldersModel.findOne({ name: 'Not Reviewed' }, '_id').then((folder) => {
                  const newEmail = helper.buildNewEmailModel(userId, id, folder);
                  return newEmail.save().then(email2 => emailsModel
                    .findOne({ email_id: email2.email_id })
                    .populate('folder').then((group2) => {
                      const fold = group2.folder;
                      emailsToSend[i] = helper.extract(email2, fold._id, fold.name, false);
                    }));
                });
              }
              return Promise.resolve();
            })));
      }
      return Promise.all(promises)
        .then(() => emailsModel.count({ user_id: userId })
          .then(inboxCount => foldersModel
            .aggregate([
              { $match: { $or: [{ user_id: null }, { user_id: userId }] } },
              {
                $lookup: {
                  from: 'emails',
                  localField: '_id',
                  foreignField: 'folder',
                  as: 'emails',
                },
              },
              {
                $unwind: {
                  path: '$emails',
                  preserveNullAndEmptyArrays: true,
                },
              },
              { $match: { $or: [{ 'emails.user_id': userId }, { emails: { $exists: false } }] } },
              {
                $group: {
                  _id: '$_id',
                  name: { $first: '$name' },
                  icon: { $first: '$icon' },
                  user_id: { $first: '$user_id' },
                  emails: { $push: '$emails' },
                  // count: {  $sum: 1}
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  icon: 1,
                  user_id: 1,
                  count: { $size: '$emails' },
                },
              },
              { $sort: { user_id: 1, name: 1 } },
            ])
            .then((folders) => {
              const packed = {
                name,
                emailsToSend,
                folders,
                inboxCount,
              };
              response.json(packed);
            })));
    })
    .catch(() => {
      response.json({
        name: '', emailsToSend: [], folders: [], inboxCount: 0, errors: [{ msg: 'Something went wrong' }],
      });
    });
};

// Moves email(s) to specified folder, one email can be only in one folder (and stays in Inbox)
emailHandlers.emailsMoveToFolder = (req, res) => {
  const emailsToMove = req.body.emailIds;
  const folderToMove = req.body.folderId;
  const originalFolder = [];
  let folderName = '';
  emailsModel.find({ email_id: { $in: emailsToMove } }, { folder: true, _id: false })
    .then((result) => {
      result.forEach(r => originalFolder.push(r.folder));
    })
    .then(() => foldersModel.findOne({ _id: mongoose.Types.ObjectId(folderToMove) }, 'name')
      .then((response) => { folderName = response.name; }))
    .then(() => {
      emailsModel.updateMany(
        { email_id: { $in: emailsToMove } },
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
  emailsModel.updateMany({ email_id: { $in: emailsToMark } }, { $set: { isRead: newValue } })
    .then(() => res.json({ emailsToMark, newValue, errors: [] }))
    .catch(err => res.json({ errors: err, emailsToMark: [], newValue: null }));
};

// Delete specified email(s) but only from db NOT from gmail
emailHandlers.deleteEmails = (req, res) => {
  const emailsToDelete = req.params.ID.split(',');
  const originalFolder = [];
  emailsModel.find({ email_id: { $in: emailsToDelete } }, { folder: true, _id: false })
    .then((result) => {
      result.forEach(r => originalFolder.push(r.folder));
    })
    .then(() => emailsModel.remove({ email_id: { $in: emailsToDelete } }))
    .then(() => res.json({ emailsToDelete, originalFolder, errors: [] }))
    .catch(err => res.json({ errors: err, emailsToDelete: [], originalFolder: [] }));
};

// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
