import React from 'react';
import {
  Linking,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const hasLocationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
  if (status === PermissionsAndroid.RESULTS.DENIED)
    ToastAndroid.show('Location denied by the user', ToastAndroid.LONG);
  else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
    ToastAndroid.show(
      'Permissions will never be requested again',
      ToastAndroid.LONG,
    );
  return false;
};

const getCurrentLocation = () => {
  return new Promise(async (res, err) => {
    const permitted = await hasLocationPermission();
    if (!permitted) return;

    Geolocation.getCurrentPosition(
      position => {
        res(position);
      },
      error => {
        err(error);
      },
      {
        showLocationDialog: true,
      },
    );
  });
};

export {getCurrentLocation};
