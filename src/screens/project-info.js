import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import EnIcon from 'react-native-vector-icons/Entypo';
import {
  Divider,
  Button,
  Banner,
  Chip,
  Portal,
  Dialog,
} from 'react-native-paper';

import {ClientDetails, Reviews, LoadingNothing, InfoChips} from '../components';

//redux
import {connect, useDispatch} from 'react-redux';
import {UISettingsActions} from '../store-actions';
import {ScrollView} from 'react-native-gesture-handler';

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

const ProjectInfo = ({navigation, user_data}) => {
  //component state variables
  const [action, setAction] = useState('');
  const [ready, setIsReady] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [confrimActionLabel, setConfirmActionLabel] = useState('');

  //component hooks
  const dispatch = useDispatch();
  const btmSheetRef = useRef(null);

  //component event handlers
  const handleActionChange = () => {
    setConfirmAction(true);
  };

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
    <ScrollView style={styles.container}>
      <EnIcon
        name="cross"
        size={SIZES.padding_32}
        style={styles._cancel}
        color={COLORS.secondary}
        onPress={() => navigation.goBack()}
      />
      {/* ===========   PAGE CLIENT DETAILS ============= */}

      <ClientDetails />
      {/*  ========== PAGE PROJECT INFO ================= */}
      <Text
        style={{...FONTS.body, fontWeight: 'bold', padding: SIZES.padding_16}}>
        Project Details
      </Text>
      {/* ============================================== */}
      <View style={styles._project_details}>
        <Banner
          actions={[]}
          visible={true}
          contentStyle={{backgroundColor: COLORS.light_secondary}}>
          <Text style={{color: COLORS.secondary, ...FONTS.caption}}>
            Any special information about the project will appear here
          </Text>
        </Banner>
        {/* ============== TITLE AND BLA BLAS ================== */}
        <View style={{marginTop: SIZES.padding_16}}>
          <SectionTitle label=" Project title:" />
          <Text style={{color: COLORS.secondary, ...FONTS.body}}>
            Project two
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
            <InfoChips text={'On going'} textColor={COLORS.secondary} />
            <Text>Posted: 3 mins ago</Text>
          </View>
          {/* ============= ACTIONS - BUTTONS AND SHIT ========== */}
          <Divider style={{marginVertical: SIZES.padding_12}} />
          <SectionTitle label="Actions:" />
          <View style={styles._action_btn}>
            <Chip
              style={{backgroundColor: COLORS.secondary}}
              onPress={handleActionChange}>
              <Text style={{color: COLORS.white}}>Complete</Text>
            </Chip>
            <Chip
              style={{
                backgroundColor: COLORS.primary,
                marginHorizontal: SIZES.padding_4,
              }}
              onPress={() => setAction('DISPUTED')}>
              <Text style={{color: COLORS.white}}>Raise dispute</Text>
            </Chip>
            <Chip
              style={{backgroundColor: COLORS.blue_deep}}
              onPress={() => setAction('CANCEL')}>
              <Text style={{color: COLORS.white}}>Cancel</Text>
            </Chip>
          </View>
        </View>
      </View>

      {/* ======== NON STACKABLE COMPONENTS */}
      <Reviews bottomSheetRef={btmSheetRef} />
      <Portal>
        <Dialog
          visible={confirmAction}
          onDismiss={() => setConfirmAction(false)}>
          <Dialog.Title>Confirm action change</Dialog.Title>
          <Dialog.Content>
            <Text>
              Please confirm that you want to change the job state to complete.
              We will send an alert to client to confirm or decline your request
            </Text>
            <Divider style={{marginTop: SIZES.padding_16}} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button onPress={() => setConfirmAction(false)}>Cancel</Button>
              <Button color={COLORS.secondary}>Complete</Button>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
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
  },
  _action_btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.padding_16,
    width: '100%',
  },
});

export default connect(mapStateToProps)(ProjectInfo);
