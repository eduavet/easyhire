import { asyncGetStatuses } from './statusReducer';

const initialState = {
  email: {
    date: 'MM/DD/YYYY, HH:mm:ss',
    emailId: '',
    folderId: '',
    htmlBody: '',
    isRead: true,
    sender: '',
    snippet: '',
    status: '',
    subject: '',
    isPlainText: false,
    attachments: [],
  },
  noteStatus: 'noteSaveStatus',
  note: { content: '' },
  loading: true,
  loaded: false,
  url: [],
  template: '',
  composeWindowClassName: 'compose',
  composeWindowHeaderText: 'Compose',
  btnName: '',
  errors: [],
  responseMsgs: [],
};

/**
 * Action
 */
const SET_EMAIL_ID = 'Set email id';

const GET_EMAIL_FROM_DB = 'Get email from database';
const GET_EMAIL_FROM_GAPI = 'Get email from google api';
const GET_ATTACHMENT_FROM_GAPI = 'Get attachment from google api';

const CHANGE_EMAIL_STATUS = 'Change email status';

const GET_NOTE = 'Get note';
const SEND_NOTE = 'Send note. Add or update';
const CHANGE_NOTE_STATUS = 'Change note status';

const TOGGLE_COMPOSE_WINDOW = 'Toggle compose window';

const CHANGE_COMPOSE_WINDOW_HEADER_TEXT = 'Change compose window header text';

const CHANGE_BUTTON_NAME = 'Change button name';


const SEND_NEW_EMAIL = 'Send new email';
const REPLY = 'Reply';
const GET_TEMPLATE = 'Get template';
const LOADING = 'Loading';

/**
 * Action creator
 */
function setEmailId(emailId) {
  return {
    type: SET_EMAIL_ID,
    payload: { emailId },
  };
}

