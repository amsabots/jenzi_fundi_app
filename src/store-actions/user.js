const user_data_actions = {
  create_user: function (payload) {
    return {
      type: 'CREATE_USER',
      payload,
    };
  },
  update_user: function (user_object) {
    return {
      type: 'UPDATE_USER',
      payload: user_object,
    };
  },
  delete_user: function () {
    return {
      type: 'REMOVE_USER',
    };
  },
};

export {user_data_actions};
