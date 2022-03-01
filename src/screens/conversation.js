import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ToastAndroid} from 'react-native';
import {Chip} from 'react-native';
import {LoaderSpinner} from '../components';
import {useFocusEffect} from '@react-navigation/native';

//redux
import {connect, useDispatch} from 'react-redux';
import {chat_actions} from '../store-actions';
//icons
import IoIcons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import axios from 'axios';
import {endpoints, firebase_reference} from '../endpoints';
import {user_data} from '../../store/user';
import {TextInput} from 'react-native-paper';

const data = Array.from(Array(100).keys());

const mapStateToProps = state => {
  const {user_data, chats} = state;
  return {user_data, chats};
};

const ChatItemRight = ({item}) => {
  return (
    <View style={[styles._bubble_width, styles._bubble_to]}>
      <Text style={[styles._bubble_to_text, {...FONTS.caption}]}>
        {item.message}
      </Text>
    </View>
  );
};

const ChatItemLeft = ({item}) => {
  return (
    <View style={[styles._bubble_width, styles._bubble_from]}>
      <Text style={[styles._bubble_from_text, {...FONTS.caption}]}>
        {item.message}
      </Text>
    </View>
  );
};

const TopHeader = ({nav}) => {
  return (
    <View style={styles.header}>
      <IoIcons
        name="chevron-back"
        size={SIZES.padding_32}
        color={COLORS.white}
        onPress={() => nav.goBack()}
      />
    </View>
  );
};

const ConversationScreen = ({navigation, chats, route, user_data}) => {
  //get passed parameters from the previous screen
  const {i} = route.params;
  const {chatRoomId, partyB} = i.connection;
  const {chats: conversations, pager} = chats;
  const {user} = user_data;
  //  screen/componet state
  const [refreshing, setRefreshing] = useState(false);

  //hooks
  const dispatch = useDispatch();

  const handleSubmitMessage = () => {
    firebase_reference
      .ref(`/chats/${user.accountId}`)
      .set({name: 'andrew'})
      .then(res => `message sent`)
      .catch(er => console.log(er));
  };

  useFocusEffect(
    useCallback(() => {
      ToastAndroid.showWithGravityAndOffset(
        'updating..',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100,
      );

      axios
        .get(
          `${endpoints.fundi_service}/chats?chatRoomId=${chatRoomId}&limit=${pager.page_size}&page=${pager.current_page}`,
        )
        .then(res => dispatch(chat_actions.load_chats(res.data.chats)))
        .catch(err => {
          dispatch(chat_actions.load_chats([]));
        });
    }, [i]),
  );
  return (
    <View style={styles.container}>
      <TopHeader nav={navigation} />
      <View style={styles.content_area}>
        <FlatList
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
          data={conversations}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            const {sourceId} = item;
            if (sourceId === user_data.id) return <ChatItemRight item={item} />;
            return <ChatItemLeft item={item} />;
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SIZES.base,
          backgroundColor: COLORS.light_secondary,
          paddingBottom: 4,
        }}>
        <TextInput
          multiline={true}
          numberOfLines={2}
          dense={true}
          mode="outlined"
          placeholder="message"
          outlineColor={COLORS.light_secondary}
          activeOutlineColor={COLORS.light_bluish}
          style={{
            flexGrow: 1,
            marginRight: SIZES.padding_12,
          }}
        />
        <IoIcons
          name="send-sharp"
          size={SIZES.icon_size_focused}
          onPress={handleSubmitMessage}
          color={COLORS.secondary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: SIZES.padding_12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.base,
    justifyContent: 'space-between',
  },
  content_area: {
    flex: 1,
    backgroundColor: COLORS.light_secondary,
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
  },
  _bubble_width: {
    maxWidth: '80%',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base,
    marginBottom: SIZES.padding_12,
    borderRadius: SIZES.padding_16,
    paddingRight: SIZES.padding_32,
  },
  _bubble_from: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 0,
  },
  _bubble_from_text: {
    color: COLORS.primary,
  },
  _bubble_to: {
    backgroundColor: COLORS.secondary,
    borderBottomRightRadius: 0,
    alignSelf: 'flex-end',
  },
  _bubble_to_text: {
    color: COLORS.white,
  },
});

export default connect(mapStateToProps)(ConversationScreen);