function getEmailFromDb(result) {
  return {
    type: GET_EMAIL_FROM_DB,
    payload: {
      email: result.email,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getEmailFromGapi(result) {
  return {
    type: GET_EMAIL_FROM_GAPI,
    payload: {
      email: result.email,
      isPlainText: result.isPlainText,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getAttachmentFromGapi(result) {
  return {
    type: GET_ATTACHMENT_FROM_GAPI,
    payload: {
      url: result.objectURL,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getTemplate(result) {
  return {
    type: GET_TEMPLATE,
    payload: {
      template: result.template.content,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
export function toggleComposeWindow(value) {
  return {
    type: TOGGLE_COMPOSE_WINDOW,
    payload: { composeWindowClassName: value },
  };
}

export function changeComposeWindowHeaderText(value) {
  return {
    type: CHANGE_COMPOSE_WINDOW_HEADER_TEXT,
    payload: { composeWindowHeaderText: value },
  };
}

function sendNewEmail(result) {
  return {
    type: SEND_NEW_EMAIL,
    payload: {
      status: result.status,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function reply(result) {
  return {
    type: REPLY,
    payload: {
      ok: result.ok,
      status: result.status,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function changeEmailStatus(result) {
  return {
    type: CHANGE_EMAIL_STATUS,
    payload: {
      emailNewStatus: result.status,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getNote(result) {
  return {
    type: GET_NOTE,
    payload: {
      note: result.note,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function sendNote(result) {
  return {
    type: SEND_NOTE,
    payload: {
      note: result.note,
      noteUpdated: result.noteUpdated,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
export function changeNoteStatus(status) {
  return {
    type: CHANGE_NOTE_STATUS,
    payload: { status },
  };
}

export function toggleButtonName(btnName) {
  return {
    type: CHANGE_BUTTON_NAME,
    payload: { btnName },
  };
}
function loading() {
  return {
    type: LOADING,
  };
}

export function asyncGetEmailFromDb(id) {
  return function asyncGetEmailFromDbInner(dispatch) {
    dispatch(loading());
    dispatch(setEmailId(id));
    fetch(`http://localhost:3000/api/emails/${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getEmailFromDb(result));
      })
      .catch(() => {});
  };
}
export function asyncGetEmailFromGapi(id) {
  return function asyncGetEmailFromGapiInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/${id}/gapi`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getEmailFromGapi(result));
      })
      .catch(() => {});
  };
}

export function asyncGetAttachmentFromGapi(emailId, attachment) {
  return function asyncGetAttachmentFromGapiInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/${emailId}/attachment/gapi`, {
      method: 'POST',
      body: JSON.stringify({ attachment }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.blob())
      .then((result) => {
        const objectURL = URL.createObjectURL(result);
        dispatch(getAttachmentFromGapi(objectURL));
      })
      .catch(() => {});
  };
}

export function asyncChangeEmailStatus(emailId, statusId) {
  return function asyncChangeEmailStatusInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/${emailId}/status/${statusId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(changeEmailStatus(result));
        dispatch(asyncGetStatuses());
      })
      .catch(() => {});
  };
}
export function asyncGetNote(sender) {
  return function asyncGetNoteInner(dispatch) {
    fetch(`http://localhost:3000/api/notes/sender/${sender}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getNote(result));
      })
      .catch(() => {});
  };
}

export function asyncSendNote(sender, emailId, note, noteId) {
  const method = noteId ? 'PUT' : 'POST';
  const url = noteId ?
    `http://localhost:3000/api/notes/${noteId}/`
    : `http://localhost:3000/api/notes/sender/${sender}`;
  return function asyncSendNoteInner(dispatch) {
    fetch(url, {
      method,
      body: JSON.stringify({ content: note, emailId }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(sendNote(result));
      })
      .catch(() => {});
  };
}

export function asyncSendNewEmail(emailId, subject, messageBody) {
  return function asyncSendNewEmailInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/${emailId}/sendNew/`, {
      method: 'POST',
      body: JSON.stringify({ subject, messageBody }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(sendNewEmail(result));
      })
      .catch(() => {});
  };
}

export function asyncReply(emailId, content) {
  return function asyncReplyInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/reply/${emailId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(reply(result));
      })
      .catch(() => {});
  };
}

export function asyncGetTemplate(templateId) {
  return function asyncGetTemplateInner(dispatch) {
    dispatch(toggleComposeWindow('compose show'));
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
/**
 * Reducer
 */

export default function emailsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_EMAIL_ID:
      return {
        ...state,
        email: Object.assign({}, state.email, { emailId: payload.emailId }),
      };
    case GET_EMAIL_FROM_DB:
    {
      const checkHtmlBody = state.htmlBody ? state.htmlBody : '<div dir="auto"></div>';
      return {
        ...state,
        email: Object.assign({}, payload.email, { htmlBody: checkHtmlBody }),
        url: [],
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case GET_EMAIL_FROM_GAPI:
      return {
        ...state,
        email: Object
          .assign(
            {},
            state.email,
            {
              htmlBody: payload.email.htmlBody,
              isPlainText: payload.isPlainText.value,
            },
          ),
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    case GET_ATTACHMENT_FROM_GAPI:
      return {
        ...state,
        url: [...state.url, payload.url],
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    case SEND_NEW_EMAIL: {
      return {
        ...state,
        messageSent: payload.status,
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case CHANGE_BUTTON_NAME: {
      return {
        ...state,
        btnName: payload.btnName,
      };
    }
    case REPLY: {
      return {
        ...state,
        messageSent: payload.ok,
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case CHANGE_EMAIL_STATUS:
    {
      const emailNewStatus = payload.emailNewStatus ? payload.emailNewStatus : state.email.status;
      return {
        ...state,
        email: Object.assign({}, state.email, { status: emailNewStatus }),
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case GET_NOTE:
    {
      return {
        ...state,
        note: payload.note,
        loaded: true,
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case SEND_NOTE:
    {
      return {
        ...state,
        noteStatus: payload.errors.length < 1 && payload.note ? 'noteSaveStatus active' : 'noteSaveStatus',
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case LOADING:
      return {
        ...state, loaded: false,
      };
    case CHANGE_NOTE_STATUS:
      return {
        ...state,
        noteStatus: payload.status,
      };
    case TOGGLE_COMPOSE_WINDOW:
      return {
        ...state,
        composeWindowClassName: payload.composeWindowClassName,
      };
    case CHANGE_COMPOSE_WINDOW_HEADER_TEXT:
      return {
        ...state,
        composeWindowHeaderText: payload.composeWindowHeaderText,
      };
    case GET_TEMPLATE:
      return {
        ...state,
        template: payload.template,
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    default:
      return state;
  }
}
