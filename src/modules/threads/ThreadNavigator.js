import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ThreadsScreen from './ThreadsScreen';
import NewThread from './NewThread';
import ChatScreen from '../ChatScreen';

const ThreadStack = createNativeStackNavigator();

const ThreadNavigator = () => {
  return (
    <ThreadStack.Navigator initialRouteName="ThreadsNavigator">
      <ThreadStack.Screen name="Threads" component={ThreadsScreen} />
      <ThreadStack.Screen name="NewThread" component={NewThread} />
      <ThreadStack.Screen name="Chat" component={ChatScreen} />
    </ThreadStack.Navigator>
  );
};

export default ThreadNavigator;
