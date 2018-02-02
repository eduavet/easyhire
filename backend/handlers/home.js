const homeHandlers = {};

module.exports = homeHandlers;

homeHandlers.username = (req, res) => {
  if (req.session.name) {
    res.json({ name: req.session.name });
  } else {
    res.json({ name: '' });
  }
};
