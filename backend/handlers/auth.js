const authHandlers = {};

module.exports = authHandlers;

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
  res.redirect(process.env.HOMEPAGE);
};
