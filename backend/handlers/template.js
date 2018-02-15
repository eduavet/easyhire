const TemplatesModel = require('../models/TemplatesModel.js');

const templateHandlers = {};
module.exports = templateHandlers;

// Get all templates
templateHandlers.getTemplates = (req, res) => {
  const userId = req.session.userID;
  return TemplatesModel.find({ userId })
    .then(templates => res.json({ templates, errors: [], responseMsgs: [] }))
    .catch(() => res.json({ templates: [], errors: [{ msg: 'Something went wrong' }], responseMsgs: [] }));
};
// Get template
templateHandlers.getTemplate = (req, res) => {
  req.checkParams('templateId').notEmpty().withMessage('Template id is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  const templateId = req.params.templateId;
  const userId = req.session.userID;
  if (templateId === 'noTemplate') {
    return res.json({
      template: {
        _id: 'noTemplate', userId, name: '', content: ' ', icon: '',
      },
      errors: [],
      responseMsgs: [],
    });
  }
  return TemplatesModel.findOne({ _id: templateId, userId })
    .then(template => res.json({ template, errors: [], responseMsgs: [] }))
    .catch(() => res.json({ template: {}, errors: [{ msg: 'Something went wrong' }], responseMsgs: [] }));
};
// Add new template
templateHandlers.addTemplate = (req, res) => {
  req.checkBody('name').notEmpty().withMessage('Name is required');
  req.checkBody('content').notEmpty().withMessage('Content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  const userId = req.session.userID;
  const { name, content } = req.body;
  const icon = req.body.icon ? req.body.icon : 'fa-circle';
  const newTemplate = new TemplatesModel({
    userId,
    name,
    content,
    icon,
  });
  return newTemplate.save()
    .then(template => res.json({ template, errors: [], responseMsgs: [{ msg: 'Template created', type: 'success' }] }))
    .catch(() => res.json({ errors: [{ msg: 'Something went wrong' }], template: {}, responseMsgs: [] }));
};
// Update existing template
templateHandlers.updateTemplate = (req, res) => {
  req.checkParams('templateId').notEmpty().withMessage('Template id is required');
  req.checkBody('name').notEmpty().withMessage('Name is required');
  req.checkBody('content').notEmpty().withMessage('Content is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  const userId = req.session.userID;
  return TemplatesModel.findOne({ _id: req.params.templateId, userId })
    .then((template) => {
      const { name, content } = req.body;
      template.name = name;
      template.content = content;
      template.save()
        .then(updatedTemplate => res.json({ template: updatedTemplate, errors: [], responseMsgs: [{ msg: 'Template updated', type: 'success' }] }));
    })
    .catch(() => res.json({ template: {}, errors: ['Something went wrong'], responseMsgs: [] }));
};

// Delete template
templateHandlers.deleteTemplate = (req, res) => {
  req.checkParams('templateId').notEmpty().withMessage('Template id is required');
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, responseMsgs: [] });
  }
  const { templateId } = req.params;
  const userId = req.session.userID;
  return TemplatesModel.remove({ _id: templateId, userId })
    .then(() => res.json({ _id: templateId, errors: [], responseMsgs: [{ msg: 'Template deleted', type: 'success' }] }))
    .catch(err => res.json({ _id: '', errors: ['Something went wrong', err], responseMsgs: [] }));
};
