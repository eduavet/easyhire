const util = require('util');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const moment = require('moment');
const emailsModel = require('../models/emailsModel.js');
const usersModel = require('../models/usersModel.js');
const foldersModel = require('../models/foldersModel.js');
const folderHandlers = {};

module.exports = folderHandlers;
ObjectId = require('mongodb').ObjectID;

// Create new folder
folderHandlers.createFolder = (req, res) => {
    req.checkBody('folderName').notEmpty().withMessage('Folder name is required');
    const errors = req.validationErrors();
    if (errors) {
        return res.json({ errors, createdFolder: {} });
    }
    const userId = req.session.userID;
    const name = req.body.folderName;
    const icon = req.body.icon ? req.body.icon : 'fa-folder' ;
    const newFolder = new foldersModel({
        name: name,
        icon: icon,
        user_id: userId
    });
    newFolder.save()
        .then((createdFolder)=>{
            const createdFolderToSend = { _id: createdFolder._id, name: createdFolder.name, count: 0, icon: createdFolder.icon, isActive: false };
            return res.json({ createdFolder: createdFolderToSend, errors: [] });
        })
        .catch(err => {
            return res.json({ errors: [{ msg: 'Something went wrong' }],  createdFolder: {} });
        })
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
    foldersModel.findByIdAndUpdate(folderId, { $set: { name: folderNewName }}, { new: true }).then((folder) =>{
        res.json({ updatedFolder: folder, errors: []})
    })
    .catch(err => res.json({ errors: [{ msg: 'Something went wrong' }], updatedFolder: {} }))
};
// Delete folder, cannot delete default folders and folders witch contain emails. Default folders - Approved,Rejected,Interview Scheduled,Not Reviewed,
folderHandlers.deleteFolder = (req, res) => {
  foldersModel.findOne({user_id: req.session.userID, _id: req.params.ID})
    .then((folder) => {
      if(folder) {
        return emailsModel.find({folder: folder.id})
          .then((emails) => {
            if(emails.length > 0) {
              res.json({ errors: [{ msg: 'Folder contains emails and cannot be deleted' }], deletedFolderID: '' });
            } else {
              foldersModel.findOne({user_id: req.session.userID, _id: req.params.ID}).remove().exec()
              res.json({deletedFolderID: req.params.ID, errors: []})
            }
          })
      } else {
        return res.json({ errors: [{ msg: 'Main folders "Approved", "Rejected", "Interview Scheduled" and "Not Reviewed" cannot be deleted' }], deletedFolderID: '' })
      }
    })
    .catch(err => res.json({errors: err, deletedFolderID: ''}))
};
