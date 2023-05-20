import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import ContentWrapper from '../../../components/ContentWrapper';

import aboutPrifinaBanner from '../../../assets/about-prifina-banner.png';
import CheckIcon from '../../../assets/check-icon.svg';
import LinkExternalIcon from '../../../assets/link-external.svg';

import ChevronLeftIcon from '../../../assets/chevron-left.svg';

import WebView from 'react-native-webview';
import BackButton from '../../../components/BackButton';

const AboutPrifina = ({navigation}) => {
  const [showWebView, setShowWebView] = useState(false);

  const openPrifinaWebsite = () => {
    setShowWebView(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
  };

  const InnerBackButton = ({onPress}) => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={onPress}
        hitSlop={{top: 30, bottom: 30, left: 10, right: 30}}>
        <ChevronLeftIcon />
        <Text style={{marginLeft: 5}}>Back</Text>
      </TouchableOpacity>
    );
  };

  const handleHeader = () => {
    if (showWebView) {
      navigation.setOptions({
        headerLeft: () => {},
      });
    } else {
      navigation.setOptions({
        headerLeft: () => <BackButton navigation={navigation} />,
      });
    }
  };

  useEffect(() => {
    handleHeader();
  }, [showWebView]);

  return (
    <View style={styles.container}>
      {showWebView ? (
        <>
          <View
            style={{
              height: 42,
              paddingHorizontal: 24,
              paddingVertical: 11,
              alignItems: 'center',
              backgroundColor: 'white',
              flexDirection: 'row',
            }}>
            <InnerBackButton onPress={closeWebView} />
          </View>
          <WebView source={{uri: 'https://www.prifina.com'}} />
        </>
      ) : (
        <>
          <ContentWrapper title="About Prifina">
            <View style={styles.imageContainer}>
              <Image source={aboutPrifinaBanner} style={styles.image} />
            </View>
            <Text style={styles.title}>
              Prifina provides a personal data platform where the data is owned
              by individuals themselves. Anyone can build services for people to
              live happier and healthier lives.​
            </Text>
            <View style={styles.textContainer}>
              <View style={styles.row}>
                <CheckIcon />
                <Text style={styles.listItem}>
                  Individuals retain full ownership and control of their data.
                </Text>
              </View>
              <View style={styles.row}>
                <CheckIcon />
                <Text style={styles.listItem}>
                  Suite of tools which empower users to control and enhance
                  their data.
                </Text>
              </View>
              <View style={styles.row}>
                <CheckIcon />
                <Text style={styles.listItem}>Private AI integration</Text>
              </View>
              <View style={styles.row}>
                <CheckIcon />
                <Text style={styles.listItem}>
                  Marketplace of privacy-by-design apps to leverage the power of
                  your data.
                </Text>
              </View>
              <View style={styles.row}>
                <CheckIcon />
                <Text style={styles.listItem}>
                  Diverse sensor support enables personalized experiences.
                </Text>
              </View>
            </View>
          </ContentWrapper>
          <View style={{paddingHorizontal: 16}}>
            <TouchableOpacity
              title="Join Slack"
              onPress={openPrifinaWebsite}
              style={styles.button}>
              <Text style={styles.buttonText}>Join the revolution</Text>
              <LinkExternalIcon />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
  },
  textContainer: {
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  title: {
    color: '#134E48',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 20,
  },
  text: {
    marginBottom: 56,
    color: '#475467',
    fontWeight: '400',
    lineHeight: 24,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  listItem: {
    marginLeft: 12,
    color: '#475467',
    fontWeight: '400',
    lineHeight: 24,
    fontSize: 16,
    marginRight: 10,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#0E9384',
    borderRadius: 8,
    marginHorizontal: 0,
    marginBottom: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default AboutPrifina;
