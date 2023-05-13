import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

import AppContext from '../hoc/AppContext';

import useHealthKitHooks from '../utils/healthKitUtils';

const MainNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {initHealthKit, getData, getSteps} = useHealthKitHooks();

  const checkHKStatus = async () => {
    setIsLoading(true);
    try {
      const initSuccess = await initHealthKit();
      if (initSuccess) {
        const stepsSuccess = await getData('Calories');
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
    email: '',
  });

  const demo = false;

  const contextValues = {
    defaultValues,
    setDefaultValues,
    demo,
    checkHKStatus,
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
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
