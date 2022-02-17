import {combineReducers} from 'redux';
import {UISettings} from './ui-store';
import {fundisData} from './fundis';
import {transactions} from './transactions';
import {user_data} from './user';
import {tasks} from './tasks';
import {chats} from './chats';

const allReducers = combineReducers({
  ui_settings: UISettings,
  fundis: fundisData,
  transactions,
  user_data,
  tasks,
  chats,
});

export {allReducers};
