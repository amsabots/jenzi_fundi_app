export const chat_actions = {
  load_chat_rooms: function (chat_rooms) {
    return {payload: chat_rooms, type: 'LOAD_CHAT_ROOMS'};
  },
};
