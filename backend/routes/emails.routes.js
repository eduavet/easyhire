const { Router } = require('express');
const emailHandlers = require('../handlers/email');

const emailRoutes = Router();

emailRoutes.get('/', emailHandlers.getEmailsFromDb);
emailRoutes.get('/refresh', emailHandlers.emails);
emailRoutes.get('/sent', emailHandlers.emailsSent);
emailRoutes.delete('/:ID', emailHandlers.deleteEmails);
emailRoutes.post('/move', emailHandlers.emailsMoveToFolder);
emailRoutes.post('/mark', emailHandlers.mark);
emailRoutes.get('/signature', emailHandlers.getSignature);
emailRoutes.get('/:threadId', emailHandlers.getThreadFromDb);
emailRoutes.get('/email/:id', emailHandlers.getEmailFromDb);
//emailRoutes.get('/:id/gapi/', emailHandlers.getEmailFromGapi);
emailRoutes.get('/:threadId/gapi/', emailHandlers.getThreadFromGapi);
emailRoutes.get('/:emailId/status/:statusId', emailHandlers.changeEmailStatus);
emailRoutes.post('/:emailId/attachment/gapi', emailHandlers.getAttachmentFromGapi);
emailRoutes.post('/search', emailHandlers.search);
emailRoutes.post('/reply/:emailId', emailHandlers.reply);
emailRoutes.post('/:emailId/sendNew', emailHandlers.sendNewEmail);

module.exports = emailRoutes;
