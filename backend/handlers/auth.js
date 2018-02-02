const authHandlers = {};

module.exports = authHandlers;
// ObjectId = require('mongodb').ObjectID;

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
