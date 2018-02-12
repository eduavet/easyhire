const { Router } = require('express');
const templateHandlers = require('../handlers/template');

const templateRoutes = Router();

templateRoutes.get('/', templateHandlers.getTemplates);
templateRoutes.get('/:templateId', templateHandlers.getTemplate);
templateRoutes.post('/:templateId', templateHandlers.addTemplate);
templateRoutes.put('/:templateId', templateHandlers.updateTemplate);
templateRoutes.delete('/:templateId', templateHandlers.deleteTemplate);


module.exports = templateRoutes;
