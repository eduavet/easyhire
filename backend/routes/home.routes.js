const { Router } = require('express');
const homeHandlers = require('../handlers/home');

const homeRoutes = Router();

homeRoutes.get('/username', homeHandlers.username);

module.exports = homeRoutes;
