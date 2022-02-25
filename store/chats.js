import _ from 'lodash';
import axios from 'axios';

const initialState = {
  chats: [],
  chat_rooms: [],
  selected_chat: {},
  pager: {
    current_page: 0,
    page_size: 20,
  },
};

export const chats = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'LOAD_CHAT_ROOMS':
      return {...state, chat_rooms: payload};
    case 'ACTIVE_CHAT':
      return {...state, selected_chat: payload};
    case 'UPDATE_PAGE':
      return {...state, pager: {payload}};
    default:
      return state;
  }
};
