import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

//ui components
import {CircularImage, LoadingNothing, MapMarker} from '../components';

//Icons
import EvilCons from 'react-native-vector-icons/EvilIcons';
import IoIcons from 'react-native-vector-icons/Ionicons';

// dispatch
import {connect, useDispatch} from 'react-redux';
//Theming
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {screens} from '../constants';
import moment from 'moment';
//network route handler
import {firebase_db} from '../endpoints';

const mapStateToProps = state => {
  const {user_data, chats} = state;
  return {user_data, chats};
};

export const ChatItemFooter = ({time, status, belongs_to_user}) => {
  return (
    <View style={styles._footer_item}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {belongs_to_user ? (
          !status ? (
            <IoIcons
              name="checkmark"
              size={SIZES.icon_size}
              color={COLORS.secondary}
            />
          ) : (
            <IoIcons
              name="checkmark-done"
              size={SIZES.icon_size}
              color={COLORS.secondary}
            />
          )
        ) : null}
        <Text
          style={{
            ...FONTS.caption,
            marginLeft: SIZES.base,
          }}>
          {moment(time).fromNow()}
        </Text>
      </View>
      {/* =========== MESSSAGE STATUS ============== */}
    </View>
  );
};

const ChatItem = ({onItemClick, user, chat_room_id}) => {
  const [lastmessage, setLastMessage] = useState({chatId: '', data: ''});
  useEffect(() => {
    firebase_db
      .ref(`/chats/${chat_room_id}`)
      .limitToLast(1)
      .on(`value`, s => {
        if (s.exists()) {
          const chat_id = Object.keys(s.toJSON())[0];
          const data = s.toJSON()[chat_id];
          setLastMessage({chatId: chat_id, data});
        }
      });
    return () => {
      firebase_db.ref(`/chats/${chat_room_id}`).off('value');
    };
  }, []);

  return (
    <TouchableOpacity
      style={styles._chat_item_container}
      onPress={() => onItemClick(item)}
      activeOpacity={0.9}>
      <View>
        <CircularImage size={SIZES.size_48} />
      </View>
      <View style={styles._chat_item_text_area}>
        <Text style={{...FONTS.body_bold}}>{user?.name || 'Unknown user'}</Text>
        <Text>
          {Object.values(lastmessage).filter(Boolean).length
            ? lastmessage.data.message
            : 'hi'}
        </Text>
        <ChatItemFooter
          time={1647979027917}
          status={false}
          belongs_to_user={true}
        />
        <Divider style={styles._divider} />
      </View>
    </TouchableOpacity>
  );
};

const logger = console.log.bind(console, '[chats.js: CHAT SCREEN]');

const ChatList = ({user_data, navigation, chats}) => {
  const {user} = user_data;
  const {chat_rooms} = chats;
  //event dispatcher hook
  const dispatch = useDispatch();
  //testing area
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* ========= badge notification counter ======== */}
        <IoIcons
          name="md-menu-outline"
          size={SIZES.padding_32}
          color={COLORS.secondary}
          onPress={() => navigation.openDrawer()}
        />
        <Text style={{...FONTS.body1, color: COLORS.secondary}}>
          Chats {'&'} Conversations
        </Text>
        <View>
          <EvilCons
            name="bell"
            size={SIZES.padding_32}
            color={COLORS.secondary}
          />
          {/* <Badge size={SIZES.base} style={styles._badge} /> */}
        </View>
      </View>
      {/* ========== END OF HEADER AREA SECTION ======== */}
      <View style={[styles._content_container]}>
        {/* */}
        {chat_rooms.length ? (
          <FlatList
            data={chat_rooms}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <ChatItem
                  onItemClick={i =>
                    navigation.navigate(screens.conversation, {i})
                  }
                  user={item.client}
                  chat_room_id={item.chatroom}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              height: '100%',
            }}>
            <LoadingNothing
              label={`You have no available chats. All your chat history and conversation data will appear here`}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: SIZES.padding_12,
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding_16,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  // content container
  _content_container: {
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
  },
  _chat_item_container: {
    flexDirection: 'row',
  },
  _chat_item_text_area: {
    marginLeft: SIZES.padding_12,
    marginRight: SIZES.padding_16,
    width: '100%',
  },
  _footer_item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
  },
  _divider: {
    marginTop: SIZES.base,
    marginBottom: SIZES.padding_16,
  },
});

export default connect(mapStateToProps)(ChatList);
