// const fetch = require('node-fetch');
// const EmailsModel = require('../models/EmailsModel.js');
const NotesModel = require('../models/NotesModel.js');

const noteHandlers = {};
module.exports = noteHandlers;


// Add new note
noteHandlers.addNote = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  req.checkBody('content').notEmpty().withMessage('Note content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, note: {} });
  }
  const userId = req.session.userID;
  const content = req.body.content;
  const emailId = req.params.emailId;
  const dateCreated = Date.now();
  const newNote = new NotesModel({
    content,
    userId,
    emailId,
    dateCreated,
    dateUpdated: dateCreated,
  });
  return newNote.save()
    .then(note => res.json({ note, errors: [] }))
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], note: {} }));
};


// Get all notes
noteHandlers.getNotes = (req, res) => {
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, notes: [] });
  }
  res.json({ notes: [], errors: [] });
};
// Update existing note
noteHandlers.updateNote = (req, res) => {
  req.checkParams('noteId').notEmpty().withMessage('Note id is required');
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  req.checkBody('content').notEmpty().withMessage('Note content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, note: {} });
  }
  res.json({ note: {}, errors: [] });
};
// Delete note
noteHandlers.deleteNote = (req, res) => {
  req.checkParams('noteId').notEmpty().withMessage('Note id is required');
  req.checkParams('emailId').notEmpty().withMessage('Email id is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, note: {} });
  }
  res.json({ note: {}, errors: [] });
};

