import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, BackHandler, ToastAndroid} from 'react-native';
import {getCurrentLocation} from '../config/current-location';

//bottom sheet
import BottomSheet from '@gorhom/bottom-sheet';
import {Banner} from 'react-native-paper';

// redux store
import {useDispatch, connect} from 'react-redux';
import {
  fundiActions,
  UISettingsActions,
  user_data_actions,
} from '../store-actions';

//components
import {MapView} from '../components';
import {COLORS, SIZES} from '../constants/themes';

//icons
import MIcons from 'react-native-vector-icons/MaterialIcons';

//building blocks
import {HomeBottomSheetContent} from './ui-views';
import {ScrollView} from 'react-native-gesture-handler';

// subscribtions
import {connectToChannel, consume_from_pusher} from '../pusher';
import {screens} from '../constants';

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

  return <View style={[styles.container]}>{/* Map container */}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _map_container: {
    height: '65%',
  },
  _hamburger: {
    top: SIZES.padding_32,
    left: SIZES.icon_size,
  },
  _fab_container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.white,
    zIndex: 10,
    height: 48,
    width: 48,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 1.5,
    elevation: 4,
  },
  _returnTocurrentPosition: {
    bottom: SIZES.padding_32,
    right: SIZES.icon_size,
  },
});

export default connect(mapStateToProps)(Home);
