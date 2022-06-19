import Toast from 'react-native-toast-message';
import {firebase} from '@react-native-firebase/database';
export const endpoints = {
  notification_server: 'http://159.223.37.196:27500/realtime-server',
  client_service: `http://159.223.37.196:27900/client/api`,
  fundi_service: `http://159.223.37.196:27800/fundi/api`,
  firebase_database: `https://jenzi-1234d-default-rtdb.asia-southeast1.firebasedatabase.app/`,
  notification_base: 'http://159.223.37.196:27500',
  jenzi_backend: `http://159.223.37.196:18300`,
};

export const firebase_db = firebase.app().database(endpoints.firebase_database);

export const errorMessage = err => {
  if (err.response) {
    const {data, status} = err.response;
    console.log(data);
    Toast.show({
      type: 'error',
      text1: status === 403 ? 'Bad credetials' : 'Request failed',
      text2:
        status === 403
          ? 'Invalid email/phone and password provided'
          : data.message,
      position: 'bottom',
    });
  } else {
    console.log('AXIOS CALL ERROR: ', err);
    Toast.show({
      type: 'error',
      text1: 'Service unavailable',
      text2: 'Check your network and try again later',
    });
  }
};

export const axios_endpoint_error = error => {
  if (error?.response) {
    console.log(error.response.data);
    Toast.show({
      type: 'error',
      text1: 'Request Error',
      text2: `${error?.response?.data}`,
      position: 'bottom',
    });
  } else {
    console.log('AXIOS CALL ERROR: ', err);
    Toast.show({
      type: 'error',
      text1: 'Service unavailable',
      text2: 'Check your network and try again later',
    });
  }
};
