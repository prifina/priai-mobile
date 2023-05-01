import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';

const SubscriptionsScreen = () => {
  const logout = async () => {
    // try {
    //   await Auth.signOut();
    //   // Perform any additional actions upon successful logout
    //   console.log('successful logout');
    // } catch (error) {
    //   console.log('Error signing out: ', error);
    // }
    console.log('Error signing out: ', error);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default SubscriptionsScreen;
