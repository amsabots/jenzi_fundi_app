import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {ProgressBar} from 'react-native-paper';
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
import {endpoints, axios_endpoint_error} from '../endpoints';
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
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
// project item - for the flatlist
const ProjectItem = ({onItemClick, item}) => {
  //prettier-ignore
  const {task_state, title, requirements, task_id, task_info, createdAt, completion_data, clientId} = item;
  //prettier-ignore
  const {state, conflict_flag, conflict_flag_info, fore_ground_color, back_ground_color, 
    createdAt:created_time} = item.fundi_data
  //
  const [client_info, set_client_info] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/clients/${clientId}`)
      .then(res => set_client_info(res.data))
      .finally(() => setLoading(false));
    return () => {
      setLoading(false);
    };
  }, [item]);
  const task_state_color = task_state => {
    switch (task_state) {
      case 'ONGOING':
        return COLORS.blue_deep;
      case 'COMPLETE':
        return COLORS.secondary;
      case 'CANCELLED':
        return COLORS.grey_dark;
      default:
        return COLORS.primary;
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles._item_card, {borderLeftColor: fore_ground_color}]}
      onPress={() => onItemClick({item, client_info})}>
      {loading && <ProgressBar indeterminate color={COLORS.blue_deep} />}
      <View style={styles._item_content_wrapper}>
        <View style={styles._project_state}>
          <View>
            <Text style={{...FONTS.caption, marginBottom: 4}}>
              Local project status
            </Text>
            <InfoChips text={state} textColor={COLORS.secondary} />
          </View>
          {/* ======== left fundi state */}
          <View>
            <Text style={{...FONTS.caption, marginBottom: 4}}>
              Client side state
            </Text>
            <InfoChips text={task_state} textColor={COLORS.primary} />
          </View>
        </View>
        {/* =========== END OF PROJECT STATE ======== */}
        <Text style={{...FONTS.body_bold, marginTop: SIZES.base}}>
          {title || 'Not Available'}
        </Text>
        <View style={styles._card_timeline}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IonIcons name="time-outline" size={SIZES.padding_16} />
            <Text style={{...FONTS.caption, marginLeft: SIZES.base}}>
              {moment(created_time).fromNow(false)}
            </Text>
          </View>
          {/* ==== */}
          <View style={{alignItems: 'center'}}>
            <CircularImage size={24} />
            <Text style={{...FONTS.captionBold, color: back_ground_color}}>
              {client_info?.name || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * =================== Main Component =================
 */
const Projects = ({tasks, navigation, user_data}) => {
  const {user} = user_data;
  //set project variables
  const [loading, setLoading] = useState(true);
  const [jobs, set_jobs] = useState([]);
  //redux
  const dispatch = useDispatch();
  //render project item
  const load_jobs = async () => {
    setLoading(true);
    axios
      .get(`/fundi-tasks/user/${user.id}`)
      .then(res => {
        const {page, limit, data} = res.data;
        const {fundi_data} = data;
        if (data.length) set_jobs(data);
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load_jobs();
  }, []);

  if (loading) return LoaderView;
  return (
    <View style={styles.container}>
      <DefaultToolBar
        title="Project Listing"
        navigation={navigation}
        refresh={true}
        onRefreshClicked={() => load_jobs()}
      />

      {!jobs.length ? (
        NothingToShow
      ) : (
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
      )}
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
    borderLeftWidth: SIZES.base,
    marginBottom: SIZES.base,
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
  _item_content_wrapper: {
    padding: SIZES.padding_16,
  },
});

export default connect(mapStateToProps)(Projects);
