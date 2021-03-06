const initialState = {
  emails: [],
  name: '',
  signature: '',
  loading: true,
  loaded: false,
  errors: [],
  responseMsgs: [],
  sentEmails: [],
};

/**
 * Action
 */
const GET_USERNAME = 'Get username';
const GET_SIGNATURE = 'Get signature';
const GET_EMAILS = 'Get emails';
const GET_SENT_EMAILS = 'Get sent emails from db';
const GET_SENT_GAPI = 'Get sent emails';
const DELETE_EMAILS = 'Delete emails';

const MOVE_EMAILS = 'Update Email Folders';
const GET_FOLDER_EMAILS = 'Get folder emails';
const GET_STATUS_EMAILS = 'Get status emails';

const EMAIL_REFRESH = 'Email refresh';
const LOADING = 'Loading';

const IS_CHECKED = 'Is checked';
const SELECT_ALL = 'Select all';
const SELECT_NONE = 'Select none';

const MARK = 'Mark';
const SEARCH = 'Search';
const CLEAR_ERROR = 'Clear error';
const CLEAR_RESPONSEMSG = 'Clear response msg';
/**
 * Action creator
 */
function getEmails(result) {
  return {
    type: GET_EMAILS,
    payload: {
      emails: result.emailsToSend,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getSentEmails(result) {
  return {
    type: GET_SENT_EMAILS,
    payload: {
      emails: result.emailsToSend,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function getSentEmailsFromGapi(result) {
  return {
    type: GET_SENT_GAPI,
    payload: {
      emails: result.emailsToSend,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getUsername(result) {
  return {
    type: GET_USERNAME,
    payload: {
      name: result.name,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getSignature(result) {
  return {
    type: GET_SIGNATURE,
    payload: {
      signature: result.result.signature,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getFolderEmails(result) {
  return {
    type: GET_FOLDER_EMAILS,
    payload: {
      emails: result.emailsToSend,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function getStatusEmails(result) {
  return {
    type: GET_STATUS_EMAILS,
    payload: {
      emails: result.emailsToSend,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function moveEmails(response, inboxActive) {
  return {
    type: MOVE_EMAILS,
    payload: {
      emailsToMove: response.emailsToMove,
      errors: response.errors,
      originalFolder: response.originalFolder,
      inboxActive,
      responseMsgs: response.responseMsgs,
    },
  };
}

function deleteEmails(response) {
  return {
    type: DELETE_EMAILS,
    payload: {
      emailsToDelete: response.emailsToDelete,
      errors: response.errors,
      originalFolder: response.originalFolder,
      responseMsgs: response.responseMsgs,
    },
  };
}

function emailRefresh(result) {
  return {
    type: EMAIL_REFRESH,
    payload: {
      emails: result.emailsToSend,
      responseMsgs: result.responseMsgs,
      errors: result.errors,
    },
  };
}

function mark(result) {
  return {
    type: MARK,
    payload: {
      emailsToMark: result.emailsToMark,
      newValue: result.newValue,
      responseMsgs: result.responseMsgs,
      errors: result.errors,
    },
  };
}

function loading() {
  return {
    type: LOADING,
  };
}

function search(result) {
  return {
    type: SEARCH,
    payload: {
      emails: result.emailsToSend,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
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

export function asyncGetEmails() {
  return function asyncGetEmailsInner(dispatch) {
    dispatch(loading());
    fetch('http://localhost:3000/api/emails', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getEmails(result));
      })
      .catch();
  };
}

export function asyncGetSentEmails() {
  return function asyncGetSentEmailsInner(dispatch) {
    dispatch(loading());
    fetch('http://localhost:3000/api/emails/sent', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getSentEmails(result));
      })
      .catch();
  };
}

export function asyncGetSentEmailsFromGapi() {
  return function asyncGetSentEmailsFromGapiInner(dispatch) {
    dispatch(loading());
    fetch('http://localhost:3000/api/emails/sent/gapi', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getSentEmailsFromGapi(result));
      })
      .catch();
  };
}

export function asyncGetUsername() {
  return function asyncGetUsernameInner(dispatch) {
    fetch('http://localhost:3000/api/username', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getUsername(result));
      }).catch(() => {});
  };
}

export function asyncGetSignature() {
  return function asyncGetSignatureInner(dispatch) {
    fetch('http://localhost:3000/api/emails/signature', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getSignature(result));
      })
      .catch();
  };
}

export function asyncGetFolderEmails(folderId) {
  return function asyncGetFolderEmailsInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/folders/${folderId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getFolderEmails(result));
      }).catch(() => {});
  };
}

export function asyncGetStatusEmails(statusId, folderId) {
  return function asyncGetStatusEmailsInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/statuses/${statusId}/${folderId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getStatusEmails(result));
      }).catch(() => {});
  };
}

export function isChecked(item) {
  return {
    type: IS_CHECKED, payload: { isChecked: !item.isChecked, id: item.emailId },
  };
}

export function selectAll(emails) {
  return {
    type: SELECT_ALL,
    payload: {
      emails: emails.map((email) => {
        email.isChecked = true;
        return email;
      }),
    },
  };
}

export function selectNone(emails) {
  return {
    type: SELECT_NONE,
    payload: {
      emails: emails.map((email) => {
        email.isChecked = false;
        return email;
      }),
    },
  };
}
export function asyncMoveEmails(emailIds, folderId, inboxActive) {
  return function asyncPostEmailsToFolderInner(dispatch) {
    fetch('http://localhost:3000/api/emails/move', {
      method: 'POST',
      body: JSON.stringify({ emailIds, folderId }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(moveEmails(result, inboxActive));
      }).catch(() => {});
  };
}

export function asyncDeleteEmails(emailIds) {
  return function asyncDeleteEmailsInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/${emailIds}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(deleteEmails(result));
      }).catch(() => {});
  };
}

export function asyncRefresh() {
  return function asyncRefreshInner(dispatch) {
    dispatch(loading());
    fetch('http://localhost:3000/api/emails/refresh', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(emailRefresh(result));
      }).catch();
  };
}

export function asyncMark(emailIds, isRead) {
  return function asyncMarkInner(dispatch) {
    fetch('http://localhost:3000/api/emails/mark', {
      method: 'POST',
      body: JSON.stringify({ emailIds, isRead }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(mark(result));
      }).catch(() => {});
  };
}

export function asyncSearch(text, folderId, searchType = '') {
  return function asyncSearchInner(dispatch) {
    dispatch(loading());
    fetch('http://localhost:3000/api/emails/search', {
      method: 'POST',
      body: JSON.stringify({ text, folderId, searchType }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(search(result));
      }).catch(() => {});
  };
}

/**
 * Reducer
 */

export default function emailsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EMAILS:
    {
      const allEmails = payload.emails;
      const allEmailsSoretedByDate = allEmails
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        ...state,
        emails:
          allEmailsSoretedByDate
            .map(email => Object.assign({}, email, {
              isChecked: !!email.isChecked,
              folderName: email.folder.name,
              folderId: email.folder._id,
              statusName: email.status ? email.status.name : '',
              statusId: email.status ? email.status._id : null,
            })),
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
        loaded: true,
      };
    }
    case GET_SENT_EMAILS:
      return {
        ...state,
        sentEmails: [
          ...payload.emails
            .map(email => Object.assign({}, email, {
              isChecked: !!email.isChecked,
              folderName: email.folder.name,
              folderId: email.folder._id,
            }))],
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
        loaded: true,
      };
    case GET_SENT_GAPI: {
      const sentEmails = payload.emails;
      const sentEmailsSoretedByDate = [
        ...sentEmails
          .map(email => Object.assign({}, email, { isChecked: !!email.isChecked })),
        ...state.emails]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        ...state,
        emails: sentEmailsSoretedByDate,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
      };
    }
    case GET_USERNAME:
      return {
        ...state,
        name: payload.name,
        loading: false,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
        successMsgs: payload.successMsgs,
      };
    case GET_SIGNATURE:
      return {
        ...state,
        signature: payload.signature,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
      };
    case GET_FOLDER_EMAILS:
      return {
        ...state,
        emails: payload.emails
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(email =>
            Object.assign({}, email, {
              isChecked: !!email.isChecked,
              folderName: email.folder.name,
              folderId: email.folder._id,
              statusName: email.status ? email.status.name : '',
              statusId: email.status ? email.status._id : null,
            })),
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
        loaded: true,
      };
    case GET_STATUS_EMAILS:
      return {
        ...state,
        emails: payload.emails
          .map(email =>
            Object.assign({}, email, {
              isChecked: !!email.isChecked,
              folderName: email.folder.name,
              folderId: email.folder._id,
              statusName: email.status.name,
              statusId: email.status._id,
            })),
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
        loaded: true,
      };
    case IS_CHECKED:
      return {
        ...state,
        emails: state.emails.map((email) => {
          if (email.emailId === payload.id) {
            Object.assign(email, { isChecked: payload.isChecked });
          }
          return email;
        }),
      };
    case SELECT_ALL:
      return {
        ...state, emails: payload.emails,
      };
    case SELECT_NONE:
      return {
        ...state, emails: payload.emails,
      };
    case MOVE_EMAILS:
    {
      let emailsAfterMove = state.emails.map((email) => {
        email.isChecked = false;
        return email;
      });
      if (!payload.inboxActive) {
        emailsAfterMove = emailsAfterMove.filter((email) => {
          if (payload.emailsToMove.filter(item => item.emailId === email.emailId).length) {
            return false;
          }
          return true;
        });
      }
      return {
        ...state,
        emails: emailsAfterMove,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
      };
    }
    case DELETE_EMAILS:
    {
      const emailsAfterDelete = state.emails.filter((email) => {
        email.isChecked = false;
        return payload.emailsToDelete.indexOf(email.emailId) === -1;
      });
      return {
        ...state,
        emails: emailsAfterDelete,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
      };
    }
    case EMAIL_REFRESH:
    {
      const newEmails = payload.emails
        .map(email => Object.assign({}, email, { isChecked: !!email.isChecked }));
      return {
        ...state,
        emails: [...newEmails, ...state.emails],
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
        loaded: true,
      };
    }
    case MARK:
    {
      const updatedEmails = state.emails.map((email) => {
        if (payload.emailsToMark.includes(email.emailId)) {
          email.isRead = payload.newValue;
          email.isChecked = false;
        }
        return email;
      });
      return {
        ...state,
        emails: updatedEmails,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearEmailsError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearEmailsResponseMsg' })),
      };
    }
    case SEARCH: {
      const searchedEmails = payload.emails;
      const searchedEmailsSoretedByDate = searchedEmails
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        ...state,
        emails: searchedEmailsSoretedByDate,
        errors: payload.errors
          .map(error => Object.assign({}, error, {clearFunction: 'clearEmailsError'})),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, {clearFunction: 'clearEmailsResponseMsg'})),
        loaded: true,
      };
    }
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
