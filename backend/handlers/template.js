const mongoose = require('mongoose');
const util = require('util');
const TemplatesModel = require('../models/TemplatesModel.js');

const templateHandlers = {};
module.exports = templateHandlers;

templateHandlers.getTemplate = (req, res) => {
  req.checkParams('templateId').notEmpty().withMessage('Template id is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors });
  }
  return TemplatesModel.findOne({ _id: req.params.templateId })
    .then(template => res.json({ template, errors: [] }))
    .catch(err => res.json({ template: {}, errors: ['Something went wrong', err] }));
};
