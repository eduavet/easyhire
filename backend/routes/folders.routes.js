const { Router } = require('express');
const folderHandlers = require('../handlers/folder');

const folderRoutes = Router();

folderRoutes.get('/:ID', folderHandlers.getEmails);
folderRoutes.post('/', folderHandlers.createFolder);
folderRoutes.put('/:ID', folderHandlers.updateFolder);
folderRoutes.delete('/:ID', folderHandlers.deleteFolder);

module.exports = folderRoutes;
