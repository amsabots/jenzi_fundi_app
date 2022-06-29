import {endpoints, firebase_db} from '../endpoints';
import {popPushNotification} from '../notifications';
import axios from 'axios';
import {store} from '../../App';
import {chat_actions, clientActions, UISettingsActions} from '../store-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {offline_data, screens} from '../constants';

const logger = console.log.bind(console, `[file: fb-projects.js]`);

//request cancelled or it came in and expired
// return popPushNotification(
//   `Light note`,
//   `A request came in while your device was offline or disconnected. Kindly keep you device on the line for alerts`,
// );

export const subscribe_job_states = (user, navigation) => {
  logger(`[message: The system has been bound to firebase job states channel]`);
  firebase_db
    .ref(`/jobalerts/${user.account_id}`)
    .on('value', async snapshot => {
      if (!snapshot.exists()) {
        return store.dispatch(clientActions.expire_request());
      }
      const {event, requestId, createdAt} = snapshot.toJSON();
      const res = await axios.get(
        `${endpoints.notification_base}/jobs/requests/${requestId}`,
      );
      const elapsed_seconds = Math.floor(
        (new Date().getTime() - createdAt) / 1000,
      );
      if (elapsed_seconds > 120) return;
      switch (event.trim()) {
        case 'JOBREQUEST':
          if (res.data) {
            const {payload, user: client} = res.data;
            popPushNotification(
              'New job request',
              `${client.name} is requesting your services for ${payload.title}. Open the app to accept or decline`,
            );
            store.dispatch(
              clientActions.create_new_rqeuest(requestId, payload),
            );
            console.log(client);
            store.dispatch(clientActions.active_client(client));
          }
          break;
        case 'PROJECTTIMEOUT':
          store.dispatch(clientActions.expire_request());
          popPushNotification(
            `Delay in responding`,
            `A request sent earlier has expired before you responded. Kindly make sure you respond to any jenzi alert within a time span of less than a minute`,
          );
          await firebase_db.ref(`/jobalerts/${user.account_id}`).remove();
          break;
        case 'ACK':
          const {
            clientsData: {selected_client},
            user_data,
          } = store.getState();
          console.error('ACTIVE CLIENT ', store.getState().clientsData);
          await AsyncStorage.setItem(
            offline_data.current_project_user,
            JSON.stringify(selected_client || {}),
          );
          store.dispatch(
            UISettingsActions.toggle_snack_bar(
              `Congratulations ${user_data.user.name}, new project has been initiated`,
            ),
          );
          await jobUtils.delete_entry(user.account_id);
          store.dispatch(chat_actions.active_chat(selected_client || {}));
          store.dispatch(clientActions.expire_request());
          navigation.navigate(screens.conversation);
          break;
        default:
          return null;
      }
    });
};

export const jobUtils = {
  delete_entry: async function (account_id) {
    await firebase_db.ref(`/jobalerts/${account_id}`).remove();
  },
  update_client: async function client_alerts(alert, client_id, job_id) {
    await firebase_db.ref(`/jobalerts/${client_id}`).update({
      createdAt: new Date().getTime(),
      event: alert,
      requestId: job_id,
    });
  },
};
