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
  update_coordinates: function (latitude, longitude) {
    return {
      type: 'UPDATE_POINTS',
      payload: {
        latitude,
        longitude,
      },
    };
  },

  update_scan_radius: function (scan_radius) {
    return {
      type: 'UPDATE_SEARCH_RADIUS',
      payload: scan_radius,
    };
  },
};

export {user_data_actions};
