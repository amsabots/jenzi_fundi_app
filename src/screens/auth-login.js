/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ToastAndroid, ScrollView} from 'react-native';

//redux
import {useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {UISettingsActions, user_data_actions} from '../store-actions';

import {LoadingNothing} from '../components';
import {TextInput, Button} from 'react-native-paper';
//axios network request
import axios from 'axios';
//sqlite
import AsyncStorage from '@react-native-async-storage/async-storage';

import {offline_data, screens} from '../constants';
import {axios_endpoint_error, endpoints, errorMessage} from '../endpoints';
import {validation_schema} from '../config';

axios.defaults.baseURL = `${endpoints.jenzi_backend}/jenzi/v1`;

const Login = ({navigation}) => {
  // screen state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
    return () => {
      setLoading(false);
    };
  }, []);

  const handleLogin = () => {
    if (!email || !password)
      return ToastAndroid.show(
        'Phone number and password are required',
        ToastAndroid.LONG,
      );

    // validate phone number
    const v = validation_schema.validate({username: email});
    if (v['error']) {
      return ToastAndroid.show(
        'Invalid phone number format provided',
        ToastAndroid.LONG,
      );
    }
    setLoading(true);
    axios
      .post(`/fundi/login`, {
        username: email.toLowerCase(),
        password,
      })
      .then(async res => {
        console.log(res.data);
        await AsyncStorage.setItem(offline_data.user, JSON.stringify(res.data));
        dispatch(user_data_actions.create_user(res.data));
        ToastAndroid.show('Welcome to Jenzi smart', ToastAndroid.LONG);
        navigation.reset({
          index: 0,
          routes: [{name: screens.main_activity}],
        });
      })
      .catch(err => {
        axios_endpoint_error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <View>
          <LoadingNothing textColor={COLORS.white} height={180} />
          <Text
            style={{
              textAlign: 'center',
              color: COLORS.white,
              ...FONTS.h4,
              marginTop: SIZES.padding_16,
            }}>
            JENZI PRO
          </Text>
        </View>

        <View style={styles.wrapper}>
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.secondary,
            }}>
            Login
          </Text>
          <Text style={{marginBottom: SIZES.size_48}}>
            Welcome back our esteemed fundi
          </Text>
          <TextInput
            dense={true}
            keyboardType="number-pad"
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'phone'}
                color={COLORS.secondary}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Phonenumber"
            value={email}
            onChangeText={txt => setEmail(txt)}
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[{backgroundColor: 'white'}]}
            left={
              <TextInput.Icon
                name={'eye'}
                color={COLORS.secondary}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={txt => setPassword(txt)}
          />
          <Text
            style={{
              ...FONTS.captionBold,
              color: COLORS.blue_deep,
              marginVertical: SIZES.padding_12,
              textAlign: 'right',
            }}
            onPress={() => navigation.navigate(screens.reset_pass)}>
            Forgot password
          </Text>
          {/* ====== ACTION buttons */}
          <View style={styles._action_buttons_wrapper}>
            <Button
              mode="contained"
              loading={load}
              onPress={handleLogin}
              style={[
                styles._action_btns,
                {
                  backgroundColor: COLORS.secondary,
                },
              ]}>
              Login
            </Button>
            {/*  */}
            <Button
              mode="contained"
              onPress={() => navigation.navigate(screens.register)}
              style={[
                styles._action_btns,
                {
                  backgroundColor: COLORS.blue_deep,
                  marginLeft: SIZES.base,
                },
              ]}
              labelStyle={{...FONTS.captionBold}}>
              Create account
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

export default Login;
