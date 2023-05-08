import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import UserAvatar from '../../assets/user-chat-avatar.svg';
import AIAvatar from '../../assets/ai-chat-avatar.svg';
import Divider from '../../components/Divider';

const ChatItem = ({type, title, time, message, ...props}) => {
  return (
    <View
      style={{
        backgroundColor: type === 'entry' ? '#F6FEFC' : null,
        paddingVertical: 32,
        paddingHorizontal: 16,
        flexDirection: 'row',
      }}>
      {type === 'entry' ? <UserAvatar /> : <AIAvatar />}

      <View
        style={{
          marginLeft: 12,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: type === 'entry' ? 23 : null,
          }}>
          <View>
            <Text
              style={{
                fontSize: 16,
                color: '#344054',
                fontWeight: 500,
              }}>
              {type === 'entry' ? `You (${title})` : title}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: '#475467',
              fontWeight: 400,
            }}>
            {time}
          </Text>
        </View>
        {type === 'entry' ? null : (
          <Divider marginVertical={0} style={{marginTop: 9, marginBottom: 12}} />
        )}

        <Text
          style={{
            fontSize: 16,
            color: '#475467',
            fontWeight: 400,
          }}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#444',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingHorizontal: 10,
  },
});

export default ChatItem;
