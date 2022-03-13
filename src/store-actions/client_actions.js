const clientActions = {
  create_new_rqeuest: function (requestId, request_payload) {
    return {
      type: 'ADD_CLIENT_REQUEST',
      payload: {requestId, ...request_payload},
    };
  },
  expire_request: function () {
    return {
      type: 'EXPIRE_REQUEST',
    };
  },
  accepted_request: function (accept_request) {
    return {
      type: 'SET_ACCEPTED_TASK',
      payload: accept_request,
    };
  },
  //SET_ACTIVE_CLIENT
  active_client: function (client_info) {
    return {
      type: 'SET_ACTIVE_CLIENT',
      payload: client_info,
    };
  },
};
export {clientActions};
