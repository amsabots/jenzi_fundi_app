import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ToastAndroid, ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';

//sqlite
import AsyncStorage from '@react-native-async-storage/async-storage';

//redux
import {useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {UISettingsActions, user_data_actions} from '../store-actions';

import {LoaderSpinner, LoadingNothing} from '../components';
import {TextInput, Button} from 'react-native-paper';
import {endpoints, errorMessage} from '../endpoints';
//axios
import axios from 'axios';
axios.defaults.baseURL = `${endpoints.jenzi_backend}/jenzi/v1`;

//icon
import {offline_data, screens} from '../constants';
import {validation_schema} from '../config';

const Register = ({navigation}) => {
  //app state
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pass1, setPass1] = useState('');
  const [username, set_username] = useState('');
  const [load, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  const handleRegistration = () => {
    if (!name || !password || !username)
      return Toast.show({
        type: 'error',
        text1: 'Please all the fields before submission',
        position: 'bottom',
      });
    if (pass1 !== password)
      return Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        position: 'bottom',
      });
    const validate = validation_schema.validate({username: username});
    if (validate['error']) {
      return ToastAndroid.show(
        'Invalid phone number format provided',
        ToastAndroid.LONG,
      );
    }
    setLoading(true);
    axios
      .post(`/clients`, {
        name,
        username,
        password,
      })
      .then(async res => {
        dispatch(user_data_actions.create_user(res.data));
        await AsyncStorage.setItem(offline_data.user, JSON.stringify(res.data));
        ToastAndroid.show('Welcome to Jenzi Smart', ToastAndroid.LONG);
        navigation.reset({
          index: 0,
          routes: [{name: screens.main_activity}],
        });
      })
      .catch(err => errorMessage(axios_endpoint_error(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <ScrollView style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <View>
          <LoadingNothing textColor={COLORS.white} />
          <Text
            style={{
              textAlign: 'center',
              color: COLORS.white,
              ...FONTS.h4,
              marginTop: SIZES.padding_16,
            }}>
            JENZI SMART
          </Text>
        </View>

        <View style={styles.wrapper}>
          <Text
            style={{
              ...FONTS.h5,
              fontWeight: '900',
              color: COLORS.secondary,
              marginBottom: SIZES.padding_32,
            }}>
            Sign Up
          </Text>
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'account-circle'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Official Name"
            onChangeText={txt => setName(txt)}
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'phone'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Phonenumber"
            keyboardType="number-pad"
            onChangeText={txt => set_username(txt)}
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'white'}]}
            left={
              <TextInput.Icon
                name={'eye'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={txt => setPassword(txt)}
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[{backgroundColor: 'white'}]}
            left={
              <TextInput.Icon
                name={'eye'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Confirm password"
            secureTextEntry={true}
            onChangeText={txt => setPass1(txt)}
          />
          <Text style={{...FONTS.caption, marginTop: SIZES.padding_12}}>
            By signing you agree to our{' '}
            <Text style={{color: COLORS.secondary, fontWeight: '800'}}>
              Terms and Conditions
            </Text>
          </Text>
          {/* ====== ACTION buttons */}
          <View style={styles._action_buttons_wrapper}>
            <Button
              mode="contained"
              loading={load}
              onPress={handleRegistration}
              style={[
                styles._action_btns,
                {
                  backgroundColor: COLORS.secondary,
                },
              ]}>
              Register
            </Button>
            {/*  */}
            <Button
              mode="contained"
              onPress={() => navigation.navigate(screens.login)}
              style={[
                styles._action_btns,
                {
                  backgroundColor: COLORS.blue_deep,
                  marginLeft: SIZES.base,
                },
              ]}
              labelStyle={{...FONTS.captionBold}}>
              Back to Login
            </Button>
          </View>
          {/*  */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    flex: 1,
    paddingTop: SIZES.padding_32,
  },
  wrapper: {
    backgroundColor: COLORS.white,
    flex: 1,
    marginTop: SIZES.size_48,
    borderTopLeftRadius: SIZES.padding_16,
    borderTopRightRadius: SIZES.padding_16,
    padding: SIZES.padding_32,
  },
  _input_field: {
    marginBottom: SIZES.padding_32,
  },
  _action_buttons_wrapper: {
    flexDirection: 'row',
    width: '100%',
    marginTop: SIZES.padding_16,
    justifyContent: 'space-between',
  },
  _action_btns: {
    flexGrow: 1,
  },
});

export default Register;
