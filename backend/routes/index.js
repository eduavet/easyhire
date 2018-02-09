const homeRoutes = require('./home.routes');
const authRoutes = require('./auth.routes');
const emailRoutes = require('./emails.routes');
const folderRoutes = require('./folders.routes');
const statusRoutes = require('./statuses.routes');
const notesRoutes = require('./notes.routes');
const templateRoutes = require('./template.routes');

module.exports = function initializeRoutes(app) {
  app.use('/api/', homeRoutes);
  app.use('/auth/', authRoutes);
  app.use('/api/emails/', emailRoutes);
  app.use('/api/folders/', folderRoutes);
  app.use('/api/statuses/', statusRoutes);
  app.use('/api/notes/', notesRoutes);
  app.use('/api/templates/', templateRoutes);
};
