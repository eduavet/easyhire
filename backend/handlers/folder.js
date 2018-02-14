const EmailsModel = require('../models/EmailsModel.js');
const FoldersModel = require('../models/FoldersModel.js');
const SentEmailsModel = require('../models/SentEmailsModel.js');

const folderHandlers = {};
module.exports = folderHandlers;

// Getting folders
folderHandlers.getFolders = (req, response) => {
  const userId = req.session.userID;

  if (!userId) {
    return response.json({ folders: [], errors: [{ msg: 'user not found' }], responseMsgs: [] });
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
      errors: [{ msg: 'Something went wrong, when getting folders' }],
      responseMsgs: [],
    });
};
// Create new folder
folderHandlers.createFolder = (req, res) => {
  req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, createdFolder: {} });
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
        icon: createdFolder.icon,
        userId: createdFolder.userId,
        isActive: false,
      };
      return res.json({ createdFolder: createdFolderToSend, errors: [], responseMsgs: [{ msg: 'Folder created', type: 'success' }] });
    })
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], createdFolder: {}, responseMsgs: [] }));
};
// Update existing folder
folderHandlers.updateFolder = (req, res) => {
  req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, updatedFolder: {} });
  }
  const folderId = req.params.ID ? req.params.ID : '';
  const folderNewName = req.body.folderName;
  return FoldersModel.findByIdAndUpdate(folderId, { $set: { name: folderNewName } }, { new: true })
    .then((folder) => {
      res.json({ updatedFolder: folder, errors: [], responseMsgs: [{ msg: 'Folder successfully updated', type: 'success' }] });
    })
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], updatedFolder: {}, responseMsgs: [] }));
};
// Delete folder
// Cannot delete default folders and folders which contain emails.
// Default folder - Uncategorized
folderHandlers.deleteFolder = (req, res) => {
  FoldersModel.findOne({ userId: req.session.userID, _id: req.params.ID })
    .then((folder) => {
      if (folder) {
        return EmailsModel.find({ folder: folder.id })
          .then((emails) => {
            if (emails.length > 0) {
              res.json({
                errors: [{ msg: 'Folder contains emails and cannot be deleted' }],
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
      return res.json({ errors: [{ msg: 'Main folders "Inbox" and "Uncategorized" cannot be deleted' }], deletedFolderID: '', responseMsgs: [] });
    })
    .catch(err => res.json({ errors: [{ msg: 'Something went wrong' }, err], deletedFolderID: '', responseMsgs: [] }));
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
          errors: [{ msg: 'something went wrong when getting emails of specified folder' }, err],
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
          errors: [{ msg: 'something went wrong when getting emails of specified folder' }, err],
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
        errors: [{ msg: 'something went wrong when getting emails of specified folder' }, err],
        responseMsgs: [],
      }));
  });
};
