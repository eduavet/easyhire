const { Router } = require('express');
const templateHandlers = require('../handlers/template');

const templateRoutes = Router();

templateRoutes.get('/:templateId', templateHandlers.getTemplate);


module.exports = templateRoutes;
