import Toast from 'react-native-toast-message';
export const endpoints = {
  notification_server: 'http://18.217.178.254:27500/realtime-server',
  client_service: `http://18.217.178.254:27900/client/api`,
  fundi_service: `http://18.217.178.254:27800/fundi/api`,
};

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
