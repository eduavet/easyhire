const initialState = {
  templates: [],
  template: {},
  loaded: false,
};

/**
 * Action
 */
const GET_TEMPLATES = 'Get all templates';
const GET_TEMPLATE = 'Get template';
const ADD_TEMPLATE = 'Add template';
const UPDATE_TEMPLATE = 'Update template';
const DELETE_TEMPLATE = 'Delete template';

const LOADING = 'Loading';

/**
 * Action creator
 */
function getTemplates(result) {
  return {
    type: GET_TEMPLATES,
    payload: { templates: result.templates, errors: result.errors },
  };
}
function getTemplate(result) {
  return {
    type: GET_TEMPLATE,
    payload: { template: result.template, errors: result.errors },
  };
}
function addTemplate(result) {
  return {
    type: ADD_TEMPLATE,
    payload: { template: result.template, errors: result.errors },
  };
}
function updateTemplate(result) {
  return {
    type: UPDATE_TEMPLATE,
    payload: { template: result.template, errors: result.errors },
  };
}
function deleteTemplate(result) {
  return {
    type: DELETE_TEMPLATE,
    payload: { _id: result._id, errors: result.errors },
  };
}


function loading() {
  return {
    type: LOADING,
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
    dispatch(loading());
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
    dispatch(loading());
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
    dispatch(loading());
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
    dispatch(loading());
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
        templates: payload.templates,
        errors: payload.errors,
        loaded: true,
      };
    case GET_TEMPLATE:
      return {
        ...state,
        template: payload.template,
        errors: payload.errors,
        loaded: true,
      };
    case ADD_TEMPLATE:
    {
      const templatesAfterAdd = payload.errors.length ?
        state.templates :
        [...state.templates, payload.template];
      return {
        ...state,
        templates: templatesAfterAdd,
        errors: payload.errors,
        loaded: true,
      };
    }
    case UPDATE_TEMPLATE:
    {
      const templatesAfterUpdtate = payload.errors.length ?
        state.templates :
        state.templates.map((template) => {
          if (template._id === payload.template._id.toString()) {
            template = payload.template;
          }
          return template;
        });
      return {
        ...state,
        templates: templatesAfterUpdtate,
        errors: payload.errors,
        loaded: true,
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
        errors: payload.errors,
        loaded: true,
      };
    }
    case LOADING:
      return {
        ...state, loaded: false,
      };
    default:
      return state;
  }
}
