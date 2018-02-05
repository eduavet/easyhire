const fetch = require('node-fetch');
const EmailsModel = require('../models/EmailsModel.js');
const FoldersModel = require('../models/FoldersModel.js');
const emailHelpers = require('../helpers/email.helper.js');

const folderHandlers = {};
module.exports = folderHandlers;

// Geting folders
folderHandlers.getFolders = (req, response) => {
  const userId = req.session.userID;
  if (!userId) {
    return response.json({ folders: [] });
  }
  return EmailsModel.count({ userId })
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
          $unwind: {
            path: '$emails',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: { $or: [{ 'emails.userId': userId }, { emails: { $exists: false } }] } },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            icon: { $first: '$icon' },
            userId: { $first: '$userId' },
            emails: { $push: '$emails' },
            // count: {  $sum: 1}
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            icon: 1,
            userId: 1,
            count: { $size: '$emails' },
          },
        },
        { $sort: { userId: 1, name: 1 } },
      ])
      .then((folders) => {
        const packed = {
          folders,
          inboxCount,
        };
        response.json(packed);
      })).catch({ folders: [], inboxCount: 0, errors: [] });
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
      return res.json({ createdFolder: createdFolderToSend, errors: [] });
    })
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], createdFolder: {} }));
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
      res.json({ updatedFolder: folder, errors: [] });
    })
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], updatedFolder: {} }));
};
// Delete folder
// Cannot delete default folders and folders which contain emails.
// Default folders - Approved, Rejected, Interview Scheduled, Not Reviewed
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
              });
            } else {
              FoldersModel.findOne({ userId: req.session.userID, _id: req.params.ID })
                .remove().exec();
              res.json({ deletedFolderID: req.params.ID, errors: [] });
            }
          });
      }
      return res.json({ errors: [{ msg: 'Main folders "Approved", "Rejected", "Interview Scheduled" and "Not Reviewed" cannot be deleted' }], deletedFolderID: '' });
    })
    .catch(err => res.json({ errors: err, deletedFolderID: '' }));
};
// Get folder emails
folderHandlers.getEmails = (req, res) => {
  req.checkParams('ID').notEmpty().withMessage('Folder ID is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors });
  }
  const userId = req.session.userID;
  const folderId = req.params.ID;
  const promises = [];
  if (folderId === 'allEmails') {
    return EmailsModel.find({ userId })
      .populate('folder status')
      .then(result =>
        Promise.all(promises)
          .then(() => {
            res.json({ emailsToSend: result, errors: [] });
          }))
      .catch(err => res.json({ emailsToSend: [], errors: err }));
  }
  return EmailsModel.find({ folder: folderId, userId })
    .populate('folder status')
    .then((result) => {
      // for (let i = 0; i < result.length; i += 1) {
      //   const id = result[i].emailId;
      //   promises.push(fetch(`https://www.googleapis.com/gmail/v1/users/${userId}/messages/${id}?access_token=${accessToken}`)
      //     .then(response => response.json())
      //     .then((msgRes) => {
      //       emailsToSend[i] = emailHelpers.extract(
      //         msgRes,
      //         folderId,
      //         result[i].folder.name,
      //         result[i].isRead,
      //       );
      //     }));
      // }
      return Promise.all(promises)
        .then(() => {
          res.json({ emailsToSend: result, errors: [] });
        });
    })
    .catch(err => res.json({ emailsToSend: [], errors: err }));

};
