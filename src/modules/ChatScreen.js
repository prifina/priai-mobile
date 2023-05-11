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

import AppleHealthKit from 'react-native-health';
import ContentWrapper from '../components/ContentWrapper';

import AppContext from '../hoc/AppContext';
import DotLoader from '../components/DotLoader';

import Voice from '@react-native-voice/voice';
import ListeningAnimation from '../components/ListeningAnimation';

import SendIcon from '../assets/send-icon.svg';
import MicrophoneIcon from '../assets/microphone.svg';
import ChatItem from './chat/ChatItem';
import Divider from '../components/Divider';

import SQLite from 'react-native-sqlite-storage';

import useDatabaseHooks from '../utils/useDatabaseHooks';

import config from '../../config';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

// console.log('env', config.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const ChatScreen = ({navigation}) => {
  const {defaultValues} = useContext(AppContext);

  const {createTable, insertSteps, retrieveSteps, calculateAverageSteps} =
    useDatabaseHooks();

  const [isLoading, setIsLoading] = useState(false);

  const deviceHeight = useHeaderHeight();

  const handleClearChat = () => {
    setConversation([]);
    setIsLoading(false);

    setIsListening(false);
  };

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

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const timeStamp = Date.now();

  const formatDateToHoursAndMinutes = timestamp => {
    const date = new Date(timestamp);

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayIndex = date.getDay();
    const day = dayNames[dayIndex];

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return `${day} ${timeString}`;
  };

  const formattedDate = formatDateToHoursAndMinutes(timeStamp);

  const [stepCount, setStepCount] = useState([]);

  //////////=========////=========////=========////=========////=========////=========////=========////=========APPLE HEALTHKIT STEPS AND SQL
  // const db = SQLite.openDatabase({
  //   name: 'database.db',
  //   createFromLocation: 1,
  //   location: 'default',
  // });

  // console.log('db', db);

  // const createTable = () => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'CREATE TABLE IF NOT EXISTS Steps (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, steps INTEGER);',
  //     );
  //   });
  // };

  // const insertSteps = (date, steps) => {
  //   db.transaction(tx => {
  //     tx.executeSql('INSERT INTO Steps (date, steps) VALUES (?,?)', [
  //       date,
  //       steps,
  //     ]);
  //   });
  // };

  // const retrieveSteps = callback => {
  //   db.transaction(tx => {
  //     tx.executeSql('SELECT * FROM Steps', [], (tx, results) => {
  //       let steps = [];
  //       for (let i = 0; i < results.rows.length; i++) {
  //         steps.push(results.rows.item(i));
  //       }
  //       callback(steps);
  //     });
  //   });
  // };

  // const calculateAverageSteps = (startDate, endDate, callback) => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT AVG(steps) as average FROM Steps WHERE date BETWEEN ? AND ?',
  //       [startDate.getTime(), endDate.getTime()],
  //       (tx, results) => {
  //         callback(results.rows.item(0).average);
  //       },
  //     );
  //   });
  // };

  const isSameDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const parsePeriod = period => {
    const [month, year] = period.split(' ');
    const startDate = new Date(year, parseInt(month) - 1, 1);
    const endDate = new Date(year, parseInt(month), 0);
    return [startDate, endDate];
  };

  const monthNames = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const lastDayOfWeek = day => {
    const today = new Date();
    const lastDay = new Date(
      today.setDate(
        today.getDate() - ((7 + today.getDay() - daysOfWeek.indexOf(day)) % 7),
      ),
    );
    return lastDay;
  };

  const [dataStatus, setDataStatus] = useState(false);

  const handleSteps = async () => {
    setIsLoading(true);

    try {
      const permissions = {
        permissions: {
          read: [AppleHealthKit.Constants.Permissions.StepCount],
        },
      };

      AppleHealthKit.initHealthKit(permissions, error => {
        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }

        // past year
        const options = {
          startDate: new Date(2023, 0, 1).toISOString(),
          endDate: new Date().toISOString(),
        };

        AppleHealthKit.getSamples(options, (err, results) => {
          if (err) {
            console.log('error getting steps:', err);
            return;
          }
          console.log('results', results);

          // average steps
          const stepsPerDay = {};

          results.forEach(entry => {
            const date = new Date(entry.start).toDateString(); // convert start time to date string - ignore hours  minutes  seconds
            stepsPerDay[date] = (stepsPerDay[date] || 0) + entry.quantity; // accumulate steps per day
          });

          for (const [date, steps] of Object.entries(stepsPerDay)) {
            insertSteps(date, steps);
          }

          setIsLoading(false);
          setDataStatus(true);
        });
      });
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong.');
      setError(e);
      setIsLoading(false);
      setDataStatus(false);

      Alert.alert(
        'Error',
        `Failed to retrieve health data. Please try again. ${error}`,
        [{text: 'OK', onPress: () => console.log('OK pressed')}],
        {cancelable: false},
      );
    }
  };

  useEffect(() => {
    handleSteps();
    createTable();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (prompt.toLowerCase().includes('steps')) {
      if (prompt.toLowerCase().includes('today')) {
        retrieveSteps(steps => {
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
            retrieveSteps(steps => {
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
        retrieveSteps(steps => {
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
            calculateAverageSteps(startDate, endDate, average => {
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

          retrieveSteps(steps => {
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

  // const [isListening, setIsListening] = useState(false);
  // const [speechError, setSpeechError] = useState('');

  // useEffect(() => {
  //   Voice.onSpeechStart = onSpeechStart;
  //   Voice.onSpeechEnd = onSpeechEnd;
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, [prompt]);

  // const onSpeechStart = () => {
  //   setIsListening(true);
  //   setPrompt('');
  // };

  // const onSpeechEnd = () => {
  //   setIsListening(false);

  //   // End the animation

  //   // Submit the prompt after a short delay
  //   setTimeout(() => {
  //     handleSubmit();
  //   }, 500);
  // };
  // const onSpeechError = error => {
  //   console.log('onSpeechError:', error);
  //   setSpeechError(error.error.message);

  //   setIsListening(false);

  //   setConversation([
  //     ...conversation,
  //     // {
  //     //   speaker: defaultValues.name,
  //     //   message: prompt,
  //     //   time: formattedDate,
  //     // },
  //     {
  //       speaker: defaultValues.aiName,
  //       message: `I'm sorry I didn't understand. Please try again!`,
  //       time: formattedDate,
  //     },
  //   ]);
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
      {/* {error !== '' && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{error}</Text>
        </View>
      )} */}

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
