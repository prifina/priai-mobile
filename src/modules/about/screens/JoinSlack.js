import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import slackBanner from '../../../assets/slack-banner.png';
import CheckIcon from '../../../assets/check-icon.svg';
import LinkExternalIcon from '../../../assets/link-external.svg';

const JoinSlack = ({navigation}) => {
  const openSlack = () => {
    const url =
      'https://join.slack.com/t/libertyequalitydata/shared_invite/zt-1v29o2v1y-2PI3eZNfZFeonhlYWMRB9g'; //30 days active

    const urlLED = 'http://libertyequalitydata.com';

    // check if the Slack app installed
    // Linking.canOpenURL(url)
    //   .then(supported => {
    //     if (!supported) {
    //       Linking.openURL('http://apps.apple.com/app/slack/id618783545');
    //     } else {
    //       return Linking.openURL(url);
    //     }
    //   })
    //   .catch(err => console.error('An error occurred', err));

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Linking.openURL(urlLED); // Open the alternative URL
        } else {
          Linking.openURL(url); // Open the Slack URL
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={slackBanner} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Join our vibrant community on Slack to connect with other Pri-AI
              users, share ideas, ask questions, and give feedback to the
              development team.
            </Text>
            <Text style={styles.text}>
              Whether you're a developer, fitness enthusiast, data scientist, or
              just curious about AI and personal data, our community is the
              perfect place to explore and learn more. Help shape the future of
              Pri-AI and be the first to know about new features and updates.
            </Text>
            <View style={styles.row}>
              <CheckIcon />
              <Text style={styles.listItem}>
                Connect with a growing community of Pri-AI users
              </Text>
            </View>
            <View style={styles.row}>
              <CheckIcon />
              <Text style={styles.listItem}>
                Explore the intersection of AI and personal data
              </Text>
            </View>
            <View style={styles.row}>
              <CheckIcon />
              <Text style={styles.listItem}>
                Share ideas and collaborate with other community members
              </Text>
            </View>
            <View style={styles.row}>
              <CheckIcon />
              <Text style={styles.listItem}>
                Help shape the future of Pri-AI
              </Text>
            </View>
            <View style={styles.row}>
              <CheckIcon />
              <Text style={styles.listItem}>
                Be among the first to know about new features and updates
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 20}}>
        <TouchableOpacity
          title="Join Slack"
          onPress={openSlack}
          style={styles.button}>
          <Text style={styles.buttonText}>Join the revolution</Text>
          <LinkExternalIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
  },
  textContainer: {
    paddingHorizontal: 24,
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

export default JoinSlack;
