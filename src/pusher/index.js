import {consumeUserInfo} from './project-ops';
import Pusher from 'pusher-js/react-native';
import {app_config} from '../config';
import {subscribe_job_states} from './fb-projects';

const {PUSHER_CLUSTER, PUSHER_KEY} = app_config.pusher_config;

export const connectToChannel = user_id => {
  const pusher = new Pusher(PUSHER_KEY, {cluster: PUSHER_CLUSTER});
  const channel = pusher.subscribe(user_id);
  return channel;
};

export const consume_from_pusher = user_id => {
  consumeUserInfo(user_id);
};

export {subscribe_job_states};
