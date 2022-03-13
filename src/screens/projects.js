import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ToastAndroid,
} from 'react-native';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {connect, useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import IonIcons from 'react-native-vector-icons/Ionicons';

//ui components
import {
  DefaultToolBar,
  LoaderSpinner,
  LoadingNothing,
  InfoChips,
  CircularImage,
} from '../components';

//sub components UI builders
import axios from 'axios';
import {endpoints, errorMessage} from '../endpoints';
import {task_actions} from '../store-actions/task-actions';
import {screens} from '../constants';
import moment from 'moment';

//

export const NothingToShow = (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <LoadingNothing
      height={150}
      label={'Job history unavailable at the moment'}
    />
  </View>
);
const LoaderView = (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <LoaderSpinner.ArcherLoader size={180} loading={true} />
    <Text>Fetching projects......</Text>
  </View>
);

// project item - for the flatlist
const ProjectItem = ({onItemClick, item}) => {
  const {
    taskId,
    createdAt,
    projectStatus,
    foregroundIdColor,
    backgroundIdColor,
  } = item;
  const [taskDetails, setTaskDetails] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${endpoints.client_service}/jobs/${taskId}`)
      .then(res => {
        setTaskDetails(res.data);
      })
      .catch(er => setTaskDetails(null))
      .finally(() => setLoading(false));
  }, []);
  const task_state_color = task_state => {
    switch (task_state) {
      case 'ONGOING':
        return COLORS.blue_deep;
      case 'PENDING_CONFIRMATION':
      case 'COMPLETE':
        return COLORS.secondary;
      case 'DISPUTE_PENDING':
      case 'DISPUTE_COMPLETE':
        return COLORS.grey_dark;
      default:
        return COLORS.primary;
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles._item_card, {borderLeftColor: foregroundIdColor}]}
      onPress={() => onItemClick({item, taskDetails})}>
      <View style={styles._project_state}>
        <View>
          <Text style={{...FONTS.caption, marginBottom: 4}}>
            Your project status
          </Text>
          <InfoChips text={projectStatus} textColor={COLORS.secondary} />
        </View>
        {/* ======== left fundi state */}
        <View>
          <Text style={{...FONTS.caption, marginBottom: 4}}>
            Client side state
          </Text>
          <InfoChips text={taskDetails.taskState} textColor={COLORS.primary} />
        </View>
      </View>
      {/* =========== END OF PROJECT STATE ======== */}
      <Text style={{...FONTS.body_bold, marginTop: SIZES.base}}>
        {taskDetails.title || 'Not Available'}
      </Text>
      <View style={styles._card_timeline}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IonIcons name="time-outline" size={SIZES.padding_16} />
          <Text style={{...FONTS.caption, marginLeft: SIZES.base}}>
            {moment(createdAt).fromNow(false)}
          </Text>
        </View>
        {/* ==== */}
        <View>
          <CircularImage size={24} />
          <Text style={{...FONTS.captionBold, color: backgroundIdColor}}>
            {taskDetails?.client?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * =================== Main Component =================
 */
const Projects = ({tasks, navigation, user_data}) => {
  const {jobs, posted_jobs} = tasks;
  const {user} = user_data;
  //set project variables
  const [loading, setLoading] = useState(true);
  //redux
  const dispatch = useDispatch();
  //render project item
  const load_jobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${endpoints.fundi_service}/projects/${user.id}?page=0&pageSize=20`,
        {timeout: 7000},
      );
      const {data} = res.data;
      if (data.length) dispatch(task_actions.load_jobs(data));
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Serivice unavailable',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load_jobs();
  }, []);

  if (loading) return LoaderView;
  if (!jobs.length) return NothingToShow;

  return (
    <View style={styles.container}>
      <DefaultToolBar title="Project Listing" navigation={navigation} />
      <View style={styles._content_wrapper}>
        <FlatList
          data={jobs}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => load_jobs()}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <ProjectItem
                item={item}
                onItemClick={item =>
                  navigation.navigate(screens.project_info, {item})
                }
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  const {tasks, user_data} = state;
  return {tasks, user_data};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _item_card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.base,
    marginBottom: SIZES.base,
    borderLeftWidth: SIZES.base,
    padding: SIZES.padding_16,
  },
  _content_wrapper: {
    flex: 1,
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
  },
  _card_timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding_12,
  },
  _project_state: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default connect(mapStateToProps)(Projects);
