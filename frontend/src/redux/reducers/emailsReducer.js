const initialState = {
    emails: [],
    name: '',
    folders: [
        // { name:'Inbox', count: 9, icon: 'fa-inbox', isActive: true },
        // { name:'Approved', count: 5, icon: 'fa-check-square', isActive: false },
        // { name:'Rejected', count: 1, icon: 'fa-times-circle', isActive: false },
        // { name:'Interview Scheduled', count: 7, icon: 'fa-clock', isActive: false },
        // { name:'Created', count: 7, icon: 'fa-folder', isActive: false },
        // { name: 'Not reviewed', count: 3, icon: 'fa-question', isActive: false },
    ],
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
        payload: { response }
    };
}
function updateFolder(response) {
    return {
        type: UPDATE_FOLDER,
        payload: { response }
    };
}
function deleteFolder(response) {
    return {
        type: DELETE_FOLDER,
        payload: { response }
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
                // credentials: 'include',
            },
            credentials: 'include',
        })
            // .then((res) => res.json())
            .then(result => {
                console.log(result)
                // dispatch(createFolder(result))
            }).catch(console.error);
    }
}
export function asyncUpdateFolder(body) {
    return function(dispatch) {
        fetch('http://localhost:3000/api/folders/', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(createFolder(result))
            }).catch(console.error);
    }
}
export function asyncDeleteFolder(body) {
    return function(dispatch) {
        fetch('http://localhost:3000/api/folders/', {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(createFolder(result))
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
            return state;
        case UPDATE_FOLDER:
            return state;
        case DELETE_FOLDER:
            return state;
        default:
            return state;
    }
}
