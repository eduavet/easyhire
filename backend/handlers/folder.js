const EmailsModel = require('../models/EmailsModel.js');
const FoldersModel = require('../models/FoldersModel.js');
const SentEmailsModel = require('../models/SentEmailsModel.js');

const folderHandlers = {};
module.exports = folderHandlers;

// Getting folders
folderHandlers.getFolders = (req, response) => {
  const userId = req.session.userID;

  if (!userId) {
    return response.json({ folders: [], errors: [{ msg: 'ErrorCode: 2.0 | user not found' }], responseMsgs: [] });
  }
  return EmailsModel.count({ userId, deleted: false })
    .then(inboxCount => FoldersModel
      .aggregate([
        { $match: { $or: [{ userId: null }, { userId }] } },
        {
          $lookup: {
            from: 'emails',
            localField: '_id',
            foreignField: 'folder',
            as: 'emails',
          },
        },
        {
          $lookup: {
            from: 'sentemails',
            localField: '_id',
            foreignField: 'folder',
            as: 'sentEmails',
          },
        },
        {
          $addFields: {
            count: {
              $size: {
                $filter: {
                  input: '$emails',
                  as: 'email',
                  cond: {
                    $and: [
                      { $eq: ['$$email.deleted', false] },
                      { $eq: ['$$email.userId', userId] },
                    ],
                  },
                },
              },
            },
            sentCount: {
              $size: {
                $filter: {
                  input: '$sentEmails',
                  as: 'sentEmail',
                  cond: { $eq: ['$$sentEmail.userId', userId] },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            name: 1,
            icon: 1,
            count: 1,
            sentCount: 1,
          },
        },
        { $sort: { userId: 1, name: 1 } },
      ])
      .then((folders) => {
        response.json({
          folders, inboxCount, errors: [], responseMsgs: [],
        });
      })).catch({
      folders: [],
      inboxCount: 0,
      errors: [{ msg: 'ErrorCode: 2.1 | Something went wrong, when getting folders' }],
      responseMsgs: [],
    });
};
// Create new folder
folderHandlers.createFolder = (req, res) => {
  req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, createdFolder: {}, responseMsgs: [] });
  }
  const userId = req.session.userID;
  const name = req.body.folderName;
  const icon = req.body.icon ? req.body.icon : 'fa-folder';
  const newFolder = new FoldersModel({
    name,
    icon,
    userId,
  });
  return newFolder.save()
    .then((createdFolder) => {
      const createdFolderToSend = {
        _id: createdFolder._id,
        name: createdFolder.name,
        count: 0,
        sentCount: 0,
        icon: createdFolder.icon,
        userId: createdFolder.userId,
        isActive: false,
      };
      return res.json({ createdFolder: createdFolderToSend, errors: [], responseMsgs: [{ msg: 'Folder created', type: 'success' }] });
    })
    .catch(() => res.json({ errors: [{ msg: 'ErrorCode: 2.2 | Something went wrong' }], createdFolder: {}, responseMsgs: [] }));
};
// Update existing folder
folderHandlers.updateFolder = (req, res) => {
  req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, updatedFolder: {}, responseMsgs: [] });
  }
  const folderId = req.params.ID ? req.params.ID : '';
  const folderNewName = req.body.folderName;
  return FoldersModel.findByIdAndUpdate(folderId, { $set: { name: folderNewName } }, { new: true })
    .then((folder) => {
      res.json({ updatedFolder: folder, errors: [], responseMsgs: [{ msg: 'Folder successfully updated', type: 'success' }] });
    })
    .catch(() => res.json({ errors: [{ msg: 'ErrorCode: 2.3 | Something went wrong' }], updatedFolder: {}, responseMsgs: [] }));
};
// Delete folder
// Cannot delete default folders and folders which contain emails.
// Default folder - Uncategorized
folderHandlers.deleteFolder = (req, res) => {
  FoldersModel.findOne({ userId: req.session.userID, _id: req.params.ID })
    .then((folder) => {
      if (folder) {
        return EmailsModel.find({ folder: folder.id, deleted: false })
          .then((emails) => {
            if (emails.length > 0) {
              res.json({
                errors: [{ msg: 'ErrorCode: 2.4 | Folder contains emails and cannot be deleted' }],
                deletedFolderID: '',
                responseMsgs: [],
              });
            } else {
              FoldersModel.findOne({ userId: req.session.userID, _id: req.params.ID })
                .remove().exec();
              res.json({ deletedFolderID: req.params.ID, errors: [], responseMsgs: [{ msg: 'Folder successfully deleted', type: 'success' }] });
            }
          });
      }
      return res.json({ errors: [{ msg: 'ErrorCode: 2.5 | Main folders "Inbox" and "Uncategorized" cannot be deleted' }], deletedFolderID: '', responseMsgs: [] });
    })
    .catch(err => res.json({ errors: [{ msg: 'ErrorCode: 2.6 | Something went wrong' }, err], deletedFolderID: '', responseMsgs: [] }));
};
// Get folder emails
folderHandlers.getEmails = (req, res) => {
  req.checkParams('ID').notEmpty().withMessage('Folder ID is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  const userId = req.session.userID;
  const folderId = req.params.ID;
  let sentId = '';
  const promises = [];
  return FoldersModel.findOne({ name: 'Sent' }, '_id').then((folder) => {
    sentId = folder._id;
    if (folderId === sentId.toString()) {
      return SentEmailsModel.find({ folder: folderId, userId, deleted: false })
        .populate('folder status')
        .then(result => Promise.all(promises)
          .then(() => {
            res.json({ emailsToSend: result, errors: [], responseMsgs: [] });
          }))
        .catch(err => res.json({
          emailsToSend: [],
          errors: [{
            msg: 'ErrorCode: 2.7 | something went wrong when getting emails of' +
            ' specified folder',
          }, err],
          responseMsgs: [],
        }));
    }
    if (folderId === 'allEmails') {
      return EmailsModel.find({ userId, deleted: false })
        .populate('folder status')
        .then(result =>
          Promise.all(promises)
            .then(() => {
              res.json({ emailsToSend: result, errors: [], responseMsgs: [] });
            }))
        .catch(err => res.json({
          emailsToSend: [],
          errors: [{
            msg: 'ErrorCode: 2.8 | something went wrong when getting emails of' +
            ' specified folder',
          }, err],
          responseMsgs: [],
        }));
    }
    return EmailsModel.find({ folder: folderId, userId, deleted: false })
      .populate('folder status')
      .then(result =>
        Promise.all(promises)
          .then(() => {
            res.json({ emailsToSend: result, errors: [], responseMsgs: [] });
          }))
      .catch(err => res.json({
        emailsToSend: [],
        errors: [{
          msg: 'ErrorCode: 2.9 | something went wrong when getting emails of specified' +
          ' folder',
        }, err],
        responseMsgs: [],
      }));
  });
};
