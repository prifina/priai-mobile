import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';

// import {Auth} from 'aws-amplify';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const MainNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // async function checkAuth() {
  //   try {
  //     await Auth.currentAuthenticatedUser();
  //     setIsLoggedIn(true);
  //   } catch (err) {
  //     setIsLoggedIn(false);
  //   }
  // }
  const user = true;

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default MainNavigator;
