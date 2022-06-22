import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants/themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Divider} from 'react-native-paper';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../../../endpoints';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
import Toast from 'react-native-toast-message';

const ProjectStateComplete = ({
  user_info,
  project_info,
  close_bottom_sheet,
}) => {
  const [loading, set_loading] = useState(false);

  const handle_state_update = () => {
    set_loading(true);
    axios
      .put(`/fundi-tasks/${project_info.entryId}`, {
        state: 'Complete',
        conflict_flag_info: 'Complete: Waiting for the client to confirm.',
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text2:
            'State has been updated successfully, Exit and refresh to view changes',
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
          color: COLORS.green,
          backgroundColor: COLORS.light_green,
          padding: SIZES.padding_12,
        }}>
        By clicking the button below, you agree that you are in full knowlegde
        that the project in progress is complete and the client is ready to
        close
      </Text>
      <Button
        mode="contained"
        onPress={handle_state_update}
        loading={loading}
        style={{
          marginVertical: SIZES.padding_32,
          backgroundColor: COLORS.green,
        }}>
        <Text style={{...FONTS.caption}}>Request project completion</Text>
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

export default ProjectStateComplete;
