const initialState = {
    emails: [],
    name: '',
    folders: [
        { name:'Inbox', count: 9, icon: 'fa-inbox', isActive: true },
        { name:'Approved', count: 3, icon: 'fa-check-square', isActive: false },
        { name:'Rejected', count: 1, icon: 'fa-times-circle', isActive: false },
        { name:'Interview Scheduled', count: 7, icon: 'fa-clock', isActive: false },
        { name:'Created', count: 7, icon: 'fa-folder', isActive: false },
        { name: 'Not reviewed', count: 3, icon: 'fa-question', isActive: false },
    ]
};

/**
 * Action
 */
const GET_EMAILS = 'Get emails';
const GET_USERNAME = 'Get username';

/**
 * Action creator
 */
function getEmails(emails) {
    return {
        type: GET_EMAILS,
        payload: { emails }
    };
}

function getUsername(name) {
    return {
        type: GET_USERNAME,
        payload: { name }
    };
}
export function asyncGetEmails() {
    return function(dispatch) {
        fetch('http://localhost:3000/api/emails', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(getEmails(result.emailsToSend))
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
/**
 * Reducer
 */

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_EMAILS:
            return {
                ...state,
                emails: [...state.emails, ...payload.emails],
            };
        case GET_USERNAME:
            return {
                ...state,
                name : payload.name,
                errors: payload.errors,
                successMsgs: payload.successMsgs
            };
        default:
            return state;
    }
}
