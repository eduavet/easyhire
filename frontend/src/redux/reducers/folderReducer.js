const initialState = {
  folders: [], folderErrors: [], loaded: false, page: 'dashboard',
};

const GET_FOLDERS = 'Get folders';
const UPDATE_COUNT = 'Update count';
const CREATE_FOLDER = 'Create folder';
const UPDATE_FOLDER = 'Update folder';
const DELETE_FOLDER = 'Delete folder';
const IS_ACTIVE = 'Is active';
const REFRESH = 'Refresh';
const DELETE_EMAILS = 'Delete emails';
const MOVE_EMAILS = 'Update Email Folders';
const SET_PAGE = 'Set Page';

function getFolders(result) {
  return {
    type: GET_FOLDERS,
    payload: {
      folders: result.folders, inboxCount: result.inboxCount,
    },
  };
}

function createFolder(response) {
  return {
    type: CREATE_FOLDER,
    payload: {
      createdFolder: response.createdFolder, folderErrors: response.errors,
    },
  };
}

function updateFolder(response) {
  return {
    type: UPDATE_FOLDER,
    payload: {
      updatedFolder: response.updatedFolder, folderErrors: response.errors,
    },
  };
}

function deleteFolder(response) {
  return {
    type: DELETE_FOLDER,
    payload: {
      deletedFolderID: response.deletedFolderID, folderErrors: response.errors,
    },
  };
}

function moveEmails(response) {
  return {
    type: MOVE_EMAILS,
    payload: {
      emailsToMove: response.emailsToMove,
      errors: response.errors,
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

export function isActive(item) {
  return {
    type: IS_ACTIVE, payload: { isActive: true, id: item._id },
  };
}

function refresh(result) {
  return {
    type: REFRESH,
    payload: {
      folders: result.folders, inboxCount: result.inboxCount,
    },
  };
}

export function setPage(dispatch, pageValue) {
  return dispatch({
    type: SET_PAGE,
    payload: {
      pageValue,
    },
  });
}

export function asyncGetFolders() {
  return function asyncGetEmailsInner(dispatch) {
    fetch('http://localhost:3000/api/folders', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getFolders(result));
      })
      .catch(() => {});
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
      .then((result) => {
        dispatch(moveEmails(result));
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
export function asyncRefreshFolders() {
  return function asyncRefreshInner(dispatch) {
    fetch('http://localhost:3000/api/folders', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(refresh(result));
      }).catch(() => {});
  };
}

// export function setSettings() {
//   return function setSettingsInner(dispatch) {
//     dispatch(refresh(result));
//   };
// }

export function updateCount() {
  asyncGetFolders();
  return {
    type: UPDATE_COUNT,
  };
}
/**
 * Reducer
 */

export default function folderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_FOLDERS:
      return {
        ...state,
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
      };
    case UPDATE_COUNT:
      return {
        ...state,
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
    case MOVE_EMAILS: {
      let nOffAffected = 0;
      const foldersAfterMove = state.folders.map((folder) => {
        nOffAffected = payload.originalFolder.map(origF => origF === folder._id.toString).length;
        if (payload.originalFolder.indexOf(folder._id) !== -1) {
          folder.count -= nOffAffected;
        }
        if (payload.emailsToMove[0].folder._id === folder._id) {
          folder.count += nOffAffected;
        }
        return folder;
      });
      return {
        ...state,
        folders: foldersAfterMove,
        folderErrors: payload.errors,
      };
    }
    case DELETE_EMAILS: {
      let nOffDeleted = 0;
      const afterDelete = state.folders.map((folder) => {
        nOffDeleted = payload.originalFolder.map(origF => origF === folder._id).length;
        if (folder._id === 'allEmails') {
          folder.count -= nOffDeleted;
        }
        if (payload.originalFolder.indexOf(folder._id) !== -1) {
          folder.count -= nOffDeleted;
        }
        return folder;
      });
      return {
        ...state,
        folders: afterDelete,
        fodlerErrors: payload.errors,
      };
    }
    case CREATE_FOLDER: {
      const folders = payload.createdFolder._id ? [
        ...state.folders,
        Object.assign({}, payload.createdFolder, { isActive: false }),
      ] : state.folders;
      return {
        ...state, folders, folderErrors: payload.folderErrors,
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
        folderErrors: payload.folderErrors,
      };
    case DELETE_FOLDER: {
      const foldersAfterDelete = state.folders
        .filter(folder => folder._id !== payload.deletedFolderID);
      return {
        ...state, folders: foldersAfterDelete, folderErrors: payload.folderErrors,
      };
    }
    case REFRESH:
      return {
        ...state,
        folders: [
          {
            _id: 'allEmails',
            name: 'Inbox',
            icon: 'fa-inbox',
            isActive: true,
            count: payload.inboxCount,
          },
          ...payload.folders.map(folder =>
            Object.assign({}, folder, { isActive: !!folder.isActive })),
        ],
        loaded: true,
      };
    case SET_PAGE:
      return {
        ...state,
        page: payload.pageValue,
      };
    default:
      return state;
  }
}
