import {store} from '../../App';
import {endpoints, firebase_db} from '../endpoints';
import {chat_actions} from '../store-actions';
import axios from 'axios';
axios.defaults.baseURL = endpoints.client_service;

const logger = console.log.bind(console, `[file: chats.js]`);

export const subscribe_to_chatrooms = current_user => {
  firebase_db.ref(`/chatrooms/${current_user}`).on('value', async snapshot => {
    if (snapshot.exists()) {
      const d = snapshot.toJSON();
      for (const [key, value] of Object.entries(d)) {
        const chatroom = key;
        const partyB = value.partyB;
        const req_client = await axios.get(`/clients/${partyB}`);
        const req_last_item = firebase_db
          .ref(`/chats/${chatroom}`)
          .limitToLast(1);
      }
    }
  });
};
