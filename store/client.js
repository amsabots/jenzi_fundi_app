import _ from 'lodash';

const initialState = {
  client_request: {},
  selected_client: {},
  is_task_accepted: false,
  is_task_rejected: false,
  is_request_expired: false,
};

const clientsData = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ADD_CLIENT_REQUEST':
      console.log('new client request.....');
      return {...state, client_request: payload};
    case 'SET_ACTIVE_CLIENT':
      return {...state, selected_client: payload};
    case 'REMOVE_CLIENT_REQUEST':
      return {...state, client_request: {}};
    case 'SET_ACCEPTED_TASK':
      return {...state, is_task_accepted: payload};
    case 'SET_REJECTED_TASK':
      return {...state, is_task_rejected: payload};
    case 'SET_EXPIRED_TASK':
      return {...state, is_request_expired: payload};
    default:
      return state;
  }
};
export {clientsData};
