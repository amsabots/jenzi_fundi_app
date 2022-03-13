import React from 'react';
import {store} from '../../App';
import {
  clientActions,
  fundiActions,
  task_actions,
  UISettingsActions,
} from '../store-actions';
import Toast from 'react-native-toast-message';
import {ToastAndroid} from 'react-native';
import {pusher_filters} from '../constants';
import axios from 'axios';
import {endpoints} from '../endpoints';
import {popPushNotification} from '../notifications';

//pusher
import {connectToChannel} from '.';
import {debounce} from '../config';

const consumeUserInfo = user_id => {
  //const dispatch = useDispatch();
  let tracker = '';
  const binder = connectToChannel(user_id);

  binder.bind('pusher:subscription_succeeded', () => {
    console.log(
      'Channel has been established between client and pusher servers',
    );
    //  USER ACCEPTED
    binder.bind(pusher_filters.request_user, data => {
      debounce(handle_incoming_request(data), 2000, true);
    });

    // USER REQUEST TIMEDOUT
    binder.bind(pusher_filters.request_user_timedout, data => {
      expire_alert();
      Toast.show({
        type: 'info',
        text2: `Unable to receive immediate response from the user. We try later, you can cancel and request for another fundi`,
        onHide: () =>
          ToastAndroid.show(
            'Fundi not available at this moment, Please try again later',
            ToastAndroid.LONG,
          ),
      });
    });
  });
};

const expire_alert = () => {
  store.dispatch(clientActions.expire_request());
  popPushNotification(
    `Delay in responding`,
    `A request sent earlier has expired before you responded. Kindly make sure you respond to any jenzi alert within a time span of less than a minute`,
  );
};

const handle_incoming_request = data => {
  console.log(`============ ACTUAL EXECUTION ==============`);
  const {payload, sourceAddress, requestId} = data;
  axios
    .get(`${endpoints.client_service}/clients/${sourceAddress}`)
    .then(client => {
      const {data} = client;
      popPushNotification(
        'New job request',
        `${data.name} is requesting your services for ${payload.title}. Open the app to accept or decline`,
      );
      store.dispatch(clientActions.create_new_rqeuest(requestId, payload));
      store.dispatch(clientActions.active_client(data));
    })
    .catch(err => {
      console.log(err);
    });
};

export const delete_current_request = requestId => {
  axios
    .delete(`${endpoints.notification_server}/notify/${requestId}`)
    .then(res => {
      console.log(
        `[file: project-info] [action: deleting request] [info: message deleted]`,
      );
    })
    .catch(er => {
      throw err;
    });
};

export {consumeUserInfo};
