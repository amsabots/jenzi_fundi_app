import {endpoints, firebase_db} from '../endpoints';
import {popPushNotification} from '../notifications';
import axios from 'axios';
import {store} from '../../App';
import {clientActions} from '../store-actions';

const logger = console.log.bind(console, `[file: fb-projects.js]`);

//request cancelled or it came in and expired
// return popPushNotification(
//   `Light note`,
//   `A request came in while your device was offline or disconnected. Kindly keep you device on the line for alerts`,
// );

export const subscribe_job_states = user => {
  logger(`[message: The system has been bound to firebase job states channel]`);
  firebase_db
    .ref(`/jobalerts/${user.accountId}`)
    .on('value', async snapshot => {
      if (snapshot.exists()) {
        const {event, requestId, createdAt} = snapshot.toJSON();
        const res = await axios.get(
          `${endpoints.notification_base}/jobs/requests/${requestId}`,
        );
        const elapsed_seconds = Math.floor(
          (new Date().getTime() - createdAt) / 1000,
        );
        console.log(elapsed_seconds);
        if (elapsed_seconds > 120) return;
        switch (event) {
          case 'JOBREQUEST':
            if (res.data) {
              const {payload, user} = res.data;
              popPushNotification(
                'New job request',
                `${user.name} is requesting your services for ${payload.title}. Open the app to accept or decline`,
              );
              store.dispatch(
                clientActions.create_new_rqeuest(requestId, payload),
              );
              store.dispatch(clientActions.active_client(user));
            }
            break;
          case 'PROJECTTIMEOUT':
            await firebase_db.ref(`/jobalerts/${user.accountId}`).remove();
            store.dispatch(clientActions.expire_request());
            popPushNotification(
              `Delay in responding`,
              `A request sent earlier has expired before you responded. Kindly make sure you respond to any jenzi alert within a time span of less than a minute`,
            );
          default:
            return null;
        }
      }
    });
};

export const jobUtils = {
  delete_entry: async function (accountId) {
    await firebase_db.ref(`/jobalerts/${accountId}`).remove();
  },
  update_client: async function client_alerts(alert, client_id, job_id) {
    await firebase_db.ref(`/jobalerts/${client_id}`).update({
      createdAt: new Date().getTime(),
      event: alert,
      requestId: job_id,
    });
  },
};
