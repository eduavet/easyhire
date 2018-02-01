const util = require('util');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const moment = require('moment');
const emailsModel = require('../models/emailsModel.js');
const usersModel = require('../models/usersModel.js');
const foldersModel = require('../models/foldersModel.js');
const emailHandlers = {};

module.exports = emailHandlers;
ObjectId = require('mongodb').ObjectID;

emailHandlers.emails = (req, response) => {

    const userId = req.session.userID;
    const accessToken = req.session.accessToken;
    const emailsOnPage = 7;
    const name = req.session.name;
    const emailsToSend = [];

     if(!userId){
        response.json({emailsToSend});
        return;
    }
    fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages?access_token=' + accessToken)
        .then(res => res.json())
        .then(res => {
            const messages = res.messages;
            const folders = [];
            const promises = [];
            for(let i = 0; i < emailsOnPage; i++) {
                const id = messages[i].id;
                promises.push(fetch('https://www.googleapis.com/gmail/v1/users/' + userId + '/messages/' + id + '?access_token=' + accessToken)
                    .then(res => res.json())
                    .then(msgRes => {
                        return emailsModel
                            .findOne({email_id: id})
                            .populate('folder')
                            .then(res => {
                                if (res) {
                                    emailsToSend[i] = extractEmailData(msgRes, res.folder._id, res.folder.name);
                                } else{
                                    return foldersModel.findOne({name: 'Not Reviewed'}, '_id').then(folder => {
                                        const newEmail= buildNewEmailModel(userId, id, folder);
                                        return newEmail.save().then((email)=>{
                                            return emailsModel
                                                .findOne({email_id: email.email_id})
                                                .populate('folder').then((res) => {
                                                    emailsToSend[i] = extractEmailData(msgRes, res.folder._id, res.folder.name);
                                                })
                                        })
                                    });
                                }
                            })
                    })
                )
            }
            return Promise.all(promises)
                .then(() => {
                    return foldersModel

                        .aggregate([
                            { $match: { $or:[ { 'user_id': null}, { 'user_id': userId }] } },
                            {
                                $lookup: {
                                    from: 'emails',
                                    localField: "_id",
                                    foreignField: "folder",
                                    as: "emails"
                                }
                            },
                            { $unwind: {
                                    "path": '$emails',
                                    "preserveNullAndEmptyArrays": true
                                }
                            },
                            { $match: { $or:[ { 'emails.user_id': userId}, { "emails": { $exists: false } }] } },
                            {
                                $group : {
                                    _id : "$_id" ,
                                    name: { "$first": "$name" },
                                    icon: { "$first": "$icon" },
                                    emails: { $push: "$emails" } ,
                                    // count: {  $sum: 1}
                                }
                            },
                            {
                                $project: {
                                        _id: 1,
                                        name: 1,
                                        icon: 1,
                                        count: { $size: "$emails" }
                                }
                            }
                        ])
                        .then((folders) => {
                            console.log(folders)
                            const packed = {
                                name,
                                emailsToSend,
                                folders
                            };
                            response.json(packed)
                        })
                })
        })
        .catch(err => {
            response.json({ name: '', emailsToSend: '', folders: [], errors: [{ msg: 'Something went wrong, try again later' }]})
        })
};

//Moves email(s) to specified folder, one email can be only in one folder (and stays in Inbox)
emailHandlers.emailsMoveToFolder = (req, res)=> {
    const userId = req.session.userID;
    const emailsToMove = req.body.emailIds;
    const folderToMove=req.body.folderId;
    const originalFolder=[];
    let folderName = '';
    emailsModel.find({email_id: {$in: emailsToMove}}, {folder: true, _id:false})
        .then(result=>{
            result.forEach(r=>originalFolder.push(r.folder));
        })
        .then(()=>foldersModel.findOne({_id: mongoose.Types.ObjectId(folderToMove)}, 'name')
            .then(response=>folderName=response.name))
        .then(()=>emailsModel.updateMany({email_id: {$in: emailsToMove}}, { $set: {folder: mongoose.Types.ObjectId(folderToMove)}}))
        .then(()=>res.json({emailsToMove: emailsToMove, errors: [], folderId :folderToMove, folderName, originalFolder}))
        .catch(err => res.json({errors: err, emailsToMove: [], folderId: '', folderName: '', originalFolder: []}))
};

//Delete specified email(s) but only from db NOT from gmail
emailHandlers.deleteEmails=(req, res)=>{
    const emailsToDelete=req.params.ID.split(',');
    const originalFolder=[];
    emailsModel.find({email_id: {$in: emailsToDelete}}, {folder: true, _id:false})
        .then(result=>{
            result.forEach(r=>originalFolder.push(r.folder))
        }).then(()=>{emailsModel.remove({email_id: {$in: emailsToDelete}})
        .then(()=>res.json({emailsToDelete: emailsToDelete, originalFolder,  errors: []}))
        .catch(err => res.json({errors: err, emailsToDelete: [], originalFolder: []}))})
};

// Necessary functions

const decodeHtmlEntity = (str) => {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};

const extractEmailData = (res, folderId, folderName) => {
    const emailID = res.id;
    const sender = res.payload.headers.filter((item) => {
        return item.name == 'From'
    })[0].value;
    const subject = res.payload.headers.filter((item) => {
        return item.name == 'Subject'
    })[0].value;
    const snippet = decodeHtmlEntity(res.snippet);
    const date = moment.unix(res.internalDate / 1000).format('DD/MM/YYYY, HH:mm:ss');
    return { emailID, sender, subject, snippet, date, folderId, folderName };
};

const buildNewEmailModel = (userId, id, folder) => {
    return new emailsModel({
        user_id: userId,
        email_id: id,
        folder: mongoose.Types.ObjectId(folder._id),
        isRead: false
    });
};


// console.log(util.inspect(res, { depth: 8 }));
// console.log(res.payload.parts, 'payload parts')
// console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
