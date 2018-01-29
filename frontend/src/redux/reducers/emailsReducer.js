const initialState = {
    emails: [],
    name: '',
    folders: [
        { name:'Inbox', count: 9, icon: 'fa-inbox', isActive: true },
        { name:'Approved', count: 3, icon: 'fa-check-square', isActive: false },
        { name:'Rejected', count: 1, icon: 'fa-times-circle', isActive: false },
        { name:'Interview Scheluded', count: 7, icon: 'fa-clock', isActive: false },
        { name:'Created', count: 7, icon: 'fa-folder', isActive: false },
        { name: 'Not reviewed', count: 3, icon: 'fa-question', isActive: false },
    ]
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
            };
        default:
            return state;
    }
}
