import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {Button, Caption, TextInput, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

//toast
import Toast from 'react-native-toast-message';
import {
  LoadingModal,
  DefaultToolBar,
  CircularImage,
  InfoChips,
  MenuPopUp,
  ImageSelector,
  AppRadioBtns,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
// icons
import Icons from 'react-native-vector-icons/SimpleLineIcons';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch, connect} from 'react-redux';

//subcomponents
import AccountCustomization from './sub-components/profile-account-customization';
import ResetPassword from './sub-components/profile-reset-password';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

//pop menu
import {MenuOption} from 'react-native-popup-menu';
import axios from 'axios';
import {endpoints, errorMessage} from '../endpoints';
import {user_data_actions} from '../store-actions';
import {offline_data, screens} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// page sub components

const PopupOption = ({onSelect}) => (
  <MenuOption onSelect={onSelect}>
    <Text style={{...FONTS.body, marginVertical: 4}}>Change profile image</Text>
  </MenuOption>
);

const account_visibility = [
  {label: 'Engaged On - Account is invisible', value: true},
  {label: 'Engaged Off - Account is visible', value: false},
];

const account_state = [
  {label: 'Account Enabled', value: true},
  {label: 'Disable account', value: false},
];

const Profile = ({navigation, user_data}) => {
  const {user} = user_data;
  const {
    premium,
    enabled,
    accountId,
    createdAt: cr_at,
    email: em,
    name: nm,
    phoneNumber: phn,
    verified: ve,
    userBackgroundColor,
    engaged: engage,
    photoUrl: image_url,
    id,
  } = user;
  // ui variables - transient
  const [showLoader, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [engaged, setEngaged] = useState(null);
  const [active, setActive] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  // referential variables - external behaviour
  const img_selector = useRef(null);

  // redux store
  const dispatch = useDispatch();

  //===================== component functions ===========
  const handlePickedImages = imgs => {
    img_selector.current.snapTo(0);
    const type_array = imgs[0].type.split('/');
    const type = type_array[type_array.length - 1];
    if (!['png', 'jpeg', 'webp', 'jpg'].includes(type))
      return Toast.show({
        type: 'error',
        text1: 'File type error',
        text2: 'Make sure the file selected is of type jpg, png or jpeg',
        position: 'bottom',
      });
    // const reference = storage().ref(
    //   `/jenzi_profile/${random_gen.generate({charset: 'hex'})}.png`,
    // );
    // const task = reference.putFile(imgs[0].fileCopyUri);
    setPhotoUrl(imgs[0].fileCopyUri);
    // task
    //   .then(e => {
    //     console.log(e);
    //     return Toast.show({
    //       type: 'success',
    //       text1: 'Profile photo has been changed successfully',
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     ToastAndroid.showWithGravity(
    //       'Upload failed. Please try again later',
    //       ToastAndroid.LONG,
    //       ToastAndroid.CENTER,
    //     );
    //   });
  };

  const handleEditsUpdate = async () => {
    setShowModal(true);
    const update_user = {
      ...user,
      name: name || nm,
      phoneNumber: phonenumber || phn,
      engaged,
      enabled: active,
    };
    delete update_user['id'];
    try {
      await axios.put(endpoints.fundi_service + '/accounts/' + id, update_user);
      await AsyncStorage.setItem(
        offline_data.user,
        JSON.stringify({...update_user, id}),
      );
      dispatch(user_data_actions.update_user({...update_user, id}));
      Toast.show({type: 'success', text1: 'Information updated successfully'});
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Encoutered an error, Please try again later',
      });
    } finally {
      setShowModal(false);
    }
  };

  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setActive(enabled);
      setEngaged(engage);
      setPhotoUrl(image_url);
    }, [user_data]),
  );

  return (
    <>
      {/* toolbar */}
      <DefaultToolBar navigation={navigation} title="Profile" />
      <View style={styles.container}>
        <LoadingModal
          show={showLoader}
          onDismiss={() => setShowModal(false)}
          label="Updating...."
        />
        <ScrollView>
          {/* section one - details preview */}
          <View style={[styles._section_card, styles._current_profile]}>
            <View style={styles._options_container}>
              <MenuPopUp
                menuTrigger={
                  <Icons name="options-vertical" size={SIZES.icon_size} />
                }
                options={
                  <PopupOption
                    onSelect={() => img_selector.current.snapTo(2)}
                  />
                }
              />
            </View>
            <CircularImage size={72} />
            <Text style={{...FONTS.body1}}>{nm}</Text>
            <Caption>{em}</Caption>
            <View style={styles._account_state}>
              <InfoChips
                text={ve ? 'Verified' : 'Unverified'}
                textColor={COLORS.info}
              />
              <InfoChips
                text={enabled ? 'Active' : 'Disabled'}
                textColor={COLORS.secondary}
              />
            </View>
            {/*  */}
            <Text>Contact: {phn || 'Not available'}</Text>
            <Text
              style={styles._location_update}
              onPress={() => navigation.navigate(screens.location_picker)}>
              Update current location
            </Text>
          </View>
          <Text style={styles._section_text}>Edit profile</Text>

          <View style={[styles._section_card]}>
            <TextInput
              label={nm || 'Official Name'}
              value={name}
              onChangeText={text => setName(text)}
              dense={true}
              style={[styles._std_margin]}
              activeOutlineColor={COLORS.secondary}
              activeUnderlineColor={COLORS.secondary}
              placeholder={nm}
            />
            <TextInput
              label={phn || 'Phone number'}
              value={phonenumber}
              onChangeText={text => setPhonenumber(text)}
              dense={true}
              style={[styles._std_margin]}
              activeUnderlineColor={COLORS.secondary}
              placeholder={phn}
            />
            <View style={{marginVertical: SIZES.padding_12}}>
              <AppRadioBtns
                selected={engaged}
                options={account_visibility}
                onRadioButtonChangeListener={v => setEngaged(v)}
              />
            </View>
            <Divider />
            <View>
              <AppRadioBtns
                selected={active}
                options={account_state}
                onRadioButtonChangeListener={v => setActive(v)}
              />
            </View>

            <View style={{marginTop: SIZES.padding_16}}>
              <Button
                mode="outlined"
                icon="pencil"
                color={COLORS.secondary}
                onPress={handleEditsUpdate}>
                Edit basic details
              </Button>
            </View>
          </View>

          {/* Section three - Tags */}
          <Text style={styles._section_text}>Account customization</Text>

          <View style={[styles._section_card]}>
            <AccountCustomization user={user_data.user} />
          </View>

          {/* section three - password reset */}
          <Text style={styles._section_text}>Password reset</Text>
          <View style={[styles._section_card]}>
            <ResetPassword user={user_data.user} />
          </View>
          {/* section three */}
        </ScrollView>
        <ImageSelector
          sheetRef={img_selector}
          onImagesPicked={imgs => handlePickedImages(imgs)}
          pickerLabel="Select profile image"
          buttonLabel="Upload profile photo"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.disabled_grey,
    paddingTop: SIZES.base,
  },
  _section_card: {
    paddingVertical: SIZES.padding_32,
    paddingHorizontal: SIZES.padding_16,
    backgroundColor: COLORS.white,
  },
  _current_profile: {
    alignItems: 'center',
  },
  _account_state: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SIZES.base,
  },
  _std_margin: {
    marginBottom: SIZES.padding_16,
    backgroundColor: COLORS.white,
  },
  _section_text: {
    ...FONTS.body1,
    marginVertical: SIZES.base,
    marginHorizontal: SIZES.padding_16,
  },
  _options_container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  _location_update: {
    marginTop: SIZES.padding_32,
    color: COLORS.secondary,
    textDecorationLine: 'underline',
    ...FONTS.body_bold,
  },
});

export default connect(stateToProps)(Profile);

// [
//   {
//     fileCopyUri:
//       'file:/data/user/0/com.fundi_app/cache/459fdec0-5d1d-4507-925c-842ce0cb5062/Screenshot_20220219-133922.png',
//     name: 'Screenshot_20220219-133922.png',
//     size: 602155,
//     type: 'image/png',
//     uri: 'content://com.android.providers.media.documents/document/image%3A4047',
//   },
// ];
