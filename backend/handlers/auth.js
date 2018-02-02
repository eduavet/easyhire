const authHandlers = {};

module.exports = authHandlers;

// Logs out and clears the session
authHandlers.logout = (req, res) => {
  ['userID', 'accessToken', 'name', 'passport'].forEach(e => delete req.session[e]);
  res.redirect(process.env.HOMEPAGE);
};
