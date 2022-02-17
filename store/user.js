import _ from 'lodash';

const initialState = {
  user: {},
  coordinates: {},
  scanRadius: 10,
};

const user_data = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'CREATE_USER':
      return {...state, user: payload};
    case 'UPDATE_USER':
      return {...state, user: {...state.user, ...payload}};
    case 'REMOVE_USER':
      return initialState;
    case 'UPDATE_POINTS': {
      return {
        ...state,
        coordinates: {latitude: payload.latitude, longitude: payload.longitude},
      };
    }
    case 'UPDATE_SEARCH_RADIUS':
      return {...state, scanRadius: payload};
    default:
      return state;
  }
};

export {user_data};
