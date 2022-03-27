import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ToastAndroid} from 'react-native';
import {Chip} from 'react-native';
import {CircularImage, LoaderSpinner} from '../components';
import {useFocusEffect} from '@react-navigation/native';

//redux
import {connect, useDispatch} from 'react-redux';
import {chat_actions} from '../store-actions';
//icons
import IoIcons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
//
import {COLORS, FONTS, SIZES} from '../constants/themes';
import axios from 'axios';
import {endpoints, firebase_db, firebase_reference} from '../endpoints';
import {TextInput} from 'react-native-paper';

const logger = console.log.bind(`[file: conversation.js]`);

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

const TopHeader = ({nav, client}) => {
  return (
    <View style={styles.header}>
      <IoIcons
        name="chevron-back"
        size={SIZES.padding_32}
        color={COLORS.white}
        onPress={() => nav.goBack()}
      />
      <View style={{marginHorizontal: SIZES.padding_12}}>
        <CircularImage size={32} />
      </View>
      <View>
        <Text style={{...FONTS.body_bold, color: COLORS.white}}>
          {client.name}
        </Text>
        <Text style={{...FONTS.caption, color: COLORS.white}}>
          last seen: online a while ago
        </Text>
      </View>
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          flexDirection: 'row',
          paddingEnd: SIZES.padding_16,
        }}>
        <Feather
          name="more-vertical"
          size={SIZES.icon_size}
          color={COLORS.white}
          onPress={() => nav.goBack()}
        />
      </View>
    </View>
  );
};

const ConversationScreen = ({navigation, chats, user_data}) => {
  //get passed parameters from the previous screen
  const {user} = user_data;
  const {selected_chat} = chats;
  //  screen/componet state
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversation] = useState([]);
  const [chat_room, set_chatroom] = useState('');
  const [message, setMessage] = useState('');
  const [isSendable, setSendable] = useState(false);

  //hooks
  const dispatch = useDispatch();

  const handleSubmitMessage = () => {
    firebase_db
      .ref(`/chats/${chat_room}`)
      .push({
        source: user.accountId,
        destination: selected_chat.clientId,
        chatroomId: chat_room,
        message: message,
      })
      .then(res => setMessage(''))
      .catch(err => logger(err));
  };

  const get_chat_room = () => {
    logger(`[message: get charooms for this user]`);
    firebase_db
      .ref(`/chatrooms/${selected_chat.clientId}`)
      .once('value')
      .then(d => {
        for (const [key, value] of Object.entries(d.toJSON())) {
          if (value.partyB === user.accountId) {
            set_chatroom(key);
            listen_for_chat_changes(key);
          }
        }
      });
  };

  const listen_for_chat_changes = room_id => {
    firebase_db.ref(`/chats/${room_id}`).on('child_added', data => {
      const chat = {...data.toJSON(), id: data.key};
      setConversation(previous => [...previous, {...chat}]);
    });
  };

  useFocusEffect(
    useCallback(() => {
      setConversation([]);
      get_chat_room();
      return () => {
        firebase_db.ref(`/chats/${chat_room}`).off('value');
        firebase_db.ref(`/chats/${chat_room}`).off('child_added');
      };
    }, []),
  );

  useEffect(() => {
    if (message) setSendable(true);
    else setSendable(false);
  }, [message]);

  return (
    <View style={styles.container}>
      <TopHeader nav={navigation} client={selected_chat} />
      <View style={styles.content_area}>
        <FlatList
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
          data={conversations}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            const {source} = item;
            if (source === user.accountId) return <ChatItemRight item={item} />;
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
          onChangeText={txt => setMessage(txt)}
          value={message}
          activeOutlineColor={COLORS.light_bluish}
          style={{
            flexGrow: 1,
            marginRight: SIZES.padding_12,
          }}
        />
        {isSendable && (
          <IoIcons
            name="send-sharp"
            size={SIZES.icon_size_focused}
            onPress={handleSubmitMessage}
            color={COLORS.secondary}
          />
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
    paddingVertical: SIZES.padding_12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.base,
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
    alignSelf: 'baseline',
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
