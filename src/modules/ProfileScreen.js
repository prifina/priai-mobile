import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import ContentWrapper from '../components/ContentWrapper';

import Icon from 'react-native-vector-icons/FontAwesome';

import AppContext from '../hoc/AppContext';

const ProfileScreen = ({navigation}) => {
  const {defaultValues, setDefaultValues} = useContext(AppContext);

  console.log('def values', defaultValues);

  const handleSave = () => {
    console.log('Nested state:', defaultValues);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 16}}
          onPress={handleSave}
          title="Save">
          <Text style={{color: '#107569', fontSize: 14, fontWeight: 600}}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const openAppPrivacySettings = () => {
    const packageName = 'com.yourpackagename'; // Replace with your app's package name
    const scheme =
      Platform.OS === 'ios' ? 'app-settings://' : `package:${packageName}`;
    const url = `${scheme}privacy`;

    Linking.openURL(url);
  };

  /////APPLE HEALTHKIT

  /* Permission options */
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.Steps,
      ],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  };

  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
  };

  AppleHealthKit.initHealthKit(permissions, error => {
    /* Called after we receive a response from the system */

    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
    }

    /* Can now read or write to HealthKit */

    AppleHealthKit.getHeartRateSamples(options, (callbackError, results) => {
      /* Samples are now collected from HealthKit */
    });
  });

  const [stepCount, setStepCount] = useState([]);

  AppleHealthKit.getStepCount(options, (err, results) => {
    if (err) {
      console.log('error results');

      return;
    }
    console.log('results', results);
    setStepCount(results.value);
  });

  const deviceHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={deviceHeight + 65}>
      <ContentWrapper title="Profile and settings">
        <Text
          style={{
            fontSize: 18,
            marginBottom: 12,
            color: '#134E48',
            fontWeight: 600,
          }}>
          Health apps and devices
        </Text>
        <Text style={{fontSize: 16}}>
          Connect your AI assistant to additional data sources to get
          personalized insights.
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#EAECF0',
            marginVertical: 20,
          }}
        />
        <View
          style={styles.customButton}
          onPress={() => navigation.navigate('DataHandle')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 600, marginLeft: 16}}>
              Apple Health
            </Text>
            <View style={styles.buttonBadge}>
              <Text style={{color: '#027A48'}}>Active</Text>
            </View>
          </View>
          <TouchableOpacity onPress={openAppPrivacySettings}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#107569',
              }}>
              Manage
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newSourcesContainer}>
          <Text
            style={{
              color: '#125D56',
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 5,
            }}>
            New sources coming soon!
          </Text>
          <Text style={{color: '#125D56', fontWeight: 400, fontSize: 12}}>
            We will be rolling out support for more types of data shortly. Watch
            this space!
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 12,
            color: '#134E48',
            fontWeight: 600,
          }}>
          Additional information
        </Text>
        <Text style={{fontSize: 16}}>
          Personalize your Pri-AI experience and manage contact channels here
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#EAECF0',
            marginVertical: 20,
          }}
        />
        <View>
          <View style={{marginBottom: 20}}>
            <Text style={{marginBottom: 5, fontWeight: 500}}>Full name</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D0D5DD',
                borderRadius: 8,
                height: 44,
                padding: 10,
              }}
              placeholder="Enter your name"
              value={defaultValues.name}
              onChangeText={name => setDefaultValues({...defaultValues, name})}
            />
            <Text style={{marginTop: 5, color: '#475467', fontWeight: 400}}>
              Your AI will call you this
            </Text>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={{marginBottom: 5, fontWeight: 500}}>
              Name your AI assistant
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D0D5DD',
                borderRadius: 8,
                height: 44,
                padding: 10,
              }}
              placeholder="Enter your name"
              value={defaultValues.aiName}
              onChangeText={aiName =>
                setDefaultValues({...defaultValues, aiName})
              }
            />
            <Text style={{marginTop: 5, color: '#475467', fontWeight: 400}}>
              Call your assistant this
            </Text>
          </View>
          <View style={{marginBottom: 50}}>
            <Text style={{marginBottom: 5, fontWeight: 500}}>
              Email address
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D0D5DD',
                borderRadius: 8,
                height: 44,
                padding: 10,
              }}
              placeholder="Enter your name"
              value={defaultValues.email}
              onChangeText={email =>
                setDefaultValues({...defaultValues, email})
              }
            />
            <Text style={{marginTop: 5, color: '#475467', fontWeight: 400}}>
              We will use this to contact you
            </Text>
          </View>
        </View>
      </ContentWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonBadge: {
    fontSize: 12,
    maxWidth: 241,
    backgroundColor: '#ECFDF3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 18,
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
    paddingLeft: 16,
    paddingRight: 24,
    marginBottom: 16,
  },
  newSourcesContainer: {
    padding: 24,
    backgroundColor: '#F0FDF9',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#5FE9D0',
    borderRadius: 8,
  },
});

export default ProfileScreen;
