import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
  ScrollView,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import EnIcon from 'react-native-vector-icons/Entypo';
import {Divider, Banner, Chip} from 'react-native-paper';
import {ClientDetails, LoadingNothing, InfoChips} from '../components';

//redux
import {connect, useDispatch} from 'react-redux';
import {UISettingsActions} from '../store-actions';
import moment from 'moment';
import BottoSheet from '@gorhom/bottom-sheet';
//icons
import AntDesign from 'react-native-vector-icons/AntDesign';

//ui subcomponets
import ProjectStateComplete from './sub-components/project-info-components/complete-project';
import ProjectStateCancel from './sub-components/project-info-components/project-state-cancel';
import ProjectStateDispute from './sub-components/project-info-components/project-state-dispute';
//////
const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const SectionTitle = ({label}) => {
  return (
    <Text
      style={{
        marginBottom: SIZES.base,
        ...FONTS.caption,
        fontWeight: 'bold',
      }}>
      {label}
    </Text>
  );
};

const ProjectInfo = ({navigation, user_data, route}) => {
  //component state variables
  const [ready, setIsReady] = useState(false);
  const [sheet_state_children, set_sheet_state_children] = useState(null);
  const {item} = route.params;
  const {item: project_info, client_info} = item;
  //prettier-ignore
  const {task_state, title, requirements, task_id, task_info, createdAt, completion_data, clientId} = project_info;
  //prettier-ignore
  const {state, conflict_flag, conflict_flag_info, fore_ground_color, back_ground_color, 
    createdAt:created_time} = project_info.fundi_data
  // bottom sheet
  const snapPoints = useMemo(() => [0, '50%', '85%'], []);
  const bottom_sheet = useRef(null);

  const dismiss_sheet = () => {
    bottom_sheet.current.snapTo(0);
  };

  const handle_state_prompt = state => {
    bottom_sheet.current.snapTo(1);
    if (state === 'complete') {
      set_sheet_state_children(
        <ProjectStateComplete
          close_bottom_sheet={dismiss_sheet}
          project_info={project_info.fundi_data}
          user_info={user_data.user}
        />,
      );
    } else if (state === 'cancel') {
      set_sheet_state_children(
        <ProjectStateCancel
          close_bottom_sheet={dismiss_sheet}
          project_info={project_info.fundi_data}
          user_info={user_data.user}
        />,
      );
    } else if (state === 'dispute') {
      set_sheet_state_children(
        <ProjectStateDispute
          close_bottom_sheet={dismiss_sheet}
          project_info={project_info.fundi_data}
          user_info={user_data.user}
        />,
      );
    }
  };

  //component hooks
  const dispatch = useDispatch();
  //use effect hooks
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  }, []);
  return !ready ? (
    <ActivityIndicator size={SIZES.padding_32} color={COLORS.secondary} />
  ) : (
    <View style={styles.container}>
      <ScrollView>
        <EnIcon
          name="cross"
          size={SIZES.padding_32}
          style={styles._cancel}
          color={COLORS.secondary}
          onPress={() => navigation.goBack()}
        />
        {/* ===========   PAGE CLIENT DETAILS ============= */}

        <ClientDetails client_details={client_info} />
        {/*  ========== PAGE PROJECT INFO ================= */}
        <Text
          style={{
            ...FONTS.body,
            fontWeight: 'bold',
            padding: SIZES.padding_16,
          }}>
          Project Details
        </Text>
        {/* ============================================== */}
        <View style={styles._project_details}>
          <Banner
            actions={[]}
            visible={true}
            contentStyle={{backgroundColor: COLORS.light_secondary}}>
            <Text style={{color: COLORS.secondary, ...FONTS.caption}}>
              {conflict_flag_info ||
                ' Any special information about the project will appear here - Keep note'}
            </Text>
          </Banner>
          {/* ============== TITLE AND BLA BLAS ================== */}
          <View style={{marginTop: SIZES.padding_16}}>
            <SectionTitle label=" Project title:" />
            <Text style={{color: COLORS.secondary, ...FONTS.body_medium}}>
              {title}
            </Text>
            <Divider style={{marginVertical: SIZES.padding_12}} />
            {/* ======= REQUIREMENTS AND SHIT ============== */}

            <SectionTitle label=" Requirements:" />
            <View>
              <LoadingNothing
                label={'Requirements not available'}
                height={120}
                width={120}
              />
            </View>
            <Divider style={{marginVertical: SIZES.padding_12}} />
            {/* ========== TASK STATE AND TIMELINE =========== */}
            <SectionTitle label="Extra info:" />
            <View style={styles._extra_info}>
              <InfoChips text={state} textColor={fore_ground_color} />
              <View style={{marginHorizontal: SIZES.padding_4}}>
                <InfoChips
                  text={`Client - ${task_state.toLowerCase()}`}
                  textColor={COLORS.primary}
                />
              </View>
              <Text style={{...FONTS.caption}}>
                Posted: {moment(created_time).fromNow()}
              </Text>
            </View>
            {/* ============= ACTIONS - BUTTONS AND SHIT ========== */}
            <Divider style={{marginVertical: SIZES.padding_12}} />
            {/* ==============  Action Section and shit ========= */}
            <Divider
              style={{
                marginVertical: SIZES.padding_16,
                backgroundColor: COLORS.blue_deep,
              }}
            />
            <SectionTitle label="Actions:" />
            <View style={styles._action_btn}>
              <Chip
                style={{backgroundColor: COLORS.secondary}}
                onPress={() => handle_state_prompt('complete')}>
                <Text style={{color: COLORS.white, ...FONTS.caption}}>
                  Complete {'&'} close
                </Text>
              </Chip>
              <Chip
                style={{
                  backgroundColor: COLORS.primary,
                  marginHorizontal: SIZES.padding_4,
                }}>
                <Text
                  style={{color: COLORS.white, ...FONTS.caption}}
                  onPress={() => handle_state_prompt('dispute')}>
                  Raise dispute
                </Text>
              </Chip>
              <Chip
                style={{backgroundColor: COLORS.blue_deep}}
                onPress={() => handle_state_prompt('cancel')}>
                <Text style={{color: COLORS.white, ...FONTS.caption}}>
                  Cancel
                </Text>
              </Chip>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottoSheet snapPoints={snapPoints} ref={bottom_sheet}>
        {sheet_state_children && sheet_state_children}
      </BottoSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _cancel: {
    position: 'absolute',
    top: SIZES.padding_16,
    left: SIZES.padding_16,
    zIndex: 100,
  },
  _project_details: {
    flex: 1,
    padding: SIZES.padding_16,
  },
  _extra_info: {
    marginVertical: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  _action_btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.padding_16,
    width: '100%',
  },
  _project_image_file: {
    height: 180,
    width: 180,
  },
  _img_caption: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: SIZES.base,
    backgroundColor: '#00000060',
    width: '100%',
    color: COLORS.white,
    paddingHorizontal: SIZES.padding_4,
    ...FONTS.captionBold,
  },
});

export default connect(mapStateToProps)(ProjectInfo);
