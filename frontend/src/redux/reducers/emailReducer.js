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
  errors: [],
  loaded: false,
  url: [],
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
    },
  };
}

function getEmailFromGapi(result) {
  return {
    type: GET_EMAIL_FROM_GAPI,
    payload: {
      email: result.email, isPlainText: result.isPlainText,
    },
  };
}

function getAttachmentFromGapi(objectURL) {
  return {
    type: GET_ATTACHMENT_FROM_GAPI,
    payload: {
      url: objectURL,
    },
  };
}

function changeEmailStatus(result) {
  return {
    type: CHANGE_EMAIL_STATUS,
    payload: {
      errors: result.errors,
      emailNewStatus: result.status,
    },
  };
}

function getNote(result) {
  return {
    type: GET_NOTE,
    payload: {
      note: result.note,
    },
  };
}
function sendNote(result) {
  return {
    type: SEND_NOTE,
    payload: {
      note: result.note,
      errors: result.errors,
      noteUpdated: result.noteUpdated,
    },
  };
}
export function changeNoteStatus(status) {
  return {
    type: CHANGE_NOTE_STATUS,
    payload: { status },
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
    dispatch(loading());
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
    dispatch(loading());
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
    dispatch(loading());
    fetch(`http://localhost:3000/api/emails/${emailId}/status/${statusId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(changeEmailStatus(result));
      })
      .catch(() => {});
  };
}
export function asyncGetNote(sender) {
  return function asyncGetNoteInner(dispatch) {
    dispatch(loading());
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
    dispatch(loading());
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
        loaded: true,
        url: [],
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
        loaded: true,
      };
    case GET_ATTACHMENT_FROM_GAPI:
        return {
          ...state,
          url: [...state.url, payload.url],
        };
    // case GET_ATTACHMENT:
    //   return {
    //     ...state,
    //     url: payload.url,
    //   };
    case CHANGE_EMAIL_STATUS:
    {
      const emailNewStatus = payload.emailNewStatus ? payload.emailNewStatus : state.email.status;
      return {
        ...state,
        errors: payload.errors,
        email: Object.assign({}, state.email, { status: emailNewStatus }),
      };
    }
    case GET_NOTE:
    {
      return {
        ...state,
        note: payload.note,
        loaded: true,
      };
    }
    case SEND_NOTE:
    {
      return {
        ...state,
        errors: [],
        noteStatus: payload.errors.length < 1 && payload.note ? 'noteSaveStatus active' : 'noteSaveStatus',
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
    default:
      return state;
  }
}
