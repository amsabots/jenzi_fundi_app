const initialState = {
  chats: [],
  chat_rooms: [],
  selected_chat: {},
};

export const chats = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ACTIVE_CHAT':
      return {...state, selected_chat: payload};
    case 'LOAD_CHAT_ROOMS':
      return {...state, chat_rooms: payload};
    case 'LOAD_NEW_CHATS':
      return {...state, chats: payload};
    case 'lOAD_MORE_CHATS':
      return {...state, chats: [...state.chats, ...payload]};
    default:
      return state;
  }
};
