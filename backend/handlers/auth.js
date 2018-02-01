const util = require('util');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const moment = require('moment');
const emailsModel = require('../models/emailsModel.js');
const usersModel = require('../models/usersModel.js');
const foldersModel = require('../models/foldersModel.js');
const authHandlers = {};

module.exports = authHandlers;
ObjectId = require('mongodb').ObjectID;

authHandlers.apiAddUser = (req, res) => {
    //if user doesn't exist in DB, add user
    usersModel.findOne({googleUser_id: req.body.googleID}, (err, user) => {
        if(user){
            const newUser = new usersModel({
                googleUser_id: req.body.googleID,
                name: req.body.name,
                image: req.body.imageURL,
                email: req.body.email,
            });
            newUser.save().then(user => {
                console.log('user added in DB');
            })
                .catch(console.error);
        }
    })
};

// returns logged in user username
authHandlers.username = (req, res) => {
    if(req.session.name) {
        res.json({name : req.session.name});
    } else {
        res.json({name : ''});
    }
};

authHandlers.logout = (req, res) => {
    ["userID", "accessToken", "name", "passport"].forEach(e => delete req.session[e]);
    res.redirect("http://localhost:8080");
};