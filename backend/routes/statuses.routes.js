const { Router } = require('express');
const statusHandlers = require('../handlers/status');

const statusRoutes = Router();

statusRoutes.get('/', statusHandlers.getStatuses);
statusRoutes.get('/:statusId/:folderId', statusHandlers.getEmails);
statusRoutes.post('/', statusHandlers.createStatus);
statusRoutes.put('/:ID', statusHandlers.updateStatus);
statusRoutes.delete('/:ID', statusHandlers.deleteStatus);

module.exports = statusRoutes;
