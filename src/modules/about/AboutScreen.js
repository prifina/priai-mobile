import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Icon from 'react-native-vector-icons/FontAwesome';

import SlackLogo from '../../assets/slack-logo.svg';

const AboutScreen = ({navigation}) => {
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
    <ContentWrapper title="About this app">
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text>Version 0.0.1</Text>
        </View>
        <View style={styles.badge}>
          <Text>Released 5/3/2023</Text>
        </View>
      </View>
      <Text style={{fontSize: 16, marginBottom: 24}}>
        Pri-AI is a privacy-first chatbot app developed by Prifina.inc, which
        extends Chat-GPT’s capabilities by integrating real data from your
        applications and devices.
      </Text>
      <View style={styles.communityContainer}>
        <View style={styles.innerCommunityContainer}>
          <SlackLogo />
          <View style={{marginHorizontal: 16}}>
            <Text style={{fontSize: 16, color: 'white', marginBottom: 5}}>
              Join our community!
            </Text>
            <Text style={{fontSize: 12, color: 'white'}}>
              Help shape the future of Pri-AI in our community Slack group
            </Text>
          </View>
          <Icon name="chevron-right" size={12} color="#EBEBF5" />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('AboutPrifina')}>
          <Text>Open Modal Screen 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DataHandle')}>
          <Text>Open Modal Screen 2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyRoadmap')}>
          <Text>Open Modal Screen 3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
          <Text>Open Modal Screen 4</Text>
        </TouchableOpacity>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    maxWidth: 241,
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeContainer: {
    width: '65%',
    flexDirection: 'row',
    marginBottom: 16,
  },
  communityContainer: {
    padding: 24,
    backgroundColor: '#F0FDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCommunityContainer: {
    height: 96,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#0E9384',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2ED3B7',
    padding: 24,
  },
});

export default AboutScreen;
