import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

//ui components
import {CircularImage, MapMarker} from '../components';

//Icons
import EvilCons from 'react-native-vector-icons/EvilIcons';
import IoIcons from 'react-native-vector-icons/Ionicons';

// dispatch
import {connect, useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {Divider} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {screens} from '../constants';

const mapStateToProps = state => {
  const {user_data, chats} = state;
  return {user_data, chats};
};

export const ChatItemFooter = ({time, status}) => {
  return (
    <View style={styles._footer_item}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <EvilCons
          name="clock"
          size={SIZES.icon_size}
          color={COLORS.secondary}
        />
        <Text style={{...FONTS.caption, marginLeft: SIZES.base}}>
          a minute ago
        </Text>
      </View>
      {/* =========== MESSSAGE STATUS ============== */}
      <IoIcons
        name="checkmark"
        size={SIZES.icon_size}
        color={COLORS.secondary}
      />
      {/* <IoIcons
            name="checkmark-done"
            size={SIZES.icon_size}
            color={COLORS.secondary}
          /> */}
    </View>
  );
};

const ChatItem = ({item, onItemClick}) => {
  return (
    <TouchableOpacity
      style={styles._chat_item_container}
      onPress={() => onItemClick(item)}
      activeOpacity={0.9}>
      <View>
        <CircularImage size={SIZES.size_48} />
      </View>
      <View style={styles._chat_item_text_area}>
        <Text style={{...FONTS.body_bold}}>Client name</Text>
        <Text>Lorem ipsum dolo rlorem dsd ewew dsdsd dsdsdsds ds dsd dssd</Text>
        <ChatItemFooter />
        <Divider style={styles._divider} />
      </View>
    </TouchableOpacity>
  );
};

const ChatList = ({user_data, navigation, chats}) => {
  const {user} = user_data;
  console.log(chats);
  const dispatch = useDispatch();

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
        <ChatItem onItemClick={item => navigation.push(screens.conversation)} />
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
  },
  _chat_item_container: {
    flexDirection: 'row',
  },
  _chat_item_text_area: {
    marginLeft: SIZES.padding_12,
    marginRight: SIZES.padding_16,
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
