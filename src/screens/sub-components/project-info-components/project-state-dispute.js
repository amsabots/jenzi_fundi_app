import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants/themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Divider, TextInput} from 'react-native-paper';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../../../endpoints';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
import Toast from 'react-native-toast-message';

const ProjectStateDispute = ({user_info, project_info, close_bottom_sheet}) => {
  const [loading, set_loading] = useState(false);
  const [cancel_reason, set_cancel_reason] = useState(null);
  const dispute_input_ref = useRef(null);
  const handle_state_update = () => {
    if (!cancel_reason) return dispute_input_ref.current.focus();
    set_loading(true);
    axios
      .put(`/fundi-tasks/${project_info.entryId}`, {
        state: 'Pending',
        conflict_flag: true,
        conflict_flag_info: 'Disputed: ' + cancel_reason,
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
          color: COLORS.white,
          backgroundColor: COLORS.primary,
          padding: SIZES.padding_12,
        }}>
        The disputed raised will be acted upon immediately to resolve any issues
        that might have come up between you and our client. Please ensure you
        provide a descriptive summary of the issue below to aid our team in
        following up. We apologize for the inconveniences
      </Text>

      <TextInput
        style={{marginTop: SIZES.padding_16}}
        placeholder={'Dispute cause or issue'}
        multiline={true}
        ref={dispute_input_ref}
        activeOutlineColor={COLORS.blue_deep}
        onChangeText={text => set_cancel_reason(text)}
      />
      <Button
        mode="contained"
        onPress={handle_state_update}
        loading={loading}
        style={{
          marginVertical: SIZES.padding_32,
          backgroundColor: COLORS.primary,
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

export default ProjectStateDispute;
