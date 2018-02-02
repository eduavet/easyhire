const initialState = {
  folders: [], folderErrors: [],
};

const GET_FOLDERS = 'Get folders';
const CREATE_FOLDER = 'Create folder';
const UPDATE_FOLDER = 'Update folder';
const DELETE_FOLDER = 'Delete folder';
const IS_ACTIVE = 'Is active';
const REFRESH = 'Refresh';

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
          ...payload.folders
            .map(folder => Object.assign({}, folder, { isActive: !!folder.isActive }))],
      };
    default:
      return state;
  }
}
