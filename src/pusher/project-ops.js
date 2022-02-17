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

const consumeUserInfo = c => {
  //const dispatch = useDispatch();

  const binder = connectToChannel(c);
  binder.bind('pusher:subscription_succeeded', () => {
    console.log(
      'Channel has been established between client and puhser servers',
    );
    //  USER ACCEPTED
    binder.bind(pusher_filters.user_accepted, data => {
      const {payload, sourceAddress, destinationAddress, requestId} = data;
      console.log(requestId);
      axios
        .delete(`${endpoints.notification_server}/notify/${requestId}`)
        .then(() => 'done')
        .then(async re => {
          axios
            .post(
              `${endpoints.client_service}/jobs`,
              {
                title: payload.title,
                fundiId: sourceAddress,
                client: {
                  id: store.getState().user_data.user.id,
                },
              },
              {timeout: 30000},
            )
            .then(f => {
              store.dispatch(task_actions.add_job_entry([f.data]));
              store.dispatch(UISettingsActions.show_project_banner(f.data));
              return ToastAndroid.showWithGravity(
                'Connection between you and the fundi has been set - You can freely chat on our messenger platform and track the project independently',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
            });
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
