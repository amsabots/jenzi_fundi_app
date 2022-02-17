import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

//redux
import {useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {UISettingsActions} from '../store-actions';

import {LoaderSpinner, LoadingNothing} from '../components';
import {TextInput, Button} from 'react-native-paper';

//icon
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {screens} from '../constants';

const RestPassword = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  return (
    <ScrollView style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <View>
          <LoadingNothing label={'JENZI AFRICA'} textColor={COLORS.white} />
        </View>

        <View style={styles.wrapper}>
          <Text
            style={{
              ...FONTS.h5,
              fontWeight: '900',
              color: COLORS.secondary,
              marginBottom: SIZES.size_48,
            }}>
            Reset Password
          </Text>
          <Text style={{...FONTS.caption, marginBottom: SIZES.padding_32}}>
            Do not worry it happens, Please enter the phonenumber/email you used
            to register with
          </Text>
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[{backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'phone'}
                color={COLORS.secondary}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="phonenumber/email"
          />

          <Text
            style={{
              ...FONTS.captionBold,
              color: COLORS.blue_deep,
              marginVertical: SIZES.padding_12,
              textAlign: 'right',
            }}
            onPress={() => navigation.navigate(screens.login)}>
            Back to Login
          </Text>
          <Button
            mode="contained"
            style={{
              backgroundColor: COLORS.secondary,
              marginTop: SIZES.size_48,
            }}>
            Reset password
          </Button>
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
});

export default RestPassword;
