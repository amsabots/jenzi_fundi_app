import _ from 'lodash';
import axios from 'axios';
axios.defaults.timeout = 10000;
import {endpoints} from '../endpoints';
const logger = console.log.bind(console, '[Redux:Chats ]');

export const load_chat_rooms = async partyA_id => {
  try {
    const res = await axios.get(
      `${endpoints.fundi_service}/chats/lastItem/${partyA_id}`,
    );
    logger(
      `[info: Done loading the user chat rooms] [found: ${res.data.length}]`,
    );
    return res.data;
  } catch (error) {
    logger(`[error: failed loading chats] [message: ${error.response.data}]`);
    return [];
  }
};
