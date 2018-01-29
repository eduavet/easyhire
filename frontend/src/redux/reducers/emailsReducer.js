const initialState = {
    emails: [],
    name: ''
};

/**
 * Action
 */
const GET_EMAILS = 'Get emails';

/**
 * Action creator
 */
function getEmails(emails) {
    return {
        type: GET_EMAILS,
        payload: { emails }
    };
}
export function asyncGetEmails() {
    return function(dispatch) {
        fetch('http://localhost:3000/api/getEmails', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(result => {
                console.log(result.emailsToSend)
                dispatch(getEmails(result.emailsToSend))
            })
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
        default:
            return state;
    }
}
