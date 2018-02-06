/* eslint no-underscore-dangle: 0 */
const initialState = {
  email: {
    date: 'DD/MM/YYYY, HH:mm:ss',
    emailId: '',
    folderId: '',
    htmlBody: '<div dir="auto"></div>↵',
    isRead: true,
    sender: '',
    snippet: '',
    status: '',
    subject: '',
  },
  loading: true,
  errors: [],
  loaded: false,
};

/**
 * Action
 */
const GET_EMAIL_FROM_DB = 'Get email from database';
const GET_EMAIL_FROM_GAPI = 'Get email from google api';
const CHANGE_EMAIL_STATUS = 'Change email status';
// const REFRESH = 'Refresh';
const LOADING = 'Loading';
const SET_EMAIL_ID = 'Set email id';

/**
 * Action creator
 */
function getEmailFromDb(result) {
  return {
    type: GET_EMAIL_FROM_DB,
    payload: {
      email: result.email,
    },
  };
}
function getEmailFromGapi(result) {
  return {
    type: GET_EMAIL_FROM_GAPI,
    payload: {
      email: result.email,
    },
  };
}
function changeEmailStatus(result) {
  return {
    type: CHANGE_EMAIL_STATUS,
    payload: {
      errors: result.errors,
      emailNewStatus: result.status,
    },
  };
}


// function refresh(result) {
//   return {
//     type: REFRESH,
//     payload: {
//       emails: result.emailsToSend,
//     },
//   };
// }


function loading() {
  return {
    type: LOADING,
  };
}
function setEmailId(emailId) {
  return {
    type: SET_EMAIL_ID,
    payload: { emailId },
  };
}

export function asyncgetEmailFromDb(id) {
  return function asyncgetEmailFromDbInner(dispatch) {
    dispatch(loading());
    dispatch(setEmailId(id));
    fetch(`http://localhost:3000/api/emails/${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getEmailFromDb(result));
      })
      .catch(() => {});
  };
}
export function asyncGetEmailFromGapi(id) {
  return function asyncGetEmailFromGapiInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/emails/${id}/gapi`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getEmailFromGapi(result));
      })
      .catch(() => {});
  };
}
export function asyncChangeEmailStatus(emailId, statusId) {
  return function asyncChangeEmailStatusInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/emails/${emailId}/status/${statusId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(changeEmailStatus(result));
      })
      .catch(() => {});
  };
}


// export function asyncRefresh() {
//   return function asyncRefreshInner(dispatch) {
//     dispatch(loading());
//     fetch('http://localhost:3000/api/emails', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then((result) => {
//         dispatch(refresh(result));
//       }).catch(() => {});
//   };
// }


/**
 * Reducer
 */

export default function emailsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EMAIL_FROM_DB:
    {
      asyncGetEmailFromGapi(state.email.emailId)
      return {
        ...state,
        email: Object.assign({}, payload.email, { htmlBody: '' }),
        loaded: true,
      };
    }
    case GET_EMAIL_FROM_GAPI:
      return {
        ...state,
        email: Object.assign({}, state.email, { htmlBody: payload.email.htmlBody }),
        loaded: true,
      };
    case CHANGE_EMAIL_STATUS:
    {
      const emailNewStatus = payload.emailNewStatus ? payload.emailNewStatus : state.email.status;
      return {
        ...state,
        errors: payload.errors,
        email: Object.assign({}, state.email, { status: emailNewStatus }),
      };
    }
    case LOADING:
      return {
        ...state, loaded: false,
      };
    case SET_EMAIL_ID:
      return {
        ...state,
        email: Object.assign({}, state.email, { emailId: payload.emailId })
      }
    default:
      return state;
  }
}
