import axios from 'axios';
import {endpoints} from '../endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {offline_data} from '../constants';
import {store} from '../../App';
import {user_data_actions} from '../store-actions';

axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
export const update_user_info = user_id => {
  console.log(`+++++++++++[info: user information update]+++++++++++`);
  axios
    .get(`/fundi/${user_id}`)
    .then(async res => {
      await AsyncStorage.setItem(offline_data.user, JSON.stringify(res.data));
      store.dispatch(user_data_actions.create_user(res.data));
    })
    .catch(err => console.log(err));
};
