import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {connect, useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';

//
import {FlatList} from 'react-native-gesture-handler';

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

//

export const NothingToShow = (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <LoadingNothing
      height={150}
      label={'Job history unavailable at the moment'}
    />
  </View>
);

// project item - for the flatlist
const ProjectItem = ({onItemClick, item}) => {
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
      style={[styles._item_card, {borderLeftColor: COLORS.secondary}]}
      onPress={() => onItemClick(item)}>
      <InfoChips text={'ON GOING'} textColor={COLORS.secondary} />
      <Text style={{...FONTS.body_bold, marginTop: SIZES.base}}>
        Project title
      </Text>
      <View style={styles._card_timeline}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IonIcons name="time-outline" size={SIZES.padding_16} />
          <Text style={{...FONTS.caption, marginLeft: SIZES.base}}>
            3 days ago
          </Text>
        </View>
        {/* ==== */}
        <View>
          <CircularImage size={24} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * =================== Main Component =================
 */
const ProjectsView = ({tasks, navigation}) => {
  const {jobs, posted_jobs} = tasks;
  //set project variables
  const [load, setLoading] = useState(false);
  //redux
  const dispatch = useDispatch();
  //render project item

  async function loadProjects() {
    setLoading(true);
    try {
    } catch (error) {
      setLoading(false);
      errorMessage(error);
    }
  }

  useEffect(() => {
    loadProjects();
    return () => {
      setLoading(false);
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles._content_wrapper}>
        <ProjectItem
          item={'some item'}
          onItemClick={item =>
            navigation.navigate(screens.project_info, {item})
          }
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
  _card_timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding_12,
  },
});

const Projects = memo(ProjectsView);

export default connect(mapStateToProps)(Projects);
