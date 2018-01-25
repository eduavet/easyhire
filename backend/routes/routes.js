const Router = require('express').Router;
const handlers = require('../handlers/handlers');
const gapiHandler = require('../handlers/gapi.handler');

const router = Router();
module.exports = router;

router.post('/api/addUser', handlers.apiAddUser);
router.post('/api/gapi', gapiHandler.getEmails);
