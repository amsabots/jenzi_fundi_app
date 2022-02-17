import {consumeUserInfo} from './project-ops';
import {consumerIncomingChats} from './chats-puhser';
import Pusher from 'pusher-js/react-native';
import {app_config} from '../config';

const {PUSHER_CLUSTER, PUSHER_KEY} = app_config.pusher_config;

export const connectToChannel = c => {
  const pusher = new Pusher(PUSHER_KEY, {cluster: PUSHER_CLUSTER});
  const channel = pusher.subscribe(c);
  return channel;
};

export const consume_from_pusher = user_id => {
  consumeUserInfo(user_id);
  consumeUserInfo(user_id);
};
