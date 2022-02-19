import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getCurrentLocation} from '../config/current-location';
import {LoaderSpinner, MapView} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {useFocusEffect} from '@react-navigation/native';

//redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions, user_data_actions} from '../store-actions';
import {Button, Dialog, Portal} from 'react-native-paper';
//icons
import MIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {endpoints, errorMessage} from '../endpoints';
import toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {offline_data} from '../constants';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const LocationPicker = ({user_data, navigation}) => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [load, setLoading] = useState(false);

  // dispatch
  const dispatch = useDispatch();

  const handleLocationUpdate = async () => {
    setLoading(true);
    let {user} = user_data;
    delete ['id'];
    user = {...user, latitude: lat, longitude: lon};
    try {
      const u = await axios.put(
        `${endpoints.fundi_service}/accounts/${user_data.user.id}`,
        user,
      );
      dispatch(user_data_actions.update_user({latitude: lat, longitude: lon}));
      await AsyncStorage.setItem(
        offline_data.user,
        JSON.stringify({...user_data.user, latitude: lat, longitude: lon}),
      );
      toast.show({type: 'success', text1: 'Location updated successfully'});
    } catch (error) {
      errorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  // run on the first render only
  useEffect(() => {
    getCurrentLocation().then(coordinates => {
      const {latitude, longitude} = coordinates.coords;
      setLat(latitude);
      setLon(longitude);
    });
    return () => {
      setLat(null);
      setLon(null);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(UISettingsActions.status_bar(true));
    }, []),
  );
  return (
    <View style={{flex: 1}}>
      {lat ? (
        <View style={{flex: 1}}>
          <MapView coordinates={{latitude: lat, longitude: lon}} />
          <Button
            style={[styles._update_btn]}
            color={COLORS.white}
            onPress={handleLocationUpdate}
            loading={load}>
            Update Location
          </Button>
          <View style={styles._icon_cancel}>
            <MIcons
              name="cancel"
              size={SIZES.padding_32}
              color={COLORS.secondary}
              onPress={() => navigation.goBack()}
            />
          </View>
          {/*  */}
        </View>
      ) : (
        <View style={[styles.center_in_viewport]}>
          <LoaderSpinner.Wave
            height={SIZES.device.height / 3}
            width={SIZES.device.width / 1.5}
          />
          <Text style={{...FONTS.body_bold, color: COLORS.secondary}}>
            Plotting your location. Please wait.......
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center_in_viewport: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _update_btn: {
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    bottom: SIZES.padding_32,
    width: '90%',
    alignSelf: 'center',
  },
  _icon_cancel: {
    position: 'absolute',
    zIndex: 100,
    padding: SIZES.padding_32,
  },
});

export default connect(mapStateToProps)(LocationPicker);
