const initialState = {
    emails: [],
    name: '',
    folders: [],
    loading : true,
    errors: [],
};

/**
 * Action
 */
const GET_EMAILS = 'Get emails';
const GET_USERNAME = 'Get username';

const IS_CHECKED = 'Is checked';
const SELECT_ALL = 'Select all';
const SELECT_NONE = 'Select none';
const CREATE_FOLDER = 'Create folder';
const UPDATE_FOLDER = 'Update folder';
const DELETE_FOLDER = 'Delete folder';

/**
 * Action creator
 */
function getEmails(result) {
    return {
        type: GET_EMAILS,
        payload: { emails: result.emailsToSend, folders: result.folders }
    };
}

function getUsername(name) {
    return {
        type: GET_USERNAME,
        payload: { name }
    };
}
function createFolder(response) {
    return {
        type: CREATE_FOLDER,
        payload: { createdFolder: response.createdFolder, errors: response.errors }
    };
}
function updateFolder(response) {
    return {
        type: UPDATE_FOLDER,
        payload: { updatedFolder: response.updatedFolder, errors: response.errors }
    };
}
function deleteFolder(response) {
    return {
        type: DELETE_FOLDER,
        payload: { deletedFolderID: response.deletedFolderID, errors: response.errors  }
    };
}
export function asyncGetEmails() {
    return function(dispatch) {
        fetch('http://localhost:3000/api/emails', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(getEmails(result))
            }).catch(console.error);
    }
}

export function asyncGetUsername() {
    return function(dispatch) {
        fetch('http://localhost:3000/api/username', {
            credentials: 'include',
        })
            .then(res=>res.json())
            .then(result => {
                dispatch(getUsername(result.name));
            }).catch(console.error);
    }
}

export function isChecked(item){
    return {
        type: IS_CHECKED,
        payload: {isChecked: !item.isChecked, id: item.emailID}
    }
}
export function selectAll(emails){
    return {
        type: SELECT_ALL,
        payload: {emails : emails.map(email=>{
            email.isChecked=true;
            return email;
        }
        )}
    }
}
export function selectNone(emails) {
    return {
        type: SELECT_NONE,
        payload: {
            emails: emails.map(email => {
                    email.isChecked = false;
                    return email;
                }
            )
        }
    }
}
export function asyncCreateFolder(body) {
    return function(dispatch) {
        fetch('http://localhost:3000/api/folders', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(createFolder(result))
            }).catch(console.error);
    }
}
export function asyncUpdateFolder(body) {
  const updatedFolder = {id: body.id, folderName: body.folderName}
    return function(dispatch) {
        fetch('http://localhost:3000/api/folders/' + updatedFolder.id, {
            method: 'PUT',
            body: JSON.stringify(updatedFolder),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
              dispatch(updateFolder(result))
            }).catch(console.error);
    }
}
export function asyncDeleteFolder(id) {
    return function(dispatch) {
        fetch('http://localhost:3000/api/folders/' + id , {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(deleteFolder(result))
            }).catch(console.error);
    }
}

export function asyncPostEmailsToFolder(emailIds, folderId){
    return function(dispatch) {
        fetch('http://localhost:3000/api/emails/move', {
            method: 'POST',
            body: JSON.stringify({emailIds, folderId}),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })
            //.then((res) => res.json())
            .then(result => {
                console.log(result)
                //dispatch(createFolder(result))
            }).catch(console.error);
    }
}
/**
 * Reducer
 */

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_EMAILS:
            return {
                ...state,
                emails: [...state.emails, ...payload.emails.map(email=>Object.assign({}, email, {isChecked: !!email.isChecked}))],
                folders: payload.folders
            };
        case GET_USERNAME:
            return {
                ...state,
                name : payload.name,
                loading: false,
                errors: payload.errors,
                successMsgs: payload.successMsgs
            };
        case IS_CHECKED:
            return {
                ...state,
                emails: state.emails.map(email=>{
                    if(email.emailID===payload.id){
                        Object.assign(email, {isChecked: payload.isChecked});
                    }
                    return email;
                })
            };
        case SELECT_ALL:
            return {
                ...state,
                emails: payload.emails
            };
        case SELECT_NONE:
            return {
                ...state,
                emails: payload.emails
            };
        case CREATE_FOLDER:
            const folders =  payload.createdFolder.id ? [...state.folders, payload.createdFolder] : state.folders
            return {
                ...state,
                folders:folders,
                errors: payload.errors,
            };
        case UPDATE_FOLDER:
          return {
            ...state,
            folders: state.folders.map(folder => {
              if(folder.id == payload.updatedFolder.id) {
                folder.name = payload.updatedFolder.name
              }
              return folder
            }),
            errors: payload.errors,
          };
            return state;
        case DELETE_FOLDER:
            const foldersAfterDelete = state.folders.filter(folder => folder.id !== payload.deletedFolderID);
            return {
                ...state,
                folders:foldersAfterDelete,
                errors: payload.errors,
            };
        default:
            return state;
    }
}
