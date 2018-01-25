const Router = require('express').Router;
const handlers = require('../handlers/handlers');

const router = Router();
module.exports = router;

router.post('/api/addUser', handlers.apiAddUser);
