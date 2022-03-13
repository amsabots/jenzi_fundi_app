import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
  ImageBackground,
  Image,
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
  Card,
} from 'react-native-paper';
import storage from '@react-native-firebase/storage';
import {
  ClientDetails,
  LoadingNothing,
  InfoChips,
  LoaderSpinner,
  ImageSelector,
  LoadingModal,
} from '../components';

//redux
import {connect, useDispatch} from 'react-redux';
import {UISettingsActions} from '../store-actions';
import {ScrollView} from 'react-native-gesture-handler';

//ui subcomponets
import ProjectCancelOrDispute from './sub-components/task-action-reposnder';
import moment from 'moment';

//icons
import AntDesign from 'react-native-vector-icons/AntDesign';

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
  const [confirmAction, setConfirmAction] = useState(false);
  const [sheetActionType, setSheetActionType] = useState('');
  const [images_to_upload, setImagesToUpload] = useState(null);

  // variable and builder components
  const sheetRef = useRef();
  const image_selector_ref = useRef();

  const {item} = route.params;
  const {item: obj, taskDetails} = item;

  const handleSheetOpenRequest = type => {
    setSheetActionType(type);
    sheetRef.current.snapTo(1);
  };

  function update_job_entry() {}

  //component hooks
  const dispatch = useDispatch();

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
    <>
      <ScrollView style={styles.container}>
        <EnIcon
          name="cross"
          size={SIZES.padding_32}
          style={styles._cancel}
          color={COLORS.secondary}
          onPress={() => navigation.goBack()}
        />
        {/* ===========   PAGE CLIENT DETAILS ============= */}

        <ClientDetails client_details={taskDetails.client} />
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
              {obj?.message ||
                ' Any special information about the project will appear here - Keep note'}
            </Text>
          </Banner>
          {/* ============== TITLE AND BLA BLAS ================== */}
          <View style={{marginTop: SIZES.padding_16}}>
            <SectionTitle label=" Project title:" />
            <Text style={{color: COLORS.secondary, ...FONTS.body_medium}}>
              {taskDetails.title}
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
              <InfoChips
                text={obj.projectStatus}
                textColor={obj.foregroundIdColor}
              />
              <View style={{marginHorizontal: SIZES.padding_4}}>
                <InfoChips
                  text={`Client - ${taskDetails.taskState}`}
                  textColor={COLORS.primary}
                />
              </View>
              <Text style={{...FONTS.caption}}>
                Posted: {moment(obj.createdAt).fromNow()}
              </Text>
            </View>
            {/* ============= ACTIONS - BUTTONS AND SHIT ========== */}
            <Divider style={{marginVertical: SIZES.padding_12}} />
            {/* ========== PROJECT IMAGES AND FILES =========== */}

            <FundiImageFiles
              projectId={item}
              sheetRef={image_selector_ref}
              pickedFiles={images_to_upload}
            />

            {/* ==============  Action Section and shit ========= */}
            <SectionTitle label="Actions:" />
            <View style={styles._action_btn}>
              <Chip
                style={{backgroundColor: COLORS.secondary}}
                onPress={handleActionChange}>
                <Text style={{color: COLORS.white, ...FONTS.caption}}>
                  Complete
                </Text>
              </Chip>
              <Chip
                style={{
                  backgroundColor: COLORS.primary,
                  marginHorizontal: SIZES.padding_4,
                }}
                onPress={() => handleSheetOpenRequest('DISPUTE')}>
                <Text style={{color: COLORS.white, ...FONTS.caption}}>
                  Raise dispute
                </Text>
              </Chip>
              <Chip
                style={{backgroundColor: COLORS.blue_deep}}
                onPress={() => handleSheetOpenRequest('CANCEL')}>
                <Text style={{color: COLORS.white, ...FONTS.caption}}>
                  Cancel
                </Text>
              </Chip>
            </View>
          </View>
          <ImageSelector
            sheetRef={image_selector_ref}
            onRequestClose={() => image_selector_ref.current.snapTo(0)}
            onImagesPicked={imgs => setImagesToUpload(imgs)}
            selectMultiple={true}
          />
        </View>
      </ScrollView>

      {/* ======== NON STACKABLE COMPONENTS */}
      {/* ======== CANCEL OR RAISE DISPUTE ======= */}
      <ProjectCancelOrDispute
        sheetRef={sheetRef}
        job_item={item}
        type={sheetActionType}
        dismissListener={() => sheetRef.current.snapTo(0)}
      />
      {/* ======== COMPLETE PROJECT =========== */}
      <Portal>
        <Dialog
          visible={confirmAction}
          onDismiss={() => setConfirmAction(false)}>
          <Dialog.Title>Confirm action change</Dialog.Title>
          <Dialog.Content>
            <Text>
              Please confirm that you want to change the job state to complete.
              We will send an alert to the client to confirm or decline your
              request
            </Text>
            <Divider style={{marginTop: SIZES.padding_16}} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button onPress={() => setConfirmAction(false)}>Cancel</Button>
              <Button color={COLORS.secondary} onPress={() => update_job_entry}>
                Complete
              </Button>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

async function getPathForFirebaseStorage(uri) {
  const stat = await RNFetchBlob.fs.stat(uri);
  return stat.path;
}

const FundiImageFiles = ({projectId, sheetRef, pickedFiles}) => {
  const [images, setImages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [fetch, setFetching] = useState(false);
  const [upload, setUpload] = useState(false);

  const reference = storage().ref(`fundis-projects`);

  if (fetch)
    return (
      <View style={{alignItems: 'center'}}>
        <LoaderSpinner.Wave height={70} width={70} />
      </View>
    );
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: SIZES.padding_16,
        }}>
        <Text style={{...FONTS.captionBold}}>Project Images</Text>
        <AntDesign
          name="addfile"
          size={SIZES.icon_size}
          color={COLORS.secondary}
          onPress={() => sheetRef.current.snapTo(2)}
        />
      </View>
      {!images.length ? (
        <LoadingNothing
          label={'No images for this project'}
          height={50}
          width={50}
        />
      ) : (
        <ScrollView horizontal={true}>
          {images.map((el, idx) => {
            return (
              <Card
                style={{marginRight: SIZES.base, borderRadius: SIZES.base}}
                key={idx}>
                <Image
                  source={require('../assets/profile.png')}
                  defaultSource={require('../assets/profile.png')}
                  style={styles._project_image_file}
                />
                <Text style={styles._img_caption}>Some nice caption</Text>
              </Card>
            );
          })}
        </ScrollView>
      )}
      <LoadingModal
        onDismiss={() => setUpload(false)}
        show={upload}
        label={'Uplaoding files.......'}
      />
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
