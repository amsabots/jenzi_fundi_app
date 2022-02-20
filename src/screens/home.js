import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, BackHandler, ToastAndroid} from 'react-native';

//bottom sheet
import BottomSheet from '@gorhom/bottom-sheet';
import {Banner} from 'react-native-paper';

// redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions} from '../store-actions';

//components
import {COLORS, SIZES} from '../constants/themes';

// subscribtions
import {consume_from_pusher} from '../pusher';
import {screens} from '../constants';

//test UIs
import {ProjectInfo} from '.';

const mapStateToProps = state => {
  const {user_data, clientsData} = state;
  return {user_data, clientsData};
};

const Home = ({navigation, user_data, clientsData}) => {
  // back button Handler
  let backHandlerClickCount = 0;
  const backButtonHandler = () => {
    const shortToast = message => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    backHandlerClickCount += 1;
    if (backHandlerClickCount < 2) {
      shortToast('Press again to quit the application');
    } else {
      BackHandler.exitApp();
    }

    // timeout for fade and exit
    setTimeout(() => {
      backHandlerClickCount = 0;
    }, 1000);

    return true;
  };

  const subscribe_to_instances = useCallback(() => {
    consume_from_pusher(user_data.user.accountId);
  }, []);

  const dispatch = useDispatch();

  //run on the first screen render
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    //connect to pusher channel
    subscribe_to_instances();
  }, []);

  //track changes on the clients data object
  useEffect(() => {
    console.log(clientsData);
  }, [clientsData]);

  useFocusEffect(
    useCallback(() => {
      //check if the user has all information setup
      const {user} = user_data;
      if (!user.latitude) navigation.navigate(screens.location_picker);
      dispatch(UISettingsActions.status_bar(false));
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }, [user_data]),
  );

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(mapStateToProps)(Home);
