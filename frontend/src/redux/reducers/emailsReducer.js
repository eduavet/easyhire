/* eslint no-underscore-dangle: 0 */
const initialState = {
  emails: [], name: '', loading: true, errors: [], loaded: false,
};

/**
 * Action
 */
const GET_USERNAME = 'Get username';
const GET_EMAILS = 'Get emails';
const DELETE_EMAILS = 'Delete emails';

const MOVE_EMAILS = 'Update Email Folders';
const GET_FOLDER_EMAILS = 'Get folder emails';
const GET_STATUS_EMAILS = 'Get status emails';

const REFRESH = 'Refresh';
const LOADING = 'Loading';

const IS_CHECKED = 'Is checked';
const SELECT_ALL = 'Select all';
const SELECT_NONE = 'Select none';

const MARK = 'Mark';
/**
 * Action creator
 */
function getEmails(result) {
  return {
    type: GET_EMAILS,
    payload: {
      emails: result.emailsToSend, errors: result.errors,
    },
  };
}

function getUsername(name) {
  return {
    type: GET_USERNAME, payload: { name },
  };
}

function getFolderEmails(result) {
  return {
    type: GET_FOLDER_EMAILS,
    payload: {
      emails: result.emailsToSend, errors: result.errors,
    },
  };
}

function getStatusEmails(result) {
  return {
    type: GET_STATUS_EMAILS,
    payload: {
      emails: result.emailsToSend, errors: result.errors,
    },
  };
}

function moveEmails(response) {
  return {
    type: MOVE_EMAILS,
    payload: {
      emailsToMove: response.emailsToMove,
      errors: response.errors,
      folderId: response.folderId,
      folderName: response.folderName,
      originalFolder: response.originalFolder,
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
    },
  };
}

function refresh(result) {
  return {
    type: REFRESH,
    payload: {
      emails: result.emailsToSend,
    },
  };
}

function mark(result) {
  return {
    type: MARK,
    payload: {
      emailsToMark: result.emailsToMark, newValue: result.newValue,
    },
  };
}

function loading() {
  return {
    type: LOADING,
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
      .catch(() => {});
  };
}

export function asyncGetUsername() {
  return function asyncGetUsernameInner(dispatch) {
    fetch('http://localhost:3000/api/username', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getUsername(result.name));
      }).catch(() => {});
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

export function asyncGetStatusEmails(statusId) {
  return function asyncGetStatusEmailsInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/statuses/${statusId}`, {
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
    type: IS_CHECKED, payload: { isChecked: !item.isChecked, id: item.emailID },
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
export function asyncMoveEmails(emailIds, folderId) {
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
      .then((res) => {
        dispatch(moveEmails(res));
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
    fetch('http://localhost:3000/api/emails', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(refresh(result));
      }).catch(() => {});
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

/**
 * Reducer
 */

export default function emailsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EMAILS:
      console.log(payload.emails)
      return {
        ...state,
        emails: [
          ...state.emails,
          ...payload.emails
            .map(email => Object.assign({}, email, { isChecked: !!email.isChecked }))],
        errors: payload.errors,
        loaded: true,
      };
    case GET_USERNAME:
      return {
        ...state,
        name: payload.name,
        loading: false,
        errors: payload.errors,
        successMsgs: payload.successMsgs,
      };
    case GET_FOLDER_EMAILS:
      return {
        ...state,
        emails: payload.emails
          .map(email => Object.assign({}, email, { isChecked: !!email.isChecked })),
        loaded: true,
      };
    case GET_STATUS_EMAILS:
      return {
        ...state,
        emails: payload.emails
          .map(email => Object.assign({}, email, { isChecked: !!email.isChecked })),
        loaded: true,
      };
    case IS_CHECKED:
      return {
        ...state,
        emails: state.emails.map((email) => {
          if (email.emailID === payload.id) {
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
        if (payload.emailsToMove.indexOf(email.emailID) !== -1) {
          email.folderId = payload.folderId;
          email.folderName = payload.folderName;
        }
        email.isChecked = false;
        return email;
      });
      let nOffAffected = 0;
      const foldersAfterMove = state.folders.map((folder) => {
        if (folder.isActive && folder._id !== 'allEmails') {
          emailsAfterMove = emailsAfterMove.filter(email => email.folderId !== payload.folderId);
        }
        nOffAffected = payload.originalFolder.map(origF => origF === folder._id).length;
        if (payload.originalFolder.indexOf(folder._id) !== -1) {
          folder.count -= nOffAffected;
        }
        if (payload.folderId === folder._id) {
          folder.count += nOffAffected;
        }
        return folder;
      });

      return {
        ...state, emails: emailsAfterMove, folders: foldersAfterMove, errors: payload.errors,
      };
    }
    case DELETE_EMAILS:
    {
      let emailsAfterDelete = state.emails.filter((email) => {
        email.isChecked = false;
        return payload.emailsToDelete.indexOf(email.emailID) === -1;
      });
      let nOffDeleted = 0;
      const afterDelete = state.folders.map((folder) => {
        if (folder.isActive && folder._id !== 'allEmails') {
          emailsAfterDelete = emailsAfterDelete
            .filter(email => email.folderId !== payload.folderId);
        }
        nOffDeleted = payload.originalFolder.map(origF => origF === folder._id).length;

        if (payload.originalFolder.indexOf(folder._id) !== -1) {
          folder.count -= nOffDeleted;
        }
        return folder;
      });

      return {
        ...state, emails: emailsAfterDelete, folders: afterDelete, errors: payload.errors,
      };
    }
    case REFRESH:
      return {
        ...state,
        emails: payload.emails
          .map(email => Object.assign({}, email, { isChecked: !!email.isChecked })),
        folders: [
          {
            _id: 'allEmails',
            name: 'Inbox',
            icon: 'fa-inbox',
            isActive: true,
            count: payload.inboxCount,
          },
          ...payload.folders
            .map(folder => Object.assign({}, folder, { isActive: !!folder.isActive }))],
        loaded: true,
      };
    case MARK:
    {
      const updatedEmails = state.emails.map((email) => {
        if (payload.emailsToMark.includes(email.emailID)) {
          email.isRead = payload.newValue;
          email.isChecked = false;
        }
        return email;
      });
      return {
        ...state, emails: updatedEmails, errors: payload.errors,
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
