export const chat_actions = {
  load_chat_rooms: function (chat_rooms) {
    return {payload: chat_rooms, type: 'LOAD_CHAT_ROOMS'};
  },
  load_chats: function (new_chats) {
    return {payload: new_chats, type: 'LOAD_NEW_CHATS'};
  },
  load_more_chats: function (more_chats) {
    return {payload: more_chats, type: 'lOAD_MORE_CHATS'};
  },
  update_page: function (current_page, page_size = 20) {
    return {
      type: 'UPDATE_PAGE',
      payload: {
        current_page,
        page_size,
      },
    };
  },
};
