import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ChatScreen from '../modules/ChatScreen';
import ProfileScreen from '../modules/ProfileScreen';
import SubscriptionsScreen from '../modules/SubscriptionsScreen';

import AppHeader from '../components/AppHeader';

import AboutNavigator from '../modules/about/AboutNavigator';

import ChatLogo from '../assets/message-chat-circle.svg';
import StarLogo from '../assets/star.svg';
import UserLogo from '../assets/user-circle.svg';
import InfoLogo from '../assets/info-circle.svg';

import AppContext from '../hoc/AppContext';
import ChatScreenDemo from '../modules/ChatScreenDemo';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {demo} = useContext(AppContext);

  return (
    <Tab.Navigator
      screenOptions={({navigation}) => ({
        headerTitle: () => {},
        headerLeft: props => <AppHeader {...props} navigation={navigation} />,
        tabBarLabel: () => {},
      })}>
      <Tab.Screen
        name="About"
        component={AboutNavigator}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            // <Icon name="info" size={size} color={color} />
            <InfoLogo />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={demo ? ChatScreenDemo : ChatScreen}
        options={({navigation}) => ({
          tabBarIcon: ({focused, color, size}) => <ChatLogo />,
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => <UserLogo />,
        }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => <StarLogo />,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
