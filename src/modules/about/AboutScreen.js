import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';

import SlackLogo from '../../assets/slack-logo.svg';
import HandleDataIcon from '../../assets/button-icons/handle-data-button-icon.svg';
import PrifinaButtonIcon from '../../assets/button-icons/prifina-button-icon.svg';
import PrivacyButtonIcon from '../../assets/button-icons/privacy-button-icon.svg';
import TermsButtonIcon from '../../assets/button-icons/terms-button-icon.svg';

const AboutScreen = ({navigation}) => {
  return (
    <ContentWrapper title="About this app">
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text>Version 0.0.2</Text>
        </View>
        <View style={styles.badge}>
          <Text>Released 11/5/2023</Text>
        </View>
      </View>
      <Text style={{fontSize: 16, marginBottom: 24}}>
        Pri-AI is a privacy-first chatbot app developed by Prifina.inc, which
        extends Chat-GPT’s capabilities by integrating real data from your
        applications and devices.
      </Text>
      <TouchableOpacity>
        <View style={styles.communityContainer}>
          <LinearGradient
            colors={['#134E48', '#0E9384']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.innerCommunityContainer}>
            <SlackLogo />
            <View style={{marginHorizontal: 16}}>
              <Text style={{fontSize: 16, color: 'white', marginBottom: 5}}>
                Join our community!
              </Text>
              <View>
                <Text style={{fontSize: 12, color: 'white'}}>
                  Help shape the future of Pri-AI
                </Text>
                <Text style={{fontSize: 12, color: 'white'}}>
                  in our community Slack group
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={12} color="#EBEBF5" />
          </LinearGradient>
        </View>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('AboutPrifina')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <PrifinaButtonIcon />
            <Text style={{fontSize: 16, fontWeight: 600, marginLeft: 16}}>
              About Prifina
            </Text>
          </View>
          <Icon name="chevron-right" size={12} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('DataHandle')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <HandleDataIcon />
            <Text style={{fontSize: 16, fontWeight: 600, marginLeft: 16}}>
              How we handle your data
            </Text>
          </View>
          <Icon name="chevron-right" size={12} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('PrivacyRoadmap')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <PrivacyButtonIcon />
            <Text style={{fontSize: 16, fontWeight: 600, marginLeft: 16}}>
              Privacy roadmap
            </Text>
          </View>
          <Icon name="chevron-right" size={12} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Terms')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TermsButtonIcon />
            <Text style={{fontSize: 16, fontWeight: 600, marginLeft: 16}}>
              Terms and conditions
            </Text>
          </View>
          <Icon name="chevron-right" size={12} color="gray" />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F0FDF9',
    marginBottom: 16,
  },
  innerCommunityContainer: {
    height: 96,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2ED3B7',
    paddingHorizontal: 16,
  },
  customButton: {
    height: 46,
    backgroundColor: '#F9FAFB',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default AboutScreen;
