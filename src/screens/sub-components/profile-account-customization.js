import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import {LoaderSpinner} from '../../components';
import {COLORS, SIZES} from '../../constants/themes';
import {endpoints, errorMessage} from '../../endpoints';

const LoadAnimation = (
  <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <LoaderSpinner.Wave />
    <Text>Fetching tags....</Text>
  </View>
);

const AccountCustomization = ({user}) => {
  const [load, setLoad] = useState(false);
  const [tags, setAllTags] = useState([]);
  const [load_update, setLoadUpdate] = useState(false);

  const handleOnPress = item => {
    const {selected} = item;
    const index = tags.indexOf(item);
    tags[index] = {...item, selected: !selected};
    setAllTags(i => [...[], ...tags]);
  };

  const handleTagsUpdate = () => {
    setLoadUpdate(true);
    tags.forEach(element => {
      if (element.selected) {
        const create_req = axios.post(
          `${endpoints.fundi_service}/tag-category`,
          {
            tagId: element.id,
            accountId: user.id,
          },
        );
      } else {
        const delete_req = axios.post(
          `${endpoints.fundi_service}/tag-category/${element.id}/${user.id}`,
        );
      }
    });
  };

  useEffect(() => {
    setLoad(true);
    const tgs = axios.get(`${endpoints.client_service}/tasks-category`);
    const act = axios.get(`${endpoints.fundi_service}/tag-category/${user.id}`);
    Promise.all([tgs, act])
      .then(res => {
        const tgs_res = res[0].data;
        const act_res = res[1].data;
        const activeIds = act_res.map(el => el.tagId);
        const merge_tags = tgs_res.map(el => {
          if (activeIds.includes(el.id)) return {...el, selected: true};
          else return {...el, selected: false};
        });
        setAllTags(merge_tags);
      })
      .catch(er => errorMessage(er))
      .finally(() => setLoad(false));
  }, []);
  return (
    <View>
      {load ? (
        LoadAnimation
      ) : (
        <>
          <Text>Job categories and tags</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginVertical: SIZES.padding_12,
            }}>
            {tags.map((el, idx) => (
              <Chip
                key={idx}
                onPress={() => handleOnPress(el)}
                icon={el.selected ? 'check' : null}
                style={{marginRight: SIZES.base, marginBottom: SIZES.base}}>
                {el.title}
              </Chip>
            ))}
          </View>

          <Button
            style={{marginTop: SIZES.padding_16}}
            loading={load_update}
            mode={'outlined'}
            onPress={handleTagsUpdate}
            color={COLORS.secondary}>
            Update category tags
          </Button>
        </>
      )}
    </View>
  );
};

export default AccountCustomization;
