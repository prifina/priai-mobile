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
          paddingHorizontal: 16,
        }}>
        <PriAILogo />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#134E48',
            lineHeight: 30,
            marginLeft: 10,
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
