const { Router } = require('express');
const statusHandlers = require('../handlers/status');

const statusRoutes = Router();

statusRoutes.get('/', statusHandlers.getStatuses);
statusRoutes.get('/:ID', statusHandlers.getEmails);
// statusRoutes.post('/', statusHandlers.createFolder);
// statusRoutes.put('/:ID', statusHandlers.updateFolder);
// statusRoutes.delete('/:ID', statusHandlers.deleteFolder);

module.exports = statusRoutes;
