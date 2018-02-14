const initialState = {
  templates: [],
  template: {},
  loaded: false,
  errors: [],
  responseMsgs: [],
};

/**
 * Action
 */
const GET_TEMPLATES = 'Get all templates';
const GET_TEMPLATE = 'Get template';
const ADD_TEMPLATE = 'Add template';
const UPDATE_TEMPLATE = 'Update template';
const DELETE_TEMPLATE = 'Delete template';
const TEMPLATE_IS_ACTIVE = 'Template is active';
const CREATE_TEMPLATE = 'Create template';

const LOADING = 'Loading';
const CLEAR_ERROR = 'Clear error';
const CLEAR_RESPONSEMSG = 'Clear response msg';
/**
 * Action creator
 */
function getTemplates(result) {
  return {
    type: GET_TEMPLATES,
    payload: {
      templates: result.templates,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function getTemplate(result) {
  return {
    type: GET_TEMPLATE,
    payload: {
      template: result.template,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function addTemplate(result) {
  return {
    type: ADD_TEMPLATE,
    payload: {
      template: result.template,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function updateTemplate(result) {
  return {
    type: UPDATE_TEMPLATE,
    payload: {
      template: result.template,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function deleteTemplate(result) {
  return {
    type: DELETE_TEMPLATE,
    payload: {
      _id: result._id,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
export function createTemplate() {
  return {
    type: CREATE_TEMPLATE,
    payload: {},
  };
}

function loading() {
  return {
    type: LOADING,
  };
}
export function templateIsActive(_id) {
  return {
    type: TEMPLATE_IS_ACTIVE,
    payload: { isActive: true, id: _id },
  };
}
export function clearError(value) {
  return {
    type: CLEAR_ERROR,
    payload: { error: value },
  };
}
export function clearResponseMsg(value) {
  return {
    type: CLEAR_RESPONSEMSG,
    payload: { responseMsg: value },
  };
}
export function asyncGetTemplates() {
  return function asyncGetTemplatesInner(dispatch) {
    dispatch(loading());
    fetch('http://localhost:3000/api/templates/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getTemplates(result));
      })
      .catch(() => {});
  };
}
export function asyncGetTemplate(templateId) {
  return function asyncGetTemplateInner(dispatch) {
    fetch(`http://localhost:3000/api/templates/${templateId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getTemplate(result));
      })
      .catch(() => {});
  };
}
export function asyncAddTemplate(name, content) {
  return function asyncAddTemplateInner(dispatch) {
    fetch('http://localhost:3000/api/templates/', {
      method: 'POST',
      body: JSON.stringify({ name, content }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(addTemplate(result));
      })
      .catch(() => {});
  };
}
export function asyncUpdateTemplate(templateId, name, content) {
  return function asyncUpdateTemplateInner(dispatch) {
    fetch(`http://localhost:3000/api/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, content }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(updateTemplate(result));
      })
      .catch(() => {});
  };
}
export function asyncDeleteTemplate(templateId) {
  return function asyncDeleteTemplateInner(dispatch) {
    fetch(`http://localhost:3000/api/templates/${templateId}`, {
      method: 'DELETE',
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(deleteTemplate(result));
      })
      .catch(() => {});
  };
}

/**
 * Reducer
 */

export default function emailsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TEMPLATES:
      return {
        ...state,
        templates: payload.templates
          .map(template => Object.assign({}, template, { isActive: !!template.isActive })),
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearSettingsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearSettingsResponseMsg' })),
        loaded: true,
      };
    case GET_TEMPLATE:
      return {
        ...state,
        template: payload.template,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearSettingsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearSettingsResponseMsg' })),
      };
    case ADD_TEMPLATE:
    {
      const templatesAfterAdd = payload.errors.length ?
        state.templates :
        [...state.templates, Object.assign({}, payload.template, { isActive: true })];
      const addedTemplate = payload.errors.length ?
        state.template :
        Object.assign({}, payload.template, { isActive: true });
      return {
        ...state,
        templates: templatesAfterAdd,
        template: addedTemplate,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearSettingsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearSettingsResponseMsg' })),
      };
    }
    case UPDATE_TEMPLATE:
    {
      const templatesAfterUpdtate = payload.errors.length ?
        state.templates :
        state.templates.map((template) => {
          if (template._id === payload.template._id.toString()) {
            template = payload.template;
            template.isActive = true;
          }
          return template;
        });
      const updatedTemple = payload.errors.length ?
        state.template :
        Object.assign({}, payload.template, { isActive: true });
      return {
        ...state,
        templates: templatesAfterUpdtate,
        template: updatedTemple,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearSettingsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearSettingsResponseMsg' })),
      };
    }
    case DELETE_TEMPLATE:
    {
      const templatesAfterDelete = payload.errors.length ?
        state.templates :
        state.templates
          .filter(template => template._id !== payload._id);
      return {
        ...state,
        templates: templatesAfterDelete,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearSettingsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearSettingsResponseMsg' })),
      };
    }
    case TEMPLATE_IS_ACTIVE:
      return {
        ...state,
        templates: state.templates.map((template) => {
          if (template._id === payload.id) {
            Object.assign(template, { isActive: payload.isActive });
          } else {
            Object.assign(template, { isActive: false });
          }
          return template;
        }),
      };
    case CREATE_TEMPLATE:
      return {
        ...state,
        template: {
          _id: '',
          name: '',
          content: '',
          icon: '',
        },
      };
    case LOADING:
      return {
        ...state, loaded: false,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.msg !== payload.error),
      };
    case CLEAR_RESPONSEMSG:
      return {
        ...state,
        responseMsgs: state.responseMsgs
          .filter(responseMsg => responseMsg.msg !== payload.responseMsg),
      };
    default:
      return state;
  }
}
