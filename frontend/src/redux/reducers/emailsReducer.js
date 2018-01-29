const initialState = {
    emails: [],
    name: ''
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
        fetch('http://localhost:3000/api/getEmails', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                dispatch(getEmails(result.emailsToSend))
            })
    }
}

export function asyncGetUsername() {
    console.log('async user');
    return function(dispatch) {
        fetch('http://localhost:3000/api/getEmails', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                console.log(result.name)
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
                errors: payload.errors,
                successMsgs: payload.successMsgs
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
