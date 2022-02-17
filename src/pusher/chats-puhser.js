import React from 'react';
import {store} from '../../App';
import {fundiActions} from '../store-actions';
import Toast from 'react-native-toast-message';
import {ToastAndroid} from 'react-native';
import {pusher_filters} from '../constants';
import axios from 'axios';
import {endpoints} from '../endpoints';

//pusher
import {connectToChannel} from '.';

const consumerIncomingChats = c => {
  //const dispatch = useDispatch()

  const binder = connectToChannel(c);
  binder.bind('pusher:subscription_succeeded', () => {
    console.log(
      'Channel has been established between client and puhser servers',
    );
    // USER REQUEST TIMEDOUT
    binder.bind(pusher_filters.new_message, data => {
      console.log(data);
    });
  });
};

export {consumerIncomingChats};
