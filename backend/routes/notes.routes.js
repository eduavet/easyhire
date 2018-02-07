const { Router } = require('express');
const noteHandlers = require('../handlers/note');

const noteRoutes = Router();

noteRoutes.get('/sender/:sender', noteHandlers.getNote);
noteRoutes.post('/sender/:sender', noteHandlers.addNote);
noteRoutes.put('/:id/', noteHandlers.updateNote);

module.exports = noteRoutes;
