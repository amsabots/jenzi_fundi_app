import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Caption, Divider, Switch} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

//toast
import {
  LoadingModal,
  DefaultToolBar,
  CircularImage,
  InfoChips,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
// icons
import AIcons from 'react-native-vector-icons/AntDesign';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch, connect} from 'react-redux';
import {screens} from '../constants';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProfileMenuItem = ({navigateTo, label, icon, navigation}) => {
  return (
    <View style={sub_styles._wrapper}>
      <TouchableOpacity
        style={sub_styles._profile_menu_item}
        onPress={() => navigation.navigate(navigateTo)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={sub_styles.icon_container}>
            <AIcons name={icon} color={COLORS.grey_dark} size={16} />
          </View>
          <Text style={{...FONTS.body, marginLeft: SIZES.padding_16}}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const sub_styles = StyleSheet.create({
  _wrapper: {
    paddingHorizontal: SIZES.padding_16,
  },
  icon_container: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: COLORS.disabled_grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _profile_menu_item: {
    paddingVertical: SIZES.base,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding_16,
  },
});

const Profile = ({navigation, user_data}) => {
  const {user} = user_data;
  const {is_enabled, email: em, name: nm, username: phn, verified: ve} = user;
  // ui variables - transient
  const [showLoader, setShowModal] = useState(false);
  const [account_status, set_account_status] = useState(is_enabled);
  //===================== component functions ===========
  const handle_account_status_change = () => {
    set_account_status(!account_status);
  };
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
            <CircularImage size={72} />
            <Text style={{...FONTS.body1}}>{nm}</Text>
            <Caption>{em}</Caption>
            <View style={styles._account_state}>
              <InfoChips
                text={ve ? 'Verified' : 'Unverified'}
                textColor={COLORS.info}
              />
              <InfoChips
                text={is_enabled ? 'Active' : 'Disabled'}
                textColor={COLORS.secondary}
              />
            </View>
            {/*  */}
            <Text>Username: {phn || 'Not available'}</Text>
          </View>
          <Text style={styles._account_settings}>Profile Settings</Text>
          <ProfileMenuItem
            icon={'user'}
            label={'Basic Info'}
            navigateTo={screens.profile_basic_info}
            navigation={navigation}
          />
          <ProfileMenuItem
            icon={'checksquareo'}
            label={'Job categories'}
            navigateTo={screens.profile_category_picker}
            navigation={navigation}
          />
          <ProfileMenuItem
            icon={'enviroment'}
            label={'Current Location'}
            navigateTo={screens.location_picker}
            navigation={navigation}
          />
          <ProfileMenuItem
            icon={'eye'}
            label={'Password manager'}
            navigateTo={screens.reset_pass}
            navigation={navigation}
          />
          <ProfileMenuItem
            icon={'setting'}
            label={'Account preferences'}
            navigateTo={screens.profile_category_picker}
            navigation={navigation}
          />
        </ScrollView>
        <View style={styles._buttom_section}>
          <Text style={{...FONTS.caption, color: COLORS.white}}>
            {account_status ? 'Take account offline' : 'Get back online'}
          </Text>
          <Switch
            value={account_status}
            onValueChange={handle_account_status_change}
            color={COLORS.white}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  _section_card: {
    paddingVertical: SIZES.padding_32,
    paddingHorizontal: SIZES.padding_16,
    backgroundColor: COLORS.disabled_grey,
  },
  _current_profile: {
    alignItems: 'center',
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
  _account_settings: {
    marginVertical: SIZES.padding_12,
    marginHorizontal: SIZES.padding_16,
    ...FONTS.body_bold,
    color: COLORS.blue_deep,
  },
  _account_state: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  _buttom_section: {
    backgroundColor: COLORS.blue_deep,
    width: '100%',
    minHeight: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding_16,
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
