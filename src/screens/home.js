import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, BackHandler, ToastAndroid, Text} from 'react-native';

//bottom sheet

// redux store
import {useDispatch, connect} from 'react-redux';
import {chat_actions, task_actions, UISettingsActions} from '../store-actions';

//components
import {COLORS, FONTS, SIZES} from '../constants/themes';

// subscribtions
import {consume_from_pusher} from '../pusher';
import {screens} from '../constants';

//Icons
import EvilCons from 'react-native-vector-icons/EvilIcons';
import IoIcons from 'react-native-vector-icons/Ionicons';
import ProjectAlert from './sub-components/project-info';
import {LoaderSpinner, LoadingNothing} from '../components';

const logger = console.log.bind(console, '[home.js: Home screen] ');

const mapStateToProps = state => {
  const {user_data, clientsData, tasks} = state;
  return {user_data, clientsData, tasks};
};

export const LoaderView = (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <LoaderSpinner.ArcherLoader size={180} loading={true} />
    <Text>Fetching projects......</Text>
  </View>
);

const Home = ({navigation, user_data, clientsData, tasks}) => {
  const {selected_job} = tasks;
  const {user} = user_data;
  // component state variables
  const [load, setLoad] = useState(false);

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
    return () => {
      setLoad(false);
    };
  }, []);

  //track changes on the clients data object
  // useEffect(() => {}, [clientsData]);

  useFocusEffect(
    useCallback(() => {
      //check if the user has all information setup
      if (!user.latitude) navigation.navigate(screens.location_picker);
      dispatch(UISettingsActions.status_bar(false));
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
        setLoad(false);
      };
    }, [user_data]),
  );

  return (
    <View style={styles.container}>
      {/* ============= HEADER AREA =========== */}
      <View style={styles.header}>
        {/* ========= badge notification counter ======== */}
        <IoIcons
          name="md-menu-outline"
          size={SIZES.padding_32}
          color={COLORS.secondary}
          onPress={() => navigation.openDrawer()}
        />
        <Text style={{...FONTS.body1, color: COLORS.secondary}}>
          Jenzi Smart
        </Text>
        <View>
          <EvilCons
            name="bell"
            size={SIZES.padding_32}
            color={COLORS.secondary}
          />
          {/* <Badge size={SIZES.base} style={styles._badge} /> */}
        </View>
      </View>
      <View style={styles._account_status_banner}>
        <Text style={styles._account_status_banner_text}>
          Your account profile is public
        </Text>
      </View>
      {/* ============ CONTENT AREA ================= */}
      <View style={styles.content}></View>
      <ProjectAlert />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: SIZES.padding_12,
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding_16,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  _badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
    paddingTop: SIZES.padding_12,
    paddingHorizontal: SIZES.padding_16,
  },
  _listen_projects_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  _account_status_banner: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.light_secondary,
  },
  _account_status_banner_text: {
    ...FONTS.caption,
  },
});

export default connect(mapStateToProps)(Home);
