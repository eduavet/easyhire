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
  lastUpdatedNoteId: '',
  noteStatus: 'noteSaveStatus',
  notes: [],
  loading: true,
  errors: [],
  loaded: false,
  url: '',
};

/**
 * Action
 */
const GET_EMAIL_FROM_DB = 'Get email from database';
const GET_EMAIL_FROM_GAPI = 'Get email from google api';
const GET_ATTACHMENT_FROM_GAPI = 'Get attachment from google api';
const GET_ATTACHMENT = 'Get attachments';
const CHANGE_EMAIL_STATUS = 'Change email status';
const GET_NOTES = 'Get notes';
const SEND_NOTE = 'Send note. Add or update';
const CHANGE_NOTE_STATUS = 'Change note status';
// const REFRESH = 'Refresh';
const LOADING = 'Loading';
const SET_EMAIL_ID = 'Set email id';

/**
 * Action creator
 */
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
/*function getAttachments(objectURL) {
  return {
    type: GET_ATTACHMENT,
    payload: {
      url: objectURL,
    },
  };
}*/

function changeEmailStatus(result) {
  return {
    type: CHANGE_EMAIL_STATUS,
    payload: {
      errors: result.errors,
      emailNewStatus: result.status,
    },
  };
}
function getNotes(result) {
  return {
    type: GET_NOTES,
    payload: {
      notes: result.notes,
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

// function refresh(result) {
//   return {
//     type: REFRESH,
//     payload: {
//       emails: result.emailsToSend,
//     },
//   };
// }


function loading() {
  return {
    type: LOADING,
  };
}
function setEmailId(emailId) {
  return {
    type: SET_EMAIL_ID,
    payload: { emailId },
  };
}
export function changeNoteStatus(status) {
  return {
    type: CHANGE_NOTE_STATUS,
    payload: { status },
  };
}

export function asyncgetEmailFromDb(id) {
  return function asyncgetEmailFromDbInner(dispatch) {
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
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  const strAttachment = JSON.stringify(attachment);
  return function asyncGetAttachmentFromGapiInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/emails/${emailId}/${strAttachment}/gapi`, {
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
/*export function asyncGetAttachments(emailId, attachment) {
  return function asyncGetAttachmentsInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/emails/${emailId}/attachments/`, {
      method: 'POST',
      body: JSON.stringify({ attachment }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.blob())
      .then((result) => {
        // const objectURL = URL.createObjectURL(result);
        // console.log(objectURL, 'result');
        // dispatch(getAttachments(objectURL));
      })
      .catch(() => {});
  };
}*/


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

export function asyncSendNote(emailId, note, noteId) {
  const method = noteId ? 'PUT' : 'POST';
  const url = noteId ?
    `http://localhost:3000/api/notes/${noteId}/`
    : `http://localhost:3000/api/notes/email/${emailId}`;
  return function asyncSendNoteInner(dispatch) {
    dispatch(loading());
    fetch(url, {
      method,
      body: JSON.stringify({ content: note }),
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
export function asyncGetNotes(emailId) {
  return function asyncGetNotesInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/notes/email/${emailId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getNotes(result));
      })
      .catch(() => {});
  };
}
// export function asyncRefresh() {
//   return function asyncRefreshInner(dispatch) {
//     dispatch(loading());
//     fetch('http://localhost:3000/api/emails', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then((result) => {
//         dispatch(refresh(result));
//       }).catch(() => {});
//   };
// }


/**
 * Reducer
 */

export default function emailsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EMAIL_FROM_DB:
    {
      const checkHtmlBody = state.htmlBody ? state.htmlBody : '<div dir="auto"></div>';
      return {
        ...state,
        email: Object.assign({}, payload.email, { htmlBody: checkHtmlBody }),
        loaded: true,
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
        url: payload.url,
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
    case GET_NOTES:
    {
      return {
        ...state,
        notes: [...state.notes, ...payload.notes],
        loaded: true,
      };
    }
    case SEND_NOTE:
    {
      let notesAfterUpdate = [];
      if (payload.noteUpdated) {
        notesAfterUpdate = state.notes.map((note) => {
          if (note._id === payload.note._id) {
            note = payload.note;
          }
          return note;
        });
      } else {
        notesAfterUpdate = payload.note._id ? [...state.notes, payload.note] : state.notes;
      }
      return {
        ...state,
        lastUpdatedNoteId: payload.note._id,
        errors: [],
        noteStatus: payload.note ? 'noteSaveStatus active' : 'noteSaveStatus',
        notes: notesAfterUpdate,
      };
    }
    case LOADING:
      return {
        ...state, loaded: false,
      };
    case SET_EMAIL_ID:
      return {
        ...state,
        email: Object.assign({}, state.email, { emailId: payload.emailId }),
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
