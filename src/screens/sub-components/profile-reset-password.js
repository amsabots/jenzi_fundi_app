import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {COLORS, SIZES} from '../../constants/themes';

const ResetPassword = ({user}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  return (
    <>
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
        <Button mode="contained" style={{backgroundColor: COLORS.secondary}}>
          Reset Password
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  _std_margin: {
    marginBottom: SIZES.padding_16,
    backgroundColor: COLORS.white,
  },
});

export default ResetPassword;
