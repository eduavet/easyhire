/* eslint no-underscore-dangle: 0 */
const initialState = {
  email: {}, loading: true, errors: [], loaded: false,
};

/**
 * Action
 */

const GET_EMAIL = 'Get email';
// const REFRESH = 'Refresh';
const LOADING = 'Loading';

/**
 * Action creator
 */
function getEmail(result) {
  console.log(result, 'getEmail result')
  return {
    type: GET_EMAIL,
    payload: {
      email: result.email,
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

export function asyncGetEmail(id) {
  return function asyncGetEmailInner(dispatch) {
    dispatch(loading());
    fetch(`http://localhost:3000/api/emails/${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getEmail(result));
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
    case GET_EMAIL:
      return {
        ...state,
        email: payload.email,
        loaded: true,
      };
    case LOADING:
      return {
        ...state, loaded: false,
      };
    default:
      return state;
  }
}
