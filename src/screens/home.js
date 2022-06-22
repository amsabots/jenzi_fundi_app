import React, {useEffect, useState, useCallback, memo} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, BackHandler, ToastAndroid, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {offline_data} from '../constants';

//bottom sheet

// redux store
import {useDispatch, connect} from 'react-redux';
import {chat_actions, UISettingsActions} from '../store-actions';

//components
import {COLORS, FONTS, SIZES} from '../constants/themes';

// subscribtions
import {screens} from '../constants';

//Icons
import EvilCons from 'react-native-vector-icons/EvilIcons';
import IoIcons from 'react-native-vector-icons/Ionicons';
import ProjectAlert from './sub-components/project-info';
import {LoaderSpinner} from '../components';
import {Chip, Divider, Card, ProgressBar} from 'react-native-paper';
// sub view components
import {
  HomeSummaryInfo,
  AccountStarRating,
} from './sub-components/home-summary-info';
import {chats} from '../../store/chats';
import axios from 'axios';
import {endpoints} from '../endpoints';
axios.defaults.baseURL = endpoints.jenzi_backend + `/jenzi/v1`;

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

const Home = memo(({navigation, user_data, clientsData, tasks}) => {
  const {user} = user_data;

  // component state variables
  const [load, setLoad] = useState(false);
  const [activeClient, setActiveClient] = useState({});
  const [project, set_project] = useState(0);
  const [completed_projects, set_completed_projects] = useState(0);
  const [reviews, set_reviews] = useState(0);

  const fetch_from_offline = async () => {
    const client = await AsyncStorage.getItem(
      offline_data.current_project_user,
    );
    setActiveClient(JSON.parse(client));
  };

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

  const dispatch = useDispatch();

  // UI data pipeline
  const fetch_latest_user_profile_ui_data = () => {
    setLoad(true);
    axios
      .get(`/fundi-tasks/user/${user.id}`)
      .then(res => res.data.data)
      .then(async res => {
        const {data: reviews_data} = await axios.get(
          `/fundi-reviews/fundi/${user.id}`,
        );
        set_project(res);
        const completed = res.filter(el => el.state === 'Complete');
        set_completed_projects(completed);
        set_reviews(reviews_data.data);
      })
      .finally(() => setLoad(false));
  };

  //run on the first screen render
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    //update home UI
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
      fetch_from_offline();
      fetch_latest_user_profile_ui_data();
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
        setLoad(false);
        setActiveClient({});
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
      {load && (
        <ProgressBar
          color={COLORS.secondary}
          style={{width: '100%'}}
          indeterminate
        />
      )}
      {/* ============ CONTENT AREA ================= */}
      <View style={styles.content}>
        {Object.keys(activeClient || {}).length ? (
          <View style={styles._summary_header}>
            <Text style={{...FONTS.caption}}>
              Active project with{' '}
              <Text style={{...FONTS.captionBold}}>
                {activeClient.name.toUpperCase()}
              </Text>
            </Text>
            <Chip
              style={{
                backgroundColor: COLORS.secondary,
                marginLeft: SIZES.base,
              }}
              onPress={() => {
                dispatch(chat_actions.active_chat(activeClient));
                navigation.navigate(screens.conversation);
              }}>
              <Text style={{...FONTS.caption, color: COLORS.white}}>
                Open chats
              </Text>
            </Chip>
          </View>
        ) : null}
        <Divider style={{marginVertical: SIZES.padding_12}} />
        {/* ================ END OF HEADER SECTION =================== */}
        <View style={{flexDirection: 'row'}}>
          <Card
            style={{
              height: 120,
              padding: SIZES.padding_16,
              flexGrow: 1,
              backgroundColor: COLORS.secondary,
              marginRight: SIZES.base,
            }}>
            <Text style={{...FONTS.body_bold, color: COLORS.white}}>
              Total projects
            </Text>
            <View style={styles._details_value}>
              <Text style={styles._details_value_txt}>
                {project.length || 0}
              </Text>
            </View>
          </Card>
          <Card
            style={{
              height: 120,
              padding: SIZES.padding_16,
              flexGrow: 1,
              backgroundColor: COLORS.blue_deep,
            }}>
            <Text style={{...FONTS.body_bold, color: COLORS.white}}>
              Completed
            </Text>
            <View style={styles._details_value}>
              <Text style={styles._details_value_txt}>
                {completed_projects.length || 0}
              </Text>
            </View>
          </Card>
        </View>
        {/* ============== END OF THE PROJECTS SUMMARY INFO ============ */}
        <HomeSummaryInfo />
        <Divider />
        <AccountStarRating
          navigation={navigation}
          reviews={reviews}
          user={user}
        />
      </View>
      <ProjectAlert navigation={navigation} />
    </View>
  );
});

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
  _summary_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  _details_value: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  _details_value_txt: {
    ...FONTS.h6,
    color: COLORS.white,
  },
});

export default connect(mapStateToProps)(Home);
