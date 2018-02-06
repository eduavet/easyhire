const { Router } = require('express');
const noteHandlers = require('../handlers/note');

const noteRoutes = Router();

noteRoutes.get('/email/:emailId', noteHandlers.getNotes);
noteRoutes.post('/email/:emailId', noteHandlers.addNote);
noteRoutes.put('/:id/', noteHandlers.updateNote);
noteRoutes.delete('/:id/', noteHandlers.deleteNote);

module.exports = noteRoutes;
