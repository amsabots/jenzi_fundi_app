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
    case 'ACTIVE_CHAT':
      return {...state, selected_chat: payload};
    case 'UPDATE_PAGE':
      return {...state, pager: {payload}};
    case 'LOAD_CHAT_ROOMS':
      return {...state, chat_rooms: payload};
    default:
      return state;
  }
};
