import 'react-native-get-random-values';

import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

import AppContext from '../hoc/AppContext';

import useHealthKitHooks from '../utils/healthKitUtils';
import AnimatedLaunchScreen from '../modules/onboarding/AnimatedLaunchScreen';

import {GET_SHARE_COUNT, GET_SHARE_MESSAGE} from '../utils/queries';

import {v4 as uuidv4} from 'uuid';

import config from '../../config';

import axios from 'axios';

const RootStack = createNativeStackNavigator();

const MainNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [shareCount, setShareCount] = useState(100);
  const [shareMessage, setShareMessage] = useState('Default share message');
  const [userId, setUserId] = useState(null);
  const [numberOfPrompts, setNumberOfPrompts] = useState(0);

  const {initHealthKit, getData, getSteps} = useHealthKitHooks();

  const checkHKStatus = async () => {
    setIsLoading(true);
    try {
      const initSuccess = await initHealthKit();
      if (initSuccess) {
        const stepsSuccess = await getSteps('Steps');
        // const caloriesSuccess = await getData('Calories');
        if (stepsSuccess) {
          setIsLoading(false);
          Alert.alert(
            'Success',
            'Data retrieval successful.',
            [{text: 'OK', onPress: () => console.log('OK pressed')}],
            {cancelable: false},
          );
        }
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        'Failed to retrieve health data. Please try again.',
        [
          {text: 'OK', onPress: () => console.log('OK pressed')},
          {text: 'Try Again', onPress: () => checkHKStatus()},
        ],
        {cancelable: false},
      );
    }
  };

  ////authentication implementation needed here
  const isAuthenticated = true;
  ////////

  const [defaultValues, setDefaultValues] = useState({
    name: 'User',
    aiName: 'My AI Assistant',
    email: 'mail@example.com',
  });

  const fetchProfileData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('profileData');
      if (savedData) {
        setDefaultValues(JSON.parse(savedData));
        setIsLoading(false);

        console.log('Data retrieved from AsyncStorage');
      }
    } catch (error) {
      console.log('Error retrieving data from AsyncStorage:', error);

      setDefaultValues(defaultValues);
      Alert.alert(
        'Error',
        'Failed to retrieve profile data. Please set again.',
        [{text: 'OK', onPress: () => console.log('OK pressed')}],
      );
    }
    setIsLoading(false);
  };

  ////userID and message count

  const fetchUserId = async () => {
    try {
      let id = await AsyncStorage.getItem('userId');
      if (id === null) {
        id = uuidv4();
        await AsyncStorage.setItem('userId', id);
      }
      setUserId(id);
    } catch (error) {
      console.error('Failed to load userId', error);
    }
  };

  const fetchShareMessage = async () => {
    try {
      const response = await axios.post(config.GRAPHCMS_API_KEY, {
        query: GET_SHARE_MESSAGE,
        // variables: {userId: "12345"},
      });

      const {data} = response.data;
      console.log('data', data);
      if (data.share) {
        setShareMessage(data.share.shareMessage);
      }
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  useEffect(() => {
    const fetchShareCount = async () => {
      if (userId === null) return;

      try {
        const response = await axios.post(config.GRAPHCMS_API_KEY, {
          query: GET_SHARE_COUNT,
          variables: {userId},
        });
        const {data} = response.data;
        if (data.share) {
          setShareCount(data.share.shareCount);
        }
      } catch (error) {
        console.error('Failed to load share count', error);
      }
    };
    fetchShareCount();
  }, [userId]);

  console.log('MAIN, userID, shareCount', userId, shareCount);

  //////////
  //number of prompts asked

  useEffect(() => {
    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem('numberOfPrompts');
        if (storedValue !== null) {
          setNumberOfPrompts(parseInt(storedValue));
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    })();
  }, []);

  ////

  useEffect(() => {
    setIsLoading(true);

    fetchProfileData();
    fetchUserId();
    fetchShareMessage();
  }, []);

  const contextValues = {
    defaultValues,
    setDefaultValues,
    demo,
    setDemo,
    checkHKStatus,
    shareMessage,
    shareCount,
    setShareCount,
    userId,
    numberOfPrompts,
    setNumberOfPrompts,
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="AnimatedLaunchScreen"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen
          name="AnimatedLaunchScreen"
          component={AnimatedLaunchScreen}
        />
        <RootStack.Screen
          name="MainApp"
          children={() => (
            <View style={styles.safeArea}>
              {isAuthenticated ? (
                <AppContext.Provider value={contextValues}>
                  <AppNavigator />
                </AppContext.Provider>
              ) : (
                <AuthNavigator />
              )}
              {isLoading ? (
                <View style={styles.activityIndicator}>
                  <ActivityIndicator size="large" />
                </View>
              ) : null}
            </View>
          )}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  activityIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default MainNavigator;
