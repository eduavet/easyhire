const initialState = {
  statuses: [], statusErrors: [],
};

const GET_STATUSES = 'Get statuses';
// const CREATE_FOLDER = 'Create folder';
// const UPDATE_FOLDER = 'Update folder';
// const DELETE_FOLDER = 'Delete folder';
const IS_ACTIVE = 'Is active';
const REFRESH = 'Refresh';

function getStatuses(result) {
  return {
    type: GET_STATUSES,
    payload: {
      statuses: result.statuses, inboxCount: result.inboxCount,
    },
  };
}
// function createFolder(response) {
//   return {
//     type: CREATE_FOLDER,
//     payload: {
//       createdFolder: response.createdFolder, folderErrors: response.errors,
//     },
//   };
// }

// function updateFolder(response) {
//   return {
//     type: UPDATE_FOLDER,
//     payload: {
//       updatedFolder: response.updatedFolder, folderErrors: response.errors,
//     },
//   };
// }
//
// function deleteFolder(response) {
//   return {
//     type: DELETE_FOLDER,
//     payload: {
//       deletedFolderID: response.deletedFolderID, folderErrors: response.errors,
//     },
//   };
// }


export function isActive(item) {
  return {
    type: IS_ACTIVE, payload: { isActive: true, id: item._id },
  };
}

function refresh(result) {
  return {
    type: REFRESH,
    payload: {
      statuses: result.statuses, inboxCount: result.inboxCount,
    },
  };
}

export function asyncGetStatuses() {
  return function asyncGetEmailsInner(dispatch) {
    fetch('http://localhost:3000/api/statuses', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getStatuses(result));
      })
      .catch(() => {});
  };
}

// export function asyncCreateFolder(body) {
//   return function asyncCreateFolderInner(dispatch) {
//     fetch('http://localhost:3000/api/folders', {
//       method: 'POST',
//       body: JSON.stringify(body),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then((result) => {
//         dispatch(createFolder(result));
//       }).catch(() => {});
//   };
// }

// export function asyncUpdateFolder(body) {
//   const updatedFolder = { id: body.id, folderName: body.folderName };
//   return function asyncUpdateFolderInner(dispatch) {
//     fetch(`http://localhost:3000/api/folders/${updatedFolder.id}`, {
//       method: 'PUT',
//       body: JSON.stringify(updatedFolder),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then((result) => {
//         dispatch(updateFolder(result));
//       }).catch(() => {});
//   };
// }

// export function asyncDeleteFolder(id) {
//   return function asyncDeleteFolderInner(dispatch) {
//     fetch(`http://localhost:3000/api/folders/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then((result) => {
//         dispatch(deleteFolder(result));
//       }).catch(() => {});
//   };
// }

export function asyncRefreshFolders() {
  return function asyncRefreshInner(dispatch) {
    fetch('http://localhost:3000/api/statuses', {
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

export default function statusReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_STATUSES:
      return {
        ...state,
        statuses: [
          ...state.statuses,
          // {
          //   _id: 'allEmails',
          //   name: 'Inbox',
          //   icon: 'fa-inbox',
          //   isActive: true,
          //   count: payload.inboxCount,
          //   user_id: null,
          // },
          ...payload.statuses
            .map(status => Object.assign({}, status, { isActive: !!status.isActive })),
        ],
      };
    case IS_ACTIVE:
      return {
        ...state,
        folders: state.statuses.map((status) => {
          if (status._id === payload.id) {
            Object.assign(status, { isActive: payload.isActive });
          } else {
            Object.assign(status, { isActive: false });
          }
          return status;
        }),
      };
    // case CREATE_FOLDER: {
    //   const folders = payload.createdFolder._id ? [
    //       ...state.folders,
    //       Object.assign({}, payload.createdFolder, { isActive: false }),
    //     ] : state.folders;
    //   return {
    //     ...state, folders, folderErrors: payload.folderErrors,
    //   };
    // }
    // case UPDATE_FOLDER:
    //   return {
    //     ...state,
    //     folders: state.folders.map((folder) => {
    //       if (folder._id === payload.updatedFolder._id.toString()) {
    //         folder.name = payload.updatedFolder.name;
    //       }
    //       return folder;
    //     }),
    //     folderErrors: payload.folderErrors,
    //   };
    // case DELETE_FOLDER: {
    //   const foldersAfterDelete = state.folders
    //     .filter(folder => folder._id !== payload.deletedFolderID);
    //   return {
    //     ...state, folders: foldersAfterDelete, folderErrors: payload.folderErrors,
    //   };
    // }
    case REFRESH:
      return {
        ...state,
        statuses: [
          // {
          //   _id: 'allEmails',
          //   name: 'Inbox',
          //   icon: 'fa-inbox',
          //   isActive: true,
          //   count: payload.inboxCount,
          // },
          ...payload.statuses
            .map(status => Object.assign({}, status, { isActive: !!status.isActive }))],
      };
    default:
      return state;
  }
}
