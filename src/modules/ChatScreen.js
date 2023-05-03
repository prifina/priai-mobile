import 'react-native-url-polyfill/auto';

import React, {useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';

import {useHeaderHeight} from '@react-navigation/elements';

import {Configuration, OpenAIApi} from 'openai';

import AppleHealthKit from 'react-native-health';
import ContentWrapper from '../components/ContentWrapper';

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const ChatScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setConversation([])} title="Clear chat" />
      ),
    });
  }, [navigation]);

  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');

  const [stepCount, setStepCount] = useState([]);

  const deviceHeight = useHeaderHeight();

  const handleSteps = async () => {
    try {
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

        AppleHealthKit.getStepCount(options, (err, results) => {
          if (err) {
            console.log('error getting step count:', err);
            return;
          }
          console.log('step count:', results);
          setStepCount(results.value);
          setApiResponse(`You have taken ${stepCount} steps today.`);
          setConversation([
            ...conversation,
            {
              speaker: 'AI Bot',
              message: `You have taken ${stepCount} steps today.`,
            },
          ]);
        });
      });
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong. Please try again.');
      setError(e);
    }
  };

  const handleSubmit = async () => {
    if (prompt.toLowerCase().includes('steps')) {
      await handleSteps();
      setPrompt('');
      return;
    }
    try {
      const result = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 4000,
      });
      const response = result.data.choices[0].text;
      setApiResponse(response);
      setConversation([
        ...conversation,
        {speaker: 'You', message: prompt},
        {speaker: 'AI Bot', message: response},
      ]);
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong. Please try again.');
      setError(e);
    }
    setPrompt('');
  };

  return (
    // <View style={styles.container}>
    <ContentWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={deviceHeight + 55}>
        {error !== '' && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{error}</Text>
          </View>
        )}
        <ScrollView style={styles.conversationContainer}>
          {conversation.map((entry, index) => (
            <View key={index} style={styles.conversationEntry}>
              <Text
                style={
                  entry.speaker === 'You'
                    ? styles.promptText
                    : styles.responseText
                }>
                {entry.speaker}: {entry.message}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Ask me something..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ContentWrapper>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  conversationEntry: {
    paddingVertical: 5,
  },
  promptText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
    height: 48,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#444',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  submitButton: {
    marginLeft: 10,
    backgroundColor: '#0095ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  responseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default ChatScreen;
