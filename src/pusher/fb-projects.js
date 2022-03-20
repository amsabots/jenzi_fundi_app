import {firebase_db} from '../endpoints';
const logger = console.log.bind(console, `[file: fb-projects.js]`);

export const subscribe_job_states = user => {
  logger(`[message: The system has been bound to firebase job states channel]`);
  firebase_db.ref(`/jobalerts/${user.accountId}`).on('value', snapshot => {
    if (snapshot.exists()) {
      const {event, requestId} = snapshot.toJSON();
      console.log(event, requestId);
    }
  });
};
