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

import config from '../../config';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

// console.log('env', config.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const ChatScreen = ({navigation}) => {
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

  const deviceHeight = useHeaderHeight();

  const handleClearChat = () => {
    setConversation([]);
    setIsLoading(false);
  };

  //////////=========////=========////=========////=========////=========////=========////=========////=========APPLE HEALTHKIT STEPS AND SQL
  const db = SQLite.openDatabase({
    name: 'database.db',
    createFromLocation: 1,
    location: 'default',
  });

  // console.log('db', db);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Steps (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, steps INTEGER);',
      );
    });
  };

  const insertSteps = (date, steps) => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO Steps (date, steps) VALUES (?,?)', [
        date,
        steps,
      ]);
    });
  };

  const retrieveSteps = callback => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Steps', [], (tx, results) => {
        let steps = [];
        for (let i = 0; i < results.rows.length; i++) {
          steps.push(results.rows.item(i));
        }
        callback(steps);
      });
    });
  };

  const calculateAverageSteps = (startDate, endDate, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT AVG(steps) as average FROM Steps WHERE date BETWEEN ? AND ?',
        [startDate, endDate],
        (tx, results) => {
          callback(results.rows.item(0).average);
        },
      );
    });
  };

  // const isSameDay = (d1, d2) => {
  //   return (
  //     d1.getFullYear() === d2.getFullYear() &&
  //     d1.getMonth() === d2.getMonth() &&
  //     d1.getDate() === d2.getDate()
  //   );
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

  const lastSunday = () => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - today.getDay()));
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
        });
      });
    } catch (e) {
      console.log(e);
      setApiResponse('Something went wrong.');
      setError(e);
      setIsLoading(false);
    }
  };

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
      } else if (prompt.toLowerCase().includes('last sunday')) {
        retrieveSteps(steps => {
          const lastSundaySteps = steps.find(step =>
            isSameDay(new Date(step.date), lastSunday()),
          );
          if (lastSundaySteps) {
            setApiResponse(
              `You have taken ${lastSundaySteps.steps} steps last Sunday.`,
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
                message: `You have taken ${lastSundaySteps.steps} steps last Sunday.`,
                time: formattedDate,
              },
            ]);
          } else {
            setApiResponse(`You have taken 0 steps last Sunday.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },

              {
                speaker: defaultValues.aiName,
                message: `You have taken 0 steps last Sunday.`,
                time: formattedDate,
              },
            ]);
          }
        });
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
        const match = prompt.match(/average in ([\w\s]+)$/);
        if (match) {
          const period = match[1];
          const [startDate, endDate] = parsePeriod(period);

          console.log('parse period', period, startDate, endDate);
          calculateAverageSteps(startDate, endDate, average => {
            setApiResponse(
              `Your average steps in ${period} was ${Math.round(average)}.`,
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
                message: `Your average steps in ${period} was ${Math.round(
                  average,
                )}.`,
                time: formattedDate,
              },
            ]);
          });
        }
      } else if (prompt.toLowerCase().includes('on')) {
        // Retrieve step count for a specific date

        const dateRegex =
          /on ([a-zA-Z]+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})?/i;
        const match = prompt.match(dateRegex);
        if (match) {
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

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const fadeAnim = useState(new Animated.Value(0))[0];

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
    setPrompt(''); // Clear the prompt

    // Start the animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const onSpeechEnd = () => {
    setIsListening(false);

    // End the animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Submit the prompt after a short delay
    setTimeout(() => {
      handleSubmit();
    }, 500);
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
      {error !== '' && (
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
      <Button title="Get steps" onPress={handleSteps} />
      <Button title="create table" onPress={createTable} />

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
