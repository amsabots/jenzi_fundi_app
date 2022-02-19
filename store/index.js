import {combineReducers} from 'redux';
import {UISettings} from './ui-store';
import {clientsData} from './client';
import {transactions} from './transactions';
import {user_data} from './user';
import {tasks} from './tasks';
import {chats} from './chats';

const allReducers = combineReducers({
  ui_settings: UISettings,
  clientsData,
  transactions,
  user_data,
  tasks,
  chats,
});

export {allReducers};
