const initialState = {
  statuses: [], errors: [], responseMsgs: [],
};

const GET_STATUSES = 'Get statuses';
const CREATE_STATUS = 'Create status';
const UPDATE_STATUS = 'Update status';
const DELETE_STATUS = 'Delete status';
const IS_ACTIVE = 'Is active';
const REFRESH = 'Refresh';

function getStatuses(result) {
  return {
    type: GET_STATUSES,
    payload: {
      statuses: result.statuses,
      inboxCount: result.inboxCount,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}
function createStatus(response) {
  return {
    type: CREATE_STATUS,
    payload: {
      createdStatus: response.createdStatus,
      errors: response.errors,
      responseMsgs: response.responseMsgs,
    },
  };
}

function updateStatus(response) {
  return {
    type: UPDATE_STATUS,
    payload: {
      updatedStatus: response.updatedStatus,
      errors: response.errors,
      responseMsgs: response.responseMsgs,
    },
  };
}

function deleteStatus(response) {
  return {
    type: DELETE_STATUS,
    payload: {
      deletedStatusID: response.deletedStatusID,
      errors: response.errors,
      responseMsgs: response.responseMsgs,
    },
  };
}


export function isStatusActive(item) {
  return {
    type: IS_ACTIVE, payload: { isActive: true, id: item._id },
  };
}

function refreshStatus(result) {
  return {
    type: REFRESH,
    payload: {
      statuses: result.statuses,
      inboxCount: result.inboxCount,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
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

export function asyncCreateStatus(newStatus) {
  return function asyncCreateStatusInner(dispatch) {
    fetch('http://localhost:3000/api/statuses', {
      method: 'POST',
      body: JSON.stringify(newStatus),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(createStatus(result));
      }).catch(() => {});
  };
}

export function asyncUpdateStatus(body) {
  const updatedStatus = { id: body.id, statusName: body.statusName };
  return function asyncUpdateStatusInner(dispatch) {
    fetch(`http://localhost:3000/api/statuses/${updatedStatus.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedStatus),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(updateStatus(result));
      }).catch(() => {});
  };
}

export function asyncDeleteStatus(id) {
  return function asyncDeleteStatusInner(dispatch) {
    fetch(`http://localhost:3000/api/statuses/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(deleteStatus(result));
      }).catch(() => {});
  };
}

export function asyncRefreshStatuses() {
  return function asyncRefreshInner(dispatch) {
    fetch('http://localhost:3000/api/statuses', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(refreshStatus(result));
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
        statuses: payload.statuses.map(status =>
          Object.assign({}, status, { isActive: !!status.isActive })),
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
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
    case CREATE_STATUS: {
      const statuses = payload.createdStatus._id ? [
        ...state.statuses,
        Object.assign({}, payload.createdStatus, { isActive: false }),
      ] : state.statuses;
      return {
        ...state,
        statuses,
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case UPDATE_STATUS:
      return {
        ...state,
        statuses: state.statuses.map((status) => {
          if (status._id === payload.updatedStatus._id.toString()) {
            status.name = payload.updatedStatus.name;
          }
          return status;
        }),
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    case DELETE_STATUS: {
      const statusesAfterDelete = state.statuses
        .filter(status => status._id !== payload.deletedStatusID);
      return {
        ...state,
        statuses: statusesAfterDelete,
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    }
    case REFRESH:
      return {
        ...state,
        statuses: [
          ...payload.statuses
            .map(status => Object.assign({}, status, { isActive: !!status.isActive }))],
        errors: payload.errors,
        responseMsgs: payload.responseMsgs,
      };
    default:
      return state;
  }
}
