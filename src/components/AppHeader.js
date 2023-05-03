import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import PriAILogo from '../assets/pri-ai-logo.svg';

const AppHeader = ({navigation, ...props}) => {
  const {routeName, rightButton} = props;

  return (
    <>
      <View
        style={{
          height: 42,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <PriAILogo />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#667085',
            lineHeight: 28,
            marginLeft: 11,
          }}>
          Pri-AI
        </Text>
      </View>
    </>
  );
};

export default AppHeader;
