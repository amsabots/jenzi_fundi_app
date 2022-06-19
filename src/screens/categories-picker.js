import React, {useEffect, useState} from 'react';
//prettier-ignore
import {View, Text, StyleSheet, FlatList, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import {DefaultToolBar} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';
import {Button, Checkbox, Chip, Divider, Portal} from 'react-native-paper';
import {LoadingModal} from '../components';

axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const CategoryItem = ({category, onSelectedChangeListener}) => {
  const [checked, set_checked] = useState(false);
  return (
    <View style={sub_component_style.wrapper}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles._initial_container}>
          <Text style={{...FONTS.captionBold, color: COLORS.secondary}}>
            {category.title.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={sub_component_style.name}>{category.title}</Text>
      </View>
      <>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          color={COLORS.blue_deep}
          onPress={() => {
            onSelectedChangeListener({action: !checked, payload: category});
            set_checked(!checked);
          }}
        />
      </>
    </View>
  );
};

const ActiveCategoryItem = ({category, onCloseClicked}) => {
  return (
    <Chip
      style={{
        marginRight: SIZES.base,
        marginBottom: SIZES.base,
        backgroundColor: COLORS.light_bluish,
      }}
      textStyle={{color: COLORS.blue_deep, ...FONTS.caption}}
      onClose={() => onCloseClicked(category)}
      closeIcon={'close'}>
      {category.title}
    </Chip>
  );
};

const sub_component_style = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    marginLeft: SIZES.icon_size,
    ...FONTS.body_medium,
  },
});

const CategoriesPicker = ({navigation, user_data}) => {
  const [categories, set_categories] = useState([]);
  const [loading, set_loading] = useState('');
  const [user_categories, set_user_categories] = useState([]);
  const [selected_categories, set_selected_categories] = useState([]);
  const [ui_refresher, set_ui_refresher] = useState(0);
  //

  const handleSelectChange = ctry => {
    const {action, payload} = ctry;
    if (action) {
      set_selected_categories(prev => [...prev, payload]);
    } else {
      const index = selected_categories.indexOf(payload);
      if (index > -1) {
        selected_categories.splice(index, 1);
        set_selected_categories(selected_categories);
      }
    }
  };

  const handleDetachFromcategory = category => {
    set_loading('Detaching category');
    axios
      .delete(`fundi-categories/${user_data?.user.id}/${category.id}`)
      .then(res =>
        ToastAndroid.show('Category has been removed', ToastAndroid.LONG),
      )
      .catch(err => axios_endpoint_error(err))
      .finally(() => {
        set_loading('');
        set_ui_refresher(prev => Number(prev) + 1);
      });
  };
  const handle_submit_request = () => {
    if (!selected_categories.length)
      return ToastAndroid.show(
        `You have not selected anything`,
        ToastAndroid.LONG,
      );
    const check_length =
      Number(user_categories.length) + Number(selected_categories.length);
    if (check_length > 1)
      return ToastAndroid.show(
        `You are only allowed to set a single job category provider.`,
        ToastAndroid.LONG,
      );
    axios
      .post(`fundi-categories`, {
        categories: selected_categories.map(el => el.id),
        fundiId: user_data?.user?.id,
      })
      .then(res =>
        ToastAndroid.show(
          'Attached account to category selected',
          ToastAndroid.LONG,
        ),
      )
      .catch(err => axios_endpoint_error(err))
      .finally(() => {
        set_loading('');
        set_ui_refresher(prev => Number(prev) + 1);
      });
  };
  useEffect(() => {
    set_loading('Fetching categories..');
    axios
      .get(`/job-category`)
      .then(async result => {
        const user_ctrs = await axios.get(
          `/job-category/?fundiId=${user_data?.user?.id}`,
        );
        set_categories(result.data);
        set_user_categories(user_ctrs.data);
      })
      .catch(err => {
        axios_endpoint_error(err);
      })
      .finally(() => set_loading(''));
    return () => {
      set_loading('');
    };
  }, [ui_refresher]);
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title="Job categories" />
      <View style={styles.wrapper}>
        <View style={styles._active_categories}>
          <Text
            style={{
              ...FONTS.body_medium,
              color: COLORS.blue_deep,
              marginBottom: SIZES.padding_12,
            }}>
            Active categories
          </Text>
          <View style={{flexDirection: 'row'}}>
            {user_categories.length > 0 ? (
              user_categories.map((el, idx) => (
                <ActiveCategoryItem
                  category={el}
                  key={idx}
                  onCloseClicked={el => handleDetachFromcategory(el)}
                />
              ))
            ) : (
              <Text
                style={{
                  color: COLORS.secondary,
                  textAlign: 'center',
                  width: '100%',
                }}>
                Nothing to show
              </Text>
            )}
          </View>
        </View>
        <Divider style={{marginVertical: SIZES.base}} />
        <View style={{flex: 1, paddingHorizontal: SIZES.padding_16}}>
          <Text
            style={{
              ...FONTS.body_medium,
              color: COLORS.blue_deep,
              marginBottom: SIZES.padding_12,
            }}>
            Available categories
          </Text>
          <FlatList
            data={categories}
            renderItem={({item}) => {
              return (
                <CategoryItem
                  category={item}
                  onSelectedChangeListener={ctry => handleSelectChange(ctry)}
                />
              );
            }}
            keyExtractor={item => item.id}
          />
        </View>
        <Button
          mode="contained"
          style={styles._submit_changes_btn}
          onPress={handle_submit_request}
          disabled={selected_categories.length > 0 ? false : true}>
          Submit Changes
        </Button>
      </View>
      {/* portal bound components */}
      <Portal>
        <LoadingModal show={loading} label={loading} />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingTop: SIZES.base,
    flex: 1,
  },
  _initial_container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: SIZES.padding_32,
    width: SIZES.padding_32,
    borderRadius: SIZES.padding_32 / 2,
    backgroundColor: COLORS.light_secondary,
  },
  _submit_changes_btn: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: SIZES.padding_16,
    marginVertical: SIZES.base,
  },
  _active_categories: {
    paddingHorizontal: SIZES.padding_16,
    paddingBottom: SIZES.padding_12,
  },
});

export default connect(mapStateToProps)(CategoriesPicker);
