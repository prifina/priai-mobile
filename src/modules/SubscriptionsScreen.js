import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';
import ContentWrapper from '../components/ContentWrapper';

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
    <ContentWrapper title="Upgrade">
      {/* <Button title="Logout" onPress={logout} /> */}
    </ContentWrapper>
  );
};

export default SubscriptionsScreen;
