import React, {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {DefaultToolBar, CircularImage} from '../components';
import {View, Text, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import {CustomTextInputView} from './profile-basic-info';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {Button} from 'react-native-paper';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const PasswordRest = ({navigation, user_data}) => {
  // state variables
  const [credentials_data, set_credentials_data] = useState({});
  const [loading, set_loading] = useState(false);

  //
  const {user} = user_data;
  const handle_password_input = obj => {
    set_credentials_data(prev => {
      return {...prev, ...obj};
    });
  };

  const handle_submit = () => {
    const {password, current_password, password1} = credentials_data;
    if (!password || !current_password || !password1)
      //prettier-ignore
      return ToastAndroid.show('Fill all the required fields', ToastAndroid.SHORT);
    if (password1 !== password)
      //prettier-ignore
      return ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
    set_loading(true);
    axios
      .post(`/fundi/reset-password/${user.id}`, {password})
      .then(res => {
        //prettier-ignore
        ToastAndroid.show(`Password has been reset - account will be reprofiled on the next login`,ToastAndroid.LONG);
        navigation.goBack();
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => set_loading(false));
  };
  return (
    <View style={styles.full_height}>
      <DefaultToolBar navigation={navigation} title="Password manager" />
      <View style={[styles.full_height, styles.align_center]}>
        <CircularImage url={require('../assets/profile.png')} size={100} />
        <View
          style={{
            width: '100%',
            marginVertical: SIZES.padding_16,
            paddingHorizontal: SIZES.padding_16,
          }}>
          <Text
            style={{
              ...FONTS.body_bold,
              color: COLORS.secondary,
              textAlign: 'center',
              marginBottom: SIZES.padding_32,
            }}>
            Reset your current password
          </Text>
          <CustomTextInputView
            label={'Current password'}
            name={'current_password'}
            secureTextEntry={true}
            onTextChange={obj => handle_password_input(obj)}
          />
          <CustomTextInputView
            label={'New password'}
            name={'password'}
            secureTextEntry={true}
            onTextChange={obj => handle_password_input(obj)}
          />
          <CustomTextInputView
            label={'Verify password'}
            name={'password1'}
            secureTextEntry={true}
            onTextChange={obj => handle_password_input(obj)}
          />
          <Button style={styles._btn} loading={loading} onPress={handle_submit}>
            Update password
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  full_height: {
    flex: 1,
  },
  align_center: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  _btn: {
    marginVertical: SIZES.padding_32,
  },
});

export default connect(mapStateToProps)(PasswordRest);
