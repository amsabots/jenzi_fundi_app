import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants/themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Divider, TextInput} from 'react-native-paper';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../../../endpoints';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
import Toast from 'react-native-toast-message';

const ProjectStateCancel = ({user_info, project_info, close_bottom_sheet}) => {
  const [loading, set_loading] = useState(false);
  const [cancel_reason, set_cancel_reason] = useState(null);

  const handle_state_update = () => {
    set_loading(true);
    axios
      .put(`/fundi-tasks/${project_info.entryId}`, {
        state: 'Cancelled',
        conflict_flag_info: cancel_reason
          ? 'Cancelled: ' + cancel_reason
          : 'Cancelled: No specific details',
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text2: 'Project has been cancelled, Exit and refresh to view changes',
        });
        close_bottom_sheet();
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => set_loading(false));
  };
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={{alignItems: 'flex-end'}}
        onPress={() => close_bottom_sheet()}>
        <AntDesign
          name="close"
          size={SIZES.icon_size_focused}
          color={COLORS.blue_deep}
        />
      </TouchableOpacity>
      <Divider style={{marginVertical: SIZES.padding_16}} />
      <Text
        style={{
          color: COLORS.blue_deep,
          backgroundColor: COLORS.light_bluish,
          padding: SIZES.padding_12,
        }}>
        By clicking the cancel below, you agree that you are willing to drop
        responsibility of this project previously assigned to you.
      </Text>

      <TextInput
        style={{marginTop: SIZES.padding_16}}
        placeholder={'Reason for cancelling the project'}
        multiline={true}
        activeOutlineColor={COLORS.blue_deep}
        onChangeText={text => set_cancel_reason(text)}
      />
      <Button
        mode="contained"
        onPress={handle_state_update}
        loading={loading}
        style={{
          marginVertical: SIZES.padding_32,
          backgroundColor: COLORS.blue_deep,
        }}>
        <Text style={{...FONTS.caption}}>Request project cancellation</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: SIZES.padding_16,
  },
});

export default ProjectStateCancel;
