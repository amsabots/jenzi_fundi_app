export const transactionActions = {
  add_transaction: function (transactionArray) {
    return {
      type: 'ADD_TRANSACTIONS',
      payload: transactionArray,
    };
  },
  remove_transaction: function (transactionObject) {
    return {
      type: 'REMOVE_TRANSACTION',
      payload: transactionObject,
    };
  },
  remove_transaction: function (transactionObject) {
    return {
      type: 'UPDATE_TRANSACTION',
      payload: transactionObject,
    };
  },
};
