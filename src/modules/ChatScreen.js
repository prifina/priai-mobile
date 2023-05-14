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
  Platform,
  Button,
  Animated,
  Alert,
} from 'react-native';

import {useHeaderHeight} from '@react-navigation/elements';

import {Configuration, OpenAIApi} from 'openai';

import AppContext from '../hoc/AppContext';
import DotLoader from '../components/DotLoader';

import Voice from '@react-native-voice/voice';

import SendIcon from '../assets/send-icon.svg';
import MicrophoneIcon from '../assets/microphone.svg';
import ChatItem from './chat/ChatItem';

import AsyncStorage from '@react-native-async-storage/async-storage';

import useDatabaseHooks from '../utils/useDatabaseHooks';

import {
  formatDateToHoursAndMinutes,
  isSameDay,
  addDays,
  lastDayOfWeek,
  monthNames,
  daysOfWeek,
} from '../utils/dateUtils';

import config from '../../config';
import Toast from '../components/Toast';

import useToast from '../utils/useToast';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

// console.log('env', config.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const ChatScreen = ({navigation}) => {
  const {defaultValues, checkHKStatus} = useContext(AppContext);

  const {createTable, insertData, retrieveData, calculateAverage} =
    useDatabaseHooks();

  const {toastConfig, showToast, hideToast} = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState();

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const [firstLaunch, setFirstLaunch] = useState(null);

  const deviceHeight = useHeaderHeight();

  const timeStamp = Date.now();

  const formattedDate = formatDateToHoursAndMinutes(timeStamp);

  const handleClearChat = () => {
    setConversation([]);

    setIsLoading(false);
    setIsListening(false);

    showToast('Your action was successful!', 'success');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        conversation.length !== 0 ? (
          <TouchableOpacity
            style={{marginRight: 16}}
            onPress={() => handleClearChat()}
            title="Save">
            <Text style={{color: '#107569', fontSize: 14, fontWeight: 600}}>
              Clear chat
            </Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [conversation]);

  // check for first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('firstLaunch');
        if (value === null) {
          // first launch, set firstLaunch in AsyncStorage to false
          await AsyncStorage.setItem('firstLaunch', 'false');
          setFirstLaunch(true);
        } else {
          setFirstLaunch(false);
        }
      } catch (error) {
        // error trying to get value from AsyncStorage
        console.log('AsyncStorage Error: ' + error);
      }
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (firstLaunch === true) {
      checkHKStatus();
    }
  }, [firstLaunch]);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (prompt.toLowerCase().includes('steps')) {
      if (prompt.toLowerCase().includes('today')) {
        retrieveData('Steps', steps => {
          const todaySteps = steps.find(step =>
            isSameDay(new Date(step.date), new Date()),
          );
          if (todaySteps) {
            setApiResponse(`You have taken ${todaySteps.steps} steps today.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },

              {
                speaker: defaultValues.aiName,
                message: `You have taken ${todaySteps.steps} steps today.`,
                time: formattedDate,
              },
            ]);
          } else {
            setApiResponse(`You have taken 0 steps today.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },
              {
                speaker: defaultValues.aiName,
                message: `You have taken 0 steps today.`,
                time: formattedDate,
              },
            ]);
          }
        });
      } else if (prompt.toLowerCase().includes('last')) {
        for (let day of daysOfWeek) {
          if (prompt.toLowerCase().includes(`last ${day}`)) {
            retrieveData('Steps', steps => {
              const lastDaySteps = steps.find(step =>
                isSameDay(new Date(step.date), lastDayOfWeek(day)),
              );
              if (lastDaySteps) {
                setApiResponse(
                  `You have taken ${lastDaySteps.steps} steps last ${day}.`,
                );
                setConversation([
                  ...conversation,
                  {
                    speaker: defaultValues.name,
                    message: prompt,
                    time: formattedDate,
                  },

                  {
                    speaker: defaultValues.aiName,
                    message: `You have taken ${lastDaySteps.steps} steps last ${day}.`,
                    time: formattedDate,
                  },
                ]);
              } else {
                setApiResponse(`You have taken 0 steps last ${day}.`);
                setConversation([
                  ...conversation,
                  {
                    speaker: defaultValues.name,
                    message: prompt,
                    time: formattedDate,
                  },

                  {
                    speaker: defaultValues.aiName,
                    message: `You have taken 0 steps last ${day}.`,
                    time: formattedDate,
                  },
                ]);
              }
            });
            break;
          }
        }
      } else if (prompt.toLowerCase().includes('yesterday')) {
        retrieveData('Steps', steps => {
          const yesterdaySteps = steps.find(step =>
            isSameDay(new Date(step.date), addDays(new Date(), -1)),
          );
          if (yesterdaySteps) {
            setApiResponse(
              `You have taken ${yesterdaySteps.steps} steps yesterday.`,
            );
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },

              {
                speaker: defaultValues.aiName,
                message: `You have taken ${yesterdaySteps.steps} steps yesterday.`,
                time: formattedDate,
              },
            ]);
          } else {
            setApiResponse(`You have taken 0 steps yesterday.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },

              {
                speaker: defaultValues.aiName,
                message: `You have taken 0 steps yesterday.`,
                time: formattedDate,
              },
            ]);
          }
        });
      } else if (prompt.toLowerCase().includes('average')) {
        // Parse date range from user input
        const dateRegex =
          /average from ([a-zA-Z]+\s\d{1,2},\s\d{4}) to ([a-zA-Z]+\s\d{1,2},\s\d{4})/i;
        const match = prompt.match(dateRegex);
        if (match) {
          const startDate = new Date(match[1]);
          const endDate = new Date(match[2]);
          if (startDate && endDate) {
            calculateAverage('Steps', 'steps', startDate, endDate, average => {
              setApiResponse(
                `Your average steps from ${startDate.toDateString()} to ${endDate.toDateString()} was ${Math.round(
                  average,
                )}.`,
              );
              setConversation([
                ...conversation,
                {
                  speaker: defaultValues.name,
                  message: prompt,
                  time: formattedDate,
                },
                {
                  speaker: defaultValues.aiName,
                  message: `Your average steps from ${startDate.toDateString()} to ${endDate.toDateString()} was ${Math.round(
                    average,
                  )}.`,
                  time: formattedDate,
                },
              ]);
            });
          } else {
            setApiResponse(
              'Sorry, I did not understand the date range. Please use the format "Month Day, Year".',
            );
            setIsLoading(false);
          }
        } else {
          setApiResponse('Sorry, I did not understand your question.');
          setIsLoading(false);
        }
      } else if (prompt.toLowerCase().includes('on')) {
        // Retrieve step count for a specific date

        const dateRegex =
          /on ([a-zA-Z]+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})?/i;
        const match = prompt.match(dateRegex);
        if (match) {
          const month = monthNames.indexOf(match[1].toLowerCase());
          const day = parseInt(match[2], 10);
          const year = match[3]
            ? parseInt(match[3], 10)
            : new Date().getFullYear(); // If year is not specified, use current year
          const selectedDate = new Date(year, month, day);

          retrieveData('Steps', steps => {
            const selectedDateSteps = steps.find(step =>
              isSameDay(new Date(step.date), selectedDate),
            );
            if (selectedDateSteps) {
              setApiResponse(
                `You have taken ${
                  selectedDateSteps.steps
                } steps on ${selectedDate.toDateString()}.`,
              );
              setConversation([
                ...conversation,
                {
                  speaker: defaultValues.name,
                  message: prompt,
                  time: formattedDate,
                },
                {
                  speaker: defaultValues.aiName,
                  message: `You have taken ${
                    selectedDateSteps.steps
                  } steps on ${selectedDate.toDateString()}.`,
                  time: formattedDate,
                },
              ]);
            } else {
              setApiResponse(
                `No step count data available for ${selectedDate.toDateString()}.`,
              );
              setConversation([
                ...conversation,
                {
                  speaker: defaultValues.name,
                  message: prompt,
                  time: formattedDate,
                },
                {
                  speaker: defaultValues.aiName,
                  message: `No step count data available for ${selectedDate.toDateString()}.`,
                  time: formattedDate,
                },
              ]);
            }
          });
        } else {
          setApiResponse('Sorry, I did not understand your question.');
          setIsLoading(false);
          return;
        }
      } else {
        setApiResponse('Sorry, I did not understand your question.');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setIsListening(false);
      setPrompt('');
      return;
    }

    ///here implement calories statement
    if (prompt.toLowerCase().includes('calories')) {
      if (prompt.toLowerCase().includes('today')) {
        retrieveData('Calories', calories => {
          const todayCalories = calories.find(calorie =>
            isSameDay(new Date(calorie.date), new Date()),
          );
          if (todayCalories) {
            setApiResponse(
              `You have burned ${todayCalories.calories} calories today.`,
            );
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },
              {
                speaker: defaultValues.aiName,
                message: `You have burned ${todayCalories.calories} calories today.`,
                time: formattedDate,
              },
            ]);
          } else {
            setApiResponse(`You have burned 0 calories today.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },
              {
                speaker: defaultValues.aiName,
                message: `You have burned 0 calories today.`,
                time: formattedDate,
              },
            ]);
          }
        });
      } else if (prompt.toLowerCase().includes('last')) {
        for (let day of daysOfWeek) {
          if (prompt.toLowerCase().includes(`last ${day}`)) {
            retrieveData('Calories', calories => {
              const lastDayCalories = calories.find(calorie =>
                isSameDay(new Date(calorie.date), lastDayOfWeek(day)),
              );
              if (lastDayCalories) {
                setApiResponse(
                  `You have burned ${lastDayCalories.calories} calories last ${day}.`,
                );
                setConversation([
                  ...conversation,
                  {
                    speaker: defaultValues.name,
                    message: prompt,
                    time: formattedDate,
                  },
                  {
                    speaker: defaultValues.aiName,
                    message: `You have burned ${lastDayCalories.calories} calories last ${day}.`,
                    time: formattedDate,
                  },
                ]);
              } else {
                setApiResponse(`You have burned 0 calories last ${day}.`);
                setConversation([
                  ...conversation,
                  {
                    speaker: defaultValues.name,
                    message: prompt,
                    time: formattedDate,
                  },
                  {
                    speaker: defaultValues.aiName,
                    message: `You have burned 0 calories last ${day}.`,
                    time: formattedDate,
                  },
                ]);
              }
            });
            break;
          }
        }
      } else if (prompt.toLowerCase().includes('yesterday')) {
        retrieveData('Calories', calories => {
          const yesterdayCalories = calories.find(calorie =>
            isSameDay(new Date(calorie.date), addDays(new Date(), -1)),
          );
          if (yesterdayCalories) {
            setApiResponse(
              `You have burned ${yesterdayCalories.calories} calories yesterday.`,
            );
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },
              {
                speaker: defaultValues.aiName,
                message: `You have burned ${yesterdayCalories.calories} calories yesterday.`,
                time: formattedDate,
              },
            ]);
          } else {
            setApiResponse(`You have burned 0 calories yesterday.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },
              {
                speaker: defaultValues.aiName,
                message: `You have burned 0 calories yesterday.`,
                time: formattedDate,
              },
            ]);
          }
        });
      } else if (prompt.toLowerCase().includes('average')) {
        // Parse date range from user input
        const dateRegex =
          /average from ([a-zA-Z]+\s\d{1,2},\s\d{4}) to ([a-zA-Z]+\s\d{1,2},\s\d{4})/i;
        const match = prompt.match(dateRegex);
        if (match) {
          const startDate = new Date(match[1]);
          const endDate = new Date(match[2]);
          if (startDate && endDate) {
            calculateAverage(
              'Calories',
              'calories',
              startDate,
              endDate,
              average => {
                setApiResponse(
                  ` Your average calories burned from ${startDate.toDateString()} to ${endDate.toDateString()} was ${Math.round(
                    average,
                  )}.`,
                );
                setConversation([
                  ...conversation,
                  {
                    speaker: defaultValues.name,
                    message: prompt,
                    time: formattedDate,
                  },
                  {
                    speaker: defaultValues.aiName,
                    message: `Your average calories burned from ${startDate.toDateString()} to ${endDate.toDateString()} was ${Math.round(
                      average,
                    )}.`,
                    time: formattedDate,
                  },
                ]);
              },
            );
          } else {
            setApiResponse(
              'Sorry, I did not understand the date range. Please use the format "Month Day, Year".',
            );
            setIsLoading(false);
          }
        } else {
          setApiResponse('Sorry, I did not understand your question.');
          setIsLoading(false);
        }
      } else if (prompt.toLowerCase().includes('on')) {
        // Retrieve calories burned for a specific date
        const dateRegex =
          /on ([a-zA-Z]+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})?/i;
        const match = prompt.match(dateRegex);
        if (match) {
          const month = monthNames.indexOf(match[1].toLowerCase());
          const day = parseInt(match[2], 10);
          const year = match[3]
            ? parseInt(match[3], 10)
            : new Date().getFullYear();
          const selectedDate = new Date(year, month, day);
          retrieveData('Calories', calories => {
            const selectedDateCalories = calories.find(calorie =>
              isSameDay(new Date(calorie.date), selectedDate),
            );
            if (selectedDateCalories) {
              setApiResponse(
                `You have burned ${
                  selectedDateCalories.calories
                } calories on ${selectedDate.toDateString()}.`,
              );
              setConversation([
                ...conversation,
                {
                  speaker: defaultValues.name,
                  message: prompt,
                  time: formattedDate,
                },
                {
                  speaker: defaultValues.aiName,
                  message: `You have burned ${
                    selectedDateCalories.calories
                  } calories on ${selectedDate.toDateString()}.`,
                  time: formattedDate,
                },
              ]);
            } else {
              setApiResponse(
                `No calories data available for ${selectedDate.toDateString()}.`,
              );
              setConversation([
                ...conversation,
                {
                  speaker: defaultValues.name,
                  message: prompt,
                  time: formattedDate,
                },
                {
                  speaker: defaultValues.aiName,
                  message: `No calories data available for ${selectedDate.toDateString()}.`,
                  time: formattedDate,
                },
              ]);
            }
          });
        } else {
          setApiResponse('Sorry, I did not understand your question.');
          setIsLoading(false);
        }
      } else {
        setApiResponse('Sorry, I did not understand your question.');
        setIsLoading(false);
      }
      setIsLoading(false);
      setIsListening(false);
      setPrompt('');
      return;
    }
    /////

    try {
      const result = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0,
        max_tokens: 50,
      });
      const response = result.data.choices[0].text;
      setApiResponse(response);
      setConversation([
        ...conversation,
        {speaker: defaultValues.name, message: prompt, time: formattedDate},
        {speaker: defaultValues.aiName, message: response, time: formattedDate},
      ]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong. Please try again.');
      setIsLoading(false);
    }
    setPrompt('');
  };

  ////=========////=========////=========////=========////=========////=========////=========////=========////========= siri

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
  }, []);

  const onSpeechStart = () => {
    setPrompt('');

    setIsListening(true);
  };

  const onSpeechEnd = () => {
    // setIsListening(false);
    // handleSubmit();
  };

  const onSpeechError = error => {
    console.log('onSpeechError:', error);
  };

  const onSpeechResults = event => {
    setPrompt(event.value[0]);
  };

  const startListening = () => {
    Voice.start('en-US');
  };

  const stopListening = () => {
    Voice.stop();
    handleSubmit();
  };

  /////////=========////=========////=========////=========////=========////=========////=========////=========

  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
  }, [conversation]);

  console.log('conversation', conversation);

  return (
    // <View style={styles.container}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={deviceHeight + 55}>
      {/* add error state */}
      {toastConfig && (
        <Toast visible={true} {...toastConfig} onDismiss={hideToast} />
      )}

      <ScrollView
        keyboardDismissMode="interactive"
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

      {/* {isListening ? <DotLoader isLoading={isListening} /> : null} */}
      {/* <Button title="Get steps" onPress={handleSteps} />
      <Button title="create table" onPress={createTable} /> */}

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Button title="check" onPress={checkHKStatus} />
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="How many steps did I take today?"
            placeholderTextColor="#aaa"
            returnKeyType="done"
          />
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleSubmit}>
              {isLoading ? <DotLoader isLoading={isLoading} /> : <SendIcon />}
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 5, marginRight: 5}}
              // onPressIn={startListening}
              // onPressOut={stopListening}
              onPress={isListening ? stopListening : startListening}>
              {isListening ? (
                <DotLoader isLoading={isListening} />
              ) : (
                <MicrophoneIcon />
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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

export default ChatScreen;
