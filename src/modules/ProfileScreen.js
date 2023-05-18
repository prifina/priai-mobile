import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  TextInput,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AppleHealthKit from 'react-native-health';

import ContentWrapper from '../components/ContentWrapper';

import Icon from 'react-native-vector-icons/FontAwesome';

import AppContext from '../hoc/AppContext';
import Divider from '../components/Divider';

import useToast from '../utils/useToast';
import Toast from '../components/Toast';

const ProfileScreen = ({navigation}) => {
  const {defaultValues, setDefaultValues, checkHKStatus, demo, setDemo} =
    useContext(AppContext);

  const [newValues, setNewValues] = useState({
    name: defaultValues.name,
    aiName: defaultValues.aiName,
    email: defaultValues.email,
  });

  const {toastConfig, showToast, hideToast} = useToast();

  const [isVisible, setIsVisible] = useState(false);

  console.log('visible', isVisible);

  useEffect(() => {
    const isDefaultEqualToNew = Object.keys(defaultValues).every(
      key => defaultValues[key] === newValues[key],
    );

    setIsVisible(!isDefaultEqualToNew);
  }, [newValues]);

  const [isAuthorized, setIsAuthorized] = useState(true);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(newValues));
      setDefaultValues(newValues); // Update defaultValues with newValues
      setIsVisible(false);
      console.log('Data saved to AsyncStorage');

      showToast('Saved!', 'success');
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
      showToast('Changes not saved!', 'error');
    }
  };

  console.log('def values', defaultValues);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isVisible && (
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
  }, [navigation, isVisible]);

  const openAppPrivacySettings = () => {
    const packageName = 'org.reactjs.native.example.priai';
    const scheme =
      Platform.OS === 'ios' ? 'app-settings://' : `package:${packageName}`;
    const url = `${scheme}privacy`;

    Linking.openURL(url);
  };

  const deviceHeight = useHeaderHeight();

  const openHealthKitPermissionsScreen = async () => {
    try {
      const authStatus = await AppleHealthKit.getAuthStatus({
        permissions: {
          read: ['Height', 'Weight', 'StepCount'], // Add the necessary read permissions here
          write: ['Height', 'Weight'], // Add the necessary write permissions here
        },
      });

      if (authStatus === 'unknown' || authStatus === 'denied') {
        // Open the HealthKit permissions screen
        await AppleHealthKit.requestPermissions({
          permissions: {
            read: ['Height', 'Weight', 'StepCount'], // Add the necessary read permissions here
            write: ['Height', 'Weight'], // Add the necessary write permissions here
          },
        });
      } else if (authStatus === 'restricted') {
        // Handle restricted access
        console.log('HealthKit access is restricted.');
      } else if (authStatus === 'authorized') {
        // HealthKit is already authorized
        console.log('HealthKit access is already authorized.');
      }
    } catch (error) {
      // Handle error
      console.log('Error:', error);
    }
  };

  const handleSwitchDemoMode = () => {
    setDemo(!demo);
  };

  console.log('DEMO', demo);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={deviceHeight + 50}>
      {toastConfig && (
        <Toast visible={true} {...toastConfig} onDismiss={hideToast} />
      )}
      <ContentWrapper title="Profile and settings">
        <View style={styles.demoContainer}>
          <Text
            style={{
              fontSize: 18,
              color: '#134E48',
              fontWeight: 600,
            }}>
            Demo mode
          </Text>

          <Switch value={demo} onValueChange={handleSwitchDemoMode} />
        </View>
        <Text style={{fontSize: 16, marginBottom: 12}}>
          Experience the full capabilities of Pri-AI, using artificial
          connections and data.
        </Text>
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

        <Divider />
        <View
          style={styles.customButton}
          onPress={() => navigation.navigate('DataHandle')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 600, marginLeft: 16}}>
              Apple Health
            </Text>
            <View style={styles.buttonBadge}>
              {isAuthorized ? (
                <Text style={{color: '#027A48'}}>Active</Text>
              ) : (
                <Text style={{color: 'red'}}>Inactive</Text>
              )}
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={checkHKStatus}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#107569',
                }}>
                Sync
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openHealthKitPermissionsScreen}
              style={{marginLeft: 12}}>
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
        <Divider />
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
              value={newValues.name}
              onChangeText={name => {
                setNewValues({...newValues, name});
              }}
              returnKeyType="done"
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
              value={newValues.aiName}
              onChangeText={aiName => {
                setNewValues({...newValues, aiName});
              }}
              returnKeyType="done"
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
              value={newValues.email}
              onChangeText={email => {
                setNewValues({...newValues, email});
              }}
              returnKeyType="done"
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
    // backgroundColor: '#ECFDF3',
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
  demoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  text: {
    fontSize: 16,
  },
});

export default ProfileScreen;
