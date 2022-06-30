import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getCurrentLocation} from '../config/current-location';
import {LoaderSpinner, MapView} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {useFocusEffect} from '@react-navigation/native';

//redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions, user_data_actions} from '../store-actions';
import {Button} from 'react-native-paper';
//icons
import MIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';
import toast from 'react-native-toast-message';
import {update_user_info} from '../config/utils';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const logger = console.log.bind(console, `[file: location-picker.js]`);

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const LocationPicker = ({user_data, navigation}) => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [load, setLoading] = useState(false);
  const [refresher, setRefreshing] = useState(0);

  // dispatch
  const dispatch = useDispatch();

  const handleLocationUpdate = async () => {
    setLoading(true);
    user = {latitude: lat, longitude: lon};
    try {
      const u = await axios.put(`/fundi/${user_data.user.id}`, user);
      update_user_info(user_data.user.id);
      toast.show({type: 'success', text1: 'Location updated successfully'});
    } catch (error) {
      axios_endpoint_error(error);
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
      setLoading(false);
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
            <MIcons
              name="my-location"
              size={SIZES.padding_32}
              color={COLORS.secondary}
              onPress={() => setRefreshing(prev => prev + 1)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default connect(mapStateToProps)(LocationPicker);
