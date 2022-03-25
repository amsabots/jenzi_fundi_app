import {store} from '../../App';
import {endpoints, firebase_db} from '../endpoints';
import {chat_actions} from '../store-actions';
import axios from 'axios';
axios.defaults.baseURL = endpoints.client_service;

const logger = console.log.bind(console, `[file: chats.js]`);

export const subscribe_to_chatrooms = current_user => {
  firebase_db
    .ref(`/chatrooms/${current_user}`)
    .once('value')
    .then(async snapshot => {
      if (snapshot.exists()) {
        const d = snapshot.toJSON();
        const chat_room = [];
        for (const [key, value] of Object.entries(d)) {
          try {
            const chatroom = key;
            const partyB = value.partyB;
            const req_client = await axios.get(`/clients/${partyB}`);
            chat_room.push({chatroom, client: req_client.data});
          } catch (error) {
            logger(`[error: ${error}]`);
          }
        }
        store.dispatch(chat_actions.load_chat_rooms(chat_room));
      }
    });
};

// firebase_db
//   .ref(`/chats/${chatroom}`)
//   .limitToLast(1)
//   .once('value')
//   .then(s => {
//     if (s.exists()) {
//       const chat_id = Object.keys(s.toJSON())[0];
//       const data = s.toJSON()[chat_id];
//       console.log(chat_id, data);
//     }
//   });
