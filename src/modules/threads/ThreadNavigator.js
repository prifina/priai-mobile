import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {TouchableOpacity} from 'react-native';

import ThreadsScreen from './ThreadsScreen';
import NewThread from './NewThread';
import ChatScreen from '../ChatScreen';

import {HeaderBackButton} from '@react-navigation/elements';

import ChevronLeftIcon from '../../assets/chevron-left.svg';

import BackButton from '../../components/BackButton';

const ThreadStack = createNativeStackNavigator();

const ThreadNavigator = () => {
  return (
    <ThreadStack.Navigator initialRouteName="ThreadsNavigator">
      <ThreadStack.Screen
        name="Threads"
        component={ThreadsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ThreadStack.Screen
        name="NewThread"
        component={NewThread}
        options={{
          headerLeft: () => <BackButton navigation={navigation} />,
        }}
      />
      <ThreadStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({navigation}) => ({
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
    </ThreadStack.Navigator>
  );
};

export default ThreadNavigator;
