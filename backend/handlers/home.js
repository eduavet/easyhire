const homeHandlers = {};

module.exports = homeHandlers;

// Returns the username of logged in user
homeHandlers.username = (req, res) => {
  if (req.session.name) {
    res.json({ name: req.session.name });
  } else {
    res.json({ name: '' });
  }
};
