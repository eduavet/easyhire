const homeHandlers = {};

module.exports = homeHandlers;

// Returns the username of logged in user
homeHandlers.username = (req, res) => {
  if (req.session.name) {
    res.json({ name: req.session.name, errors: [], responseMsgs: [] });
  } else {
    res.json({ name: '', errors: [{ msg: 'Log in !' }], responseMsgs: [] });
  }
};
