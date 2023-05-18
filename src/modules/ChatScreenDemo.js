import 'react-native-url-polyfill/auto';

import React, {
  useState,
  useLayoutEffect,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {Configuration, OpenAIApi} from 'openai';

import {WebView} from 'react-native-webview';

import AppContext from '../hoc/AppContext';
import DotLoader from '../components/DotLoader';

import Voice from '@react-native-voice/voice';

import SendIcon from '../assets/send-icon.svg';
import MicrophoneIcon from '../assets/microphone.svg';
import ChatItem from './chat/ChatItem';

import config from '../../config';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

console.log('env', config.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const ChatScreenDemo = ({navigation}) => {
  // const {defaultValues} = useContext(AppContext);

  // const [isLoading, setIsLoading] = useState(false);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     header: () => {},
  //   });
  // }, [navigation]);

  // const [prompt, setPrompt] = useState('');
  // const [apiResponse, setApiResponse] = useState('');
  // const [conversation, setConversation] = useState([]);
  // const [error, setError] = useState();

  // const timeStamp = Date.now();

  // const formatDateToHoursAndMinutes = timestamp => {
  //   const date = new Date(timestamp);

  //   const dayNames = [
  //     'Sunday',
  //     'Monday',
  //     'Tuesday',
  //     'Wednesday',
  //     'Thursday',
  //     'Friday',
  //     'Saturday',
  //   ];
  //   const dayIndex = date.getDay();
  //   const day = dayNames[dayIndex];

  //   const timeString = date.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: 'numeric',
  //     hour12: true,
  //   });

  //   return `${day} ${timeString}`;
  // };

  // const formattedDate = formatDateToHoursAndMinutes(timeStamp);

  // const deviceHeight = useHeaderHeight();

  // const handleClearChat = () => {
  //   setConversation([]);
  //   setIsLoading(false);
  // };

  // const handleSubmit = async () => {
  //   setIsLoading(true);

  //   try {
  //     const result = await openai.createCompletion({
  //       model: 'text-davinci-003',
  //       prompt: prompt,
  //       temperature: 0.5,
  //       max_tokens: 4000,
  //     });
  //     const response = result.data.choices[0].text;
  //     setApiResponse(response);
  //     setConversation([
  //       ...conversation,
  //       {speaker: defaultValues.name, message: prompt, time: formattedDate},
  //       {speaker: defaultValues.aiName, message: response, time: formattedDate},
  //     ]);
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setApiResponse('Something went wrong. Please try again.');
  //     setIsLoading(false);
  //   }
  //   setPrompt('');
  // };

  // ////=========////=========////=========////=========////=========////=========////=========////=========////========= speech to text

  // const [isListening, setIsListening] = useState(false);
  // const [speechError, setSpeechError] = useState('');

  // const fadeAnim = useState(new Animated.Value(0))[0];

  // useEffect(() => {
  //   Voice.onSpeechStart = onSpeechStart;
  //   Voice.onSpeechEnd = onSpeechEnd;
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);

  // const onSpeechStart = () => {
  //   setIsListening(true);
  //   setPrompt(''); // Clear the prompt

  //   // Start the animation
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const onSpeechEnd = () => {
  //   setIsListening(false);

  //   // End the animation
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();

  //   // Submit the prompt after a short delay
  //   setTimeout(() => {
  //     handleSubmit();
  //   }, 500);
  // };
  // const onSpeechError = error => {
  //   console.log('onSpeechError:', error);
  //   setSpeechError(error.error.message);
  //   setIsListening(false);
  // };

  // const onSpeechResults = event => {
  //   console.log('onSpeechResults:', event);
  //   setPrompt(event.value[0]);
  // };

  // const startListening = async () => {
  //   try {
  //     await Voice.start('en-US');
  //   } catch (error) {
  //     console.error('startListening error:', error);
  //   }
  // };

  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //   } catch (error) {
  //     console.error('stopListening error:', error);
  //   }
  // };

  // const scrollViewRef = useRef();

  // useEffect(() => {
  //   scrollViewRef.current.scrollToEnd({animated: true});
  // }, [conversation]);

  // console.log('conversation', conversation);

  // return (
  //   <KeyboardAvoidingView
  //     style={styles.container}
  //     behavior="padding"
  //     keyboardVerticalOffset={deviceHeight + 55}
  //   >
  {
    /* {error !== '' && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.conversationContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {conversation.map((item, index) => (
          <View key={index} style={styles.conversationEntry}>
            <ChatItem
              type={item.speaker === defaultValues.name ? 'entry' : 'response'}
              title={item.speaker}
              time={item.time}
              message={item.message}
            />
          </View>
        ))}
      </ScrollView>

      {isListening ? <DotLoader isLoading={isListening} /> : null}

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="How many steps did I take today?"
            placeholderTextColor="#aaa"
          />
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleSubmit}>
              {isLoading ? <DotLoader isLoading={isLoading} /> : <SendIcon />}
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPressIn={startListening}
              onPressOut={stopListening}>
              <MicrophoneIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View> */
  }
  {
    /* <WebView source={{uri: 'https://priai-mobile-vercel-demo.vercel.app/'}} />
    </KeyboardAvoidingView>
  ); */
  }
  const [webViewWidth, setWebViewWidth] = useState(
    Dimensions.get('window').width,
  );

  useEffect(() => {
    const handleDimensionsChange = ({window}) => {
      setWebViewWidth(window.width);
    };

    Dimensions.addEventListener('change', handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <WebView
        style={{width: webViewWidth}}
        source={{uri: 'https://priai-mobile-vercel-demo.vercel.app/'}}
      />
    </SafeAreaView>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    // borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 24,
    height: 48,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',

    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  icon: {
    paddingHorizontal: 10,
  },
  responseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default ChatScreenDemo;
