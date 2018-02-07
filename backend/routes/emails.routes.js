const { Router } = require('express');
const emailHandlers = require('../handlers/email');

const emailRoutes = Router();

emailRoutes.get('/', emailHandlers.emails);
emailRoutes.delete('/:ID', emailHandlers.deleteEmails);
emailRoutes.post('/move', emailHandlers.emailsMoveToFolder);
emailRoutes.post('/mark', emailHandlers.mark);
emailRoutes.get('/:id', emailHandlers.getEmailFromDb);
emailRoutes.get('/:id/gapi/', emailHandlers.getEmailFromGapi);
emailRoutes.get('/:emailId/status/:statusId', emailHandlers.changeEmailStatus);
emailRoutes.post('/search', emailHandlers.search);

module.exports = emailRoutes;
