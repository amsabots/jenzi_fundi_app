import _ from 'lodash';

const initialState = {
  client_request: {},
  selected_client: {},
  is_task_accepted: false,
};

const clientsData = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ADD_CLIENT_REQUEST':
      console.log('new client request.....');
      return {...state, client_request: payload};
    case 'SET_ACTIVE_CLIENT':
      console.log('set active client.....');
      return {...state, selected_client: payload};
    case 'SET_ACCEPTED_TASK':
      return {...state, is_task_accepted: payload};
    case 'EXPIRE_REQUEST':
      return initialState;
    default:
      return state;
  }
};
export {clientsData};
