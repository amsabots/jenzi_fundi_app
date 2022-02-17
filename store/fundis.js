import _ from 'lodash';

const initialState = {
  fundis: [],
  selected_fundi: {},
  sent_requests: [],
};

const fundisData = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ADD_FUNDIS':
      console.log('fundis added.....');
      return {...state, fundis: payload};
    case 'UPDATE_FUNDI':
      console.log('updating.....');
      const index = state.fundis.indexOf(payload);
      if (i > -1) {
        console.log('fundi entry updated.....');
        const newfundi = {...state.fundis[index], ...payload};
        state.fundis[index] = newfundi;
      }
      return state;
    case 'REMOVE_FUNDI':
      console.log('fundi entry removed.....');
      const i = state.fundis.indexOf(payload);
      if (i < 0)
        return {...state, fundis: state.fundis.filter((_, idx) => idx !== i)};
      return state;
    case 'TEST_FUNDI':
      console.log('fundi store is listening');
      return state;
    case 'SET_FUNDI':
      console.log('redux: setting  selected fundi....');
      return {...state, selected_fundi: payload};
    case 'GET_SENT_REQUESTS':
      return {...state, sent_requests: [...state.sent_requests, ...payload]};
    case 'REMOVE_SENT_REQUEST':
      const a = state.sent_requests;
      _.remove(a, el => el.requestId === payload.requestId);
      return {...state, sent_requests: a};
    default:
      return state;
  }
};
export {fundisData};
