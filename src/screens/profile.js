import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import {Button, Caption, TextInput} from 'react-native-paper';
//toast
import Toast from 'react-native-toast-message';
import {
  LoadingModal,
  DefaultToolBar,
  CircularImage,
  InfoChips,
  MenuPopUp,
  ImageSelector,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
// icons
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import MI from 'react-native-vector-icons/MaterialIcons';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch, connect} from 'react-redux';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

//pop menu
import {MenuOption} from 'react-native-popup-menu';
import axios from 'axios';
import {endpoints, errorMessage} from '../endpoints';
import {user_data_actions} from '../store-actions';

const PopupOption = ({onSelect}) => (
  <MenuOption onSelect={onSelect}>
    <Text style={{...FONTS.body, marginVertical: 4}}>Change profile image</Text>
  </MenuOption>
);

const Profile = ({navigation, user_data}) => {
  const {
    accountBalance: acc_b,
    accountType: acc_t,
    active: actv,
    clientId,
    createdAt: cr_at,
    email: em,
    name: nm,
    phoneNumber: phn,
    secondaryPhonenumber: ph_s,
    verified: ve,
    userBackgroundColor,
  } = user_data.user;
  // ui variables - transient
  const [showLoader, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [phone2, setPhone2] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // referential variables - external behaviour
  const img_selector = useRef(null);

  // redux store
  const dispatch = useDispatch();

  // mount on the first render only
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  //===================== component functions ===========
  const handlePickedImages = imgs => {
    img_selector.current.snapTo(0);
    imgs.forEach(element => {
      const type_array = element.split('.');
      const type = type_array[type_array.length - 1];
      if (!['png', 'jpeg', 'webp', 'jpg'].includes(type))
        return Toast.show({
          type: 'error',
          text1: 'File type error',
          text2: 'Make sure the file selected is of type jpg, png or jpeg',
          position: 'bottom',
        });
    });
  };

  const handleEditsUpdate = () => {
    setShowModal(true);
    let user = user_data.user;
    user = {
      ...user,
      name: name || nm,
      phoneNumber: phonenumber || phn,
      secondaryPhonenumber: phone2 || ph_s,
    };
    axios
      .put(endpoints.client_service + '/clients/' + user_data.user.id, user)
      .then(res => {
        dispatch(
          user_data_actions.create_user({...user, id: user_data.user.id}),
        );
        ToastAndroid.show(
          'Account details update successfully',
          ToastAndroid.LONG,
        );
      })
      .catch(er => errorMessage(er))
      .finally(() => setShowModal(false));
  };

  return (
    <>
      {/* toolbar */}
      <DefaultToolBar navigation={navigation} title="Profile" />
      <View style={styles.container}>
        <LoadingModal show={showLoader} onDismiss={() => setShowModal(false)} />
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
                text={actv ? 'Active' : 'Disabled'}
                textColor={COLORS.secondary}
              />
            </View>
            {/*  */}
            <Text>Contact: {phn || 'Not available'}</Text>
          </View>
          {/* Section two - Edit the details above */}
          <Text style={styles._section_text}>Edit profile</Text>

          <View style={[styles._section_card]}>
            <TextInput
              label="Official Name"
              value={name}
              onChangeText={text => setName(text)}
              dense={true}
              style={[styles._std_margin]}
              activeOutlineColor={COLORS.secondary}
              activeUnderlineColor={COLORS.secondary}
              placeholder={nm}
            />
            <TextInput
              label="Phone number"
              value={phonenumber}
              onChangeText={text => setPhonenumber(text)}
              dense={true}
              style={[styles._std_margin]}
              activeUnderlineColor={COLORS.secondary}
              placeholder={phn}
            />
            <TextInput
              label="Phone Secondary phone number"
              value={phone2}
              dense={true}
              onChangeText={text => setPhone2(text)}
              style={[styles._std_margin]}
              activeUnderlineColor={COLORS.secondary}
              placeholder={ph_s}
            />
            <View>
              <Button
                mode="outlined"
                icon="pencil"
                color={COLORS.secondary}
                onPress={handleEditsUpdate}>
                Edit basic details
              </Button>
            </View>
          </View>
          {/* section three - password reset */}
          <Text style={styles._section_text}>Password reset</Text>
          <View style={[styles._section_card]}>
            <TextInput
              label="Current password"
              value={currentPassword}
              secureTextEntry={true}
              dense={true}
              mode="outlined"
              onChangeText={text => setCurrentPassword(text)}
              style={[styles._std_margin]}
              activeOutlineColor={COLORS.secondary}
            />
            <TextInput
              label="New password"
              value={newpassword}
              secureTextEntry={true}
              dense={true}
              mode="outlined"
              onChangeText={text => setNewPassword(text)}
              style={[styles._std_margin]}
              activeOutlineColor={COLORS.secondary}
            />
            <TextInput
              label="Confirm password"
              value={confirmPassword}
              secureTextEntry={true}
              dense={true}
              mode="outlined"
              onChangeText={text => setConfirmPassword(text)}
              style={[styles._std_margin]}
              activeOutlineColor={COLORS.secondary}
            />
            <View style={{alignItems: 'flex-start'}}>
              <Button
                mode="contained"
                style={{backgroundColor: COLORS.secondary}}>
                Reset Password
              </Button>
            </View>
          </View>
          {/* section three */}
        </ScrollView>
        <ImageSelector
          sheetRef={img_selector}
          onImagesPicked={imgs => handlePickedImages(imgs)}
          pickerLabel="Select profile image"
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
});

export default connect(stateToProps)(Profile);
