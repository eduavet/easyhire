const homeRoutes = require('./home.routes');
const authRoutes = require('./auth.routes');
const emailRoutes = require('./emails.routes');
const folderRoutes = require('./folders.routes');
const statusRoutes = require('./statuses.routes');
const notesRoutes = require('./notes.routes');

module.exports = function initializeRoutes(app) {
  app.use('/api/', homeRoutes);
  app.use('/auth/', authRoutes);
  app.use('/api/emails/', emailRoutes);
  app.use('/api/folders/', folderRoutes);
  app.use('/api/statuses/', statusRoutes);
  app.use('/api/notes/', notesRoutes);
};
