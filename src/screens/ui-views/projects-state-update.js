import React, {useState, useMemo, useRef, useEffect} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
//redux
import {connect, useDispatch} from 'react-redux';

import DropDownPicker from 'react-native-dropdown-picker';

import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {TextInput, Button} from 'react-native-paper';

//

import {LoadingModal} from '../../components';
import axios from 'axios';
import {endpoints, errorMessage} from '../../endpoints';

const mapStateToProps = state => {
  const {tasks} = state;
  return {tasks};
};

const pickers = [
  {value: 'COMPLETE', label: 'Project complete'},
  {label: 'Project in progress', value: 'ON_GOING'},
  {label: 'Raise dispute', value: 'PENDING'},
  {label: 'Cancel the project', value: 'CANCELLED'},
];

const TaskUpdateView = ({sheetRef, tasks, updateDone}) => {
  const [loader, setLoader] = useState(false);
  const [force_rerender, setRerender] = useState(null);
  const [reason, setReason] = useState('');
  const [job_title, setJobTitle] = useState('');
  /////////////////////////
  const [items, setItems] = useState(pickers);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  const {selected_job} = tasks;
  const snapPoints = useMemo(() => [0, '25%', '70%'], []);

  const show_reasons_view = () => {
    return value === 'PENDING' || value === 'CANCELLED';
  };

  const handleOnPress = async () => {
    let job = selected_job;
    job = {
      ...job,
      taskState: value || selected_job.taskState,
      title: job_title || selected_job.title,
    };
    if (show_reasons_view() && !reason)
      return ToastAndroid.show(
        'Kindly provide a reason for your task status selection to help us with reconciliation of disputes for both parties',
        ToastAndroid.LONG,
      );
    setLoader(true);
    delete job['id'];
    try {
      await axios.put(
        `${endpoints.client_service}/jobs/${selected_job.id}`,
        job,
        {timeout: 30000},
      );
      updateDone(job);
      ToastAndroid.showWithGravity(
        'Job entry updated successfully',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      errorMessage(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    show_reasons_view();
  }, [value]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={index => {
        if (index === 0) {
          setRerender(Math.random());
        }
      }}>
      <LoadingModal
        show={loader}
        onDismiss={() => setLoader(false)}
        label={'Updating work state'}
      />
      <View
        style={{
          paddingVertical: SIZES.padding_32,
          paddingHorizontal: SIZES.padding_16,
        }}>
        <TextInput
          defaultValue={selected_job.title}
          onChangeText={txt => setJobTitle(txt)}
          dense={true}
          multiline={true}
          numberOfLines={3}
          mode="outlined"
          activeOutlineColor={COLORS.secondary}
          style={{marginBottom: SIZES.padding_16}}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          disabledItemContainerStyle={true}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={'Set current task state'}
        />
      </View>
      <View style={styles.wrapper}>
        {show_reasons_view() && (
          <View style={styles._reasons_wrapper}>
            <TextInput
              placeholder="Provide a valid reason for the action selected"
              multiline={true}
              numberOfLines={3}
              mode="outlined"
              onChangeText={txt => setReason(txt)}
              value={reason}
              outlineColor={COLORS.secondary}
              activeOutlineColor={COLORS.secondary}
            />
          </View>
        )}
        <Button
          color={COLORS.white}
          onPress={handleOnPress}
          style={{
            backgroundColor: COLORS.secondary,
            marginVertical: SIZES.padding_16,
          }}>
          Submit update
        </Button>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: SIZES.padding_16,
  },
  _reasons_wrapper: {
    marginTop: SIZES.padding_32,
  },
});

export const TaskUpdate = connect(mapStateToProps)(TaskUpdateView);
