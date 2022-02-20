const clientActions = {
  set_active_client: function (client_info) {
    return {
      type: 'SET_ACTIVE_CLIENT',
      payload: client_info,
    };
  },
};
export {clientActions};
