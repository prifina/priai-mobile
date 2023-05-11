import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import PriAILogo from '../assets/pri-ai-logo.svg';
import AppContext from '../hoc/AppContext';

const AppHeader = ({navigation, ...props}) => {
  const {routeName, rightButton} = props;

  const {defaultValues, setDefaultValues, demo} = useContext(AppContext);

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
          {defaultValues.aiName === 'My AI Assistant'
            ? 'Pri-AI'
            : defaultValues.aiName}
        </Text>
      </View>
    </>
  );
};

export default AppHeader;
