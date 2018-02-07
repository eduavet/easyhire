const mongoose = require('mongoose');
// const fetch = require('node-fetch');
// const EmailsModel = require('../models/EmailsModel.js');
const NotesModel = require('../models/NotesModel.js');

const noteHandlers = {};
module.exports = noteHandlers;

// Get one notes
noteHandlers.getNote = (req, res) => {
  req.checkParams('sender').notEmpty().withMessage('Sender is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, notes: [] });
  }
  const userId = req.session.userID;
  const { sender } = req.params;
  return NotesModel.findOne({ userId, sender })
    .then(note => res.json({ note, errors: [] }))
    .catch(() => res.json({ note: {}, errors: [{ msg: 'Something went wrong' }] }));
};
// Add new note
noteHandlers.addNote = (req, res) => {
  req.checkParams('sender').notEmpty().withMessage('Sender is required');
  req.checkBody('emailId').notEmpty().withMessage('Email id is required');
  req.checkBody('content').notEmpty().withMessage('Note content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, note: {} });
  }
  const userId = req.session.userID;
  const { content, emailId } = req.body;
  const { sender } = req.params;
  const dateCreated = Date.now();
  const newNote = new NotesModel({
    content,
    userId,
    sender,
    emailId,
    dateCreated,
    dateUpdated: dateCreated,
  });
  return newNote.save()
    .then(note => res.json({ note, errors: [] }))
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], note: {} }));
};

// Update existing note
noteHandlers.updateNote = (req, res) => {
  req.checkParams('id').notEmpty().withMessage('Note id is required');
  req.checkBody('content').notEmpty().withMessage('Note content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, note: {} });
  }
  const noteId = req.params.id;
  const userId = req.session.userID;
  return NotesModel.findOne({ _id: mongoose.Types.ObjectId(noteId), userId })
    .then((note) => {
      note.content = req.body.content;
      note.dateUpdated = Date.now();
      return note.save()
        .then(updatedNote => res.json({ note: updatedNote, errors: [] }));
    })
    .catch(() => res.json({ note: {}, errors: [{ msg: 'Something went wrong' }], noteUpdated: 0 }));
};
