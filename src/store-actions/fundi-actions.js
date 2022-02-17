const fundiActions = {
  add_fundi: function (fundis) {
    return {
      type: 'ADD_FUNDIS',
      payload: fundis,
    };
  },
  update_fundi: function (fundiObject) {
    return {
      type: 'UPDATE_FUNDI',
      payload: fundiObject,
    };
  },
  remove_fundi: function (fundiObject) {
    return {
      type: 'REMOVE_FUNDI',
      payload: fundiObject,
    };
  },

  test_store: function () {
    return {type: 'TEST_FUNDI'};
  },
  set_selected_fundi: function (selected_fundi) {
    return {
      type: 'SET_FUNDI',
      payload: selected_fundi,
    };
  },
  get_all_Sent_requests: function (sent_requests) {
    return {
      type: 'GET_SENT_REQUESTS',
      payload: sent_requests,
    };
  },
  delete_current_requests: function (request) {
    return {
      type: 'REMOVE_SENT_REQUEST',
      payload: request,
    };
  },
};
export {fundiActions};
