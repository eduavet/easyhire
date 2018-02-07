const { Router } = require('express');
const noteHandlers = require('../handlers/note');

const noteRoutes = Router();

noteRoutes.get('/sender/:sender', noteHandlers.getNotes);
noteRoutes.post('/sender/:sender', noteHandlers.addNote);
noteRoutes.put('/:id/', noteHandlers.updateNote);
noteRoutes.delete('/:id/', noteHandlers.deleteNote);

module.exports = noteRoutes;
