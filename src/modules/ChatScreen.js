import 'react-native-url-polyfill/auto';

import React, {useState, useLayoutEffect, useContext, useEffect} from 'react';
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

import AppContext from '../hoc/AppContext';
import DotLoader from '../components/DotLoader';

import Voice from '@react-native-voice/voice';

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const ChatScreen = ({navigation}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechError = error => {
    console.log('onSpeechError:', error);
    setSpeechError(error.error.message);
    setIsListening(false);
  };

  const onSpeechResults = event => {
    console.log('onSpeechResults:', event);
    setPrompt(event.value[0]);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('startListening error:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('stopListening error:', error);
    }
  };

  const {defaultValues} = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 16}}
          onPress={() => handleClearChat()}
          title="Save">
          <Text style={{color: '#107569', fontSize: 14, fontWeight: 600}}>
            Clear chat
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState();

  const [stepCount, setStepCount] = useState([]);

  const deviceHeight = useHeaderHeight();

  const handleClearChat = () => {
    setConversation([]);
    setIsLoading(false);
  };

  const handleSteps = async () => {
    setIsLoading(true);

    try {
      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.Steps,
          ],
          // write: [AppleHealthKit.Constants.Permissions.Steps],
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
              speaker: defaultValues.aiName,
              message: `You have taken ${stepCount} steps today.`,
            },
          ]);
          setIsLoading(false);
        });
      });
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong. Please try again.');
      setError(e);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

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
        {speaker: defaultValues.name, message: prompt},
        {speaker: defaultValues.aiName, message: response},
      ]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong. Please try again.');
      // setError(e);
      setIsLoading(false);
    }
    setPrompt('');
  };

  return (
    // <View style={styles.container}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={deviceHeight + 55}>
      {error !== '' && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{error}</Text>
        </View>
      )}
      <ContentWrapper>
        <ScrollView style={styles.conversationContainer}>
          {conversation.map((entry, index) => (
            <View key={index} style={styles.conversationEntry}>
              <Text
                style={
                  entry.speaker === defaultValues.name
                    ? styles.promptText
                    : styles.responseText
                }>
                {entry.speaker}: {entry.message}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ContentWrapper>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          // onSubmitEditing={() => setPrompt()}
          placeholder="How many steps did I take today?"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          {isLoading ? (
            <DotLoader isLoading={isLoading} />
          ) : (
            <Text style={styles.submitButtonText}>Send</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.siriButton}
          onPressIn={startListening}
          onPressOut={stopListening}>
          <Text style={styles.siriButtonText}>Siri</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    height: 55,
  },
  input: {
    flex: 1,
    height: 36,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#444',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  submitButton: {
    marginLeft: 10,
    backgroundColor: '#107569',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  siriButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
  },
  siriButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
