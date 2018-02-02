/* eslint no-underscore-dangle: 0 */
const initialState = {
  emails: [], name: '', folders: [], loading: true, errors: [], loaded: false,
};

/**
 * Action
 */
const GET_USERNAME = 'Get username';
const GET_EMAILS = 'Get emails';
const DELETE_EMAILS = 'Delete emails';
const UPDATE_EMAILS = 'Update Email Folders';

const CREATE_FOLDER = 'Create folder';
const UPDATE_FOLDER = 'Update folder';
const DELETE_FOLDER = 'Delete folder';
const GET_FOLDER_EMAILS = 'Get folder emails';
const IS_ACTIVE = 'Is active';

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
      emails: result.emailsToSend, folders: result.folders, inboxCount: result.inboxCount,
    },
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

function getUsername(name) {
  return {
    type: GET_USERNAME, payload: { name },
  };
}

function createFolder(response) {
  return {
    type: CREATE_FOLDER,
    payload: {
      createdFolder: response.createdFolder, errors: response.errors,
    },
  };
}

function updateFolder(response) {
  return {
    type: UPDATE_FOLDER,
    payload: {
      updatedFolder: response.updatedFolder, errors: response.errors,
    },
  };
}

function deleteFolder(response) {
  return {
    type: DELETE_FOLDER,
    payload: {
      deletedFolderID: response.deletedFolderID, errors: response.errors,
    },
  };
}

function updateEmails(response) {
  return {
    type: UPDATE_EMAILS,
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
      emails: result.emailsToSend, folders: result.folders, inboxCount: result.inboxCount,
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

export function isChecked(item) {
  return {
    type: IS_CHECKED, payload: { isChecked: !item.isChecked, id: item.emailID },
  };
}

export function isActive(item) {
  return {
    type: IS_ACTIVE, payload: { isActive: true, id: item._id },
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

export function asyncCreateFolder(body) {
  return function asyncCreateFolderInner(dispatch) {
    fetch('http://localhost:3000/api/folders', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(createFolder(result));
      }).catch(() => {});
  };
}

export function asyncUpdateFolder(body) {
  const updatedFolder = { id: body.id, folderName: body.folderName };
  return function asyncUpdateFolderInner(dispatch) {
    fetch(`http://localhost:3000/api/folders/${updatedFolder.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFolder),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(updateFolder(result));
      }).catch(() => {});
  };
}

export function asyncDeleteFolder(id) {
  return function asyncDeleteFolderInner(dispatch) {
    fetch(`http://localhost:3000/api/folders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(deleteFolder(result));
      }).catch(() => {});
  };
}

export function asyncPostEmailsToFolder(emailIds, folderId) {
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
        dispatch(updateEmails(res));
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

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EMAILS:
      return {
        ...state,
        emails: [
          ...state.emails,
          ...payload.emails
            .map(email => Object.assign({}, email, { isChecked: !!email.isChecked })),
        ],
        folders: [
          ...state.folders,
          {
            _id: 'allEmails',
            name: 'Inbox',
            icon: 'fa-inbox',
            isActive: true,
            count: payload.inboxCount,
            user_id: null,
          },
          ...payload.folders
            .map(folder => Object.assign({}, folder, { isActive: !!folder.isActive })),
        ],
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
    case IS_ACTIVE:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder._id === payload.id) {
            Object.assign(folder, { isActive: payload.isActive });
          } else {
            Object.assign(folder, { isActive: false });
          }
          return folder;
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
    case CREATE_FOLDER:
    {
      const folders = payload.createdFolder._id ? [
        ...state.folders,
        Object.assign({}, payload.createdFolder, { isActive: false }),
      ] : state.folders;
      return {
        ...state, folders, errors: payload.errors,
      };
    }
    case UPDATE_FOLDER:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder._id === payload.updatedFolder._id.toString()) {
            folder.name = payload.updatedFolder.name;
          }
          return folder;
        }),
        errors: payload.errors,
      };
    case DELETE_FOLDER:
    {
      const foldersAfterDelete = state.folders
        .filter(folder => folder._id !== payload.deletedFolderID);
      return {
        ...state, folders: foldersAfterDelete, errors: payload.errors,
      };
    }

    case UPDATE_EMAILS:
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
