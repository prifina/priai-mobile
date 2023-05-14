import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {View, StyleSheet} from 'react-native';

import ChatScreen from '../modules/ChatScreen';
import ProfileScreen from '../modules/ProfileScreen';
import SubscriptionsScreen from '../modules/SubscriptionsScreen';

import AppHeader from '../components/AppHeader';

import AboutNavigator from '../modules/about/AboutNavigator';
import ThreadNavigator from '../modules/threads/ThreadNavigator';

import ChatLogo from '../assets/message-chat-circle.svg';
import StarLogo from '../assets/star.svg';
import UserLogo from '../assets/user-circle.svg';
import InfoLogo from '../assets/info-circle.svg';

import AppContext from '../hoc/AppContext';
import ChatScreenDemo from '../modules/ChatScreenDemo';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {demo} = useContext(AppContext);

  return (
    <Tab.Navigator
      initialRouteName="Thread"
      screenOptions={({navigation}) => ({
        headerTitle: () => {},
        headerLeft: props => <AppHeader {...props} navigation={navigation} />,
        tabBarLabel: () => {},
      })}>
      <Tab.Screen
        name="About"
        component={AboutNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <TouchableOpacity>
              {focused ? (
                <View style={styles.activeIcon}>
                  <InfoLogo />
                </View>
              ) : (
                <InfoLogo />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Thread"
        component={demo ? ChatScreenDemo : ThreadNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <TouchableOpacity>
              {focused ? (
                <View style={styles.activeIcon}>
                  <ChatLogo />
                </View>
              ) : (
                <ChatLogo />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TouchableOpacity>
              {focused ? (
                <View style={styles.activeIcon}>
                  <UserLogo />
                </View>
              ) : (
                <UserLogo />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TouchableOpacity>
              {focused ? (
                <View style={styles.activeIcon}>
                  <StarLogo />
                </View>
              ) : (
                <StarLogo />
              )}
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeIcon: {
    alignContent: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: 36,
    height: 36,
    backgroundColor: '#F0FDF9',
    borderRadius: 8,
  },
});

export default AppNavigator;
