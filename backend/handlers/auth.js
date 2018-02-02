const UsersModel = require('../models/usersModel.js');

const authHandlers = {};

module.exports = authHandlers;
// ObjectId = require('mongodb').ObjectID;

// function not used right now
authHandlers.apiAddUser = (req, res) => {
  // if user doesn't exist in DB, add user
  UsersModel.findOne({ googleUser_id: req.body.googleID }, (err, user) => {
    if (!user) return;
    const newUser = new UsersModel({
      googleUser_id: req.body.googleID,
      name: req.body.name,
      image: req.body.imageURL,
      email: req.body.email,
    });
    newUser.save().then((savedUser) => {
      // respond something
      console.log('user added in DB', savedUser);
    })
      .catch(console.error);
  });
};

// returns logged in user username
authHandlers.username = (req, res) => {
  if (req.session.name) {
    res.json({ name: req.session.name });
  } else {
    res.json({ name: '' });
  }
};

authHandlers.logout = (req, res) => {
  ['userID', 'accessToken', 'name', 'passport'].forEach(e => delete req.session[e]);
  res.redirect('http://localhost:8080');
};
