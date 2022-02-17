import _ from 'lodash';
const initialState = {
  transactions: [],
};

const transactions = (state = initialState, action) => {
  const {type, payload} = action;
  let current = null;
  switch (type) {
    case 'ADD_TRANSACTIONS':
      console.log('adding available transactions....');
      return {...state, transactions: [...state.transactions, ...payload]};
    case 'REMOVE_TRANSACTION':
      current = state.transactions;
      _.remove(current, e => e.transactionId === payload.transactionId);
      return {...state, transactions: current};
    case 'UPDATE_TRANSACTION':
      let u_item = state.transactions.find(
        i => i.transactionId === payload.transactionId,
      );
      const u_index = state.transactions.indexOf(u_item);
      u_item = {...u_item, ...payload};
      state.transactions[u_index] = u_item;
      return {...state, transactions};

    default:
      return state;
  }
};

export {transactions};
