import React from 'react';

import {store} from '../../App';
import {fundiActions, task_actions, UISettingsActions} from '../store-actions';
import Toast from 'react-native-toast-message';
import {ToastAndroid} from 'react-native';
import {pusher_filters} from '../constants';
import axios from 'axios';
import {endpoints} from '../endpoints';

//pusher
import {connectToChannel} from '.';

const consumeUserInfo = user_id => {
  //const dispatch = useDispatch();

  const binder = connectToChannel(user_id);
  binder.bind('pusher:subscription_succeeded', () => {
    console.log(
      'Channel has been established between client and pusher servers',
    );
    //  USER ACCEPTED
    binder.bind(pusher_filters.request_user, data => {
      const {payload, sourceAddress, destinationAddress, requestId} = data;
      axios
        .delete(`${endpoints.notification_server}/notify/${requestId}`)
        .then(() => 'done')
        .then(async re => {
          const client = await axios.get(
            `${endpoints.client_service}/clients/${sourceAddress}`,
          );
          console.log(client.data);
        })
        .catch(err => {
          console.log('===== PROJECT CREATION ERROR =======', err);
          Toast.show({
            type: 'error',
            text1:
              'We cannot initiate a direct link between you and the fundi. Please try again later',
          });
        });
    });
    // USER REQUEST TIMEDOUT
    binder.bind(pusher_filters.request_user_timedout, data => {
      store.dispatch(fundiActions.delete_current_requests(data));
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

export {consumeUserInfo};
