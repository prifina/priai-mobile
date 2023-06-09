// const handleSteps = async () => {
//   setIsLoading(true);

//   try {
//     const permissions = {
//       permissions: {
//         read: [AppleHealthKit.Constants.Permissions.StepCount],
//       },
//     };

//     AppleHealthKit.initHealthKit(permissions, error => {
//       if (error) {
//         console.log('[ERROR] Cannot grant permissions!');
//       }

//       // past year
//       const options = {
//         startDate: new Date(2023, 0, 1).toISOString(),
//         endDate: new Date().toISOString(),
//       };

//       AppleHealthKit.getSamples(options, (err, results) => {
//         if (err) {
//           console.log('error getting steps:', err);
//           return;
//         }
//         console.log('results', results);

//         // average steps
//         const stepsPerDay = {};

//         results.forEach(entry => {
//           const date = new Date(entry.start).toDateString(); // convert start time to date string - ignore hours  minutes  seconds
//           stepsPerDay[date] = (stepsPerDay[date] || 0) + entry.quantity; // accumulate steps per day
//         });

//         for (const [date, steps] of Object.entries(stepsPerDay)) {
//           insertData('Steps', 'steps', date, steps);
//         }

//         setIsLoading(false);
//         setDataStatus(true);
//       });
//     });
//   } catch (e) {
//     console.log(e);
//     setApiResponse('Something went wrong.');
//     setError(e);
//     setIsLoading(false);
//     setDataStatus(false);

//     Alert.alert(
//       'Error',
//       `Failed to retrieve health data. Please try again. ${error}`,
//       [{text: 'OK', onPress: () => console.log('OK pressed')}],
//       {cancelable: false},
//     );
//   }
// };

// const handleCalories = async () => {
//   setIsLoading(true);

//   try {
//     const permissions = {
//       permissions: {
//         read: [AppleHealthKit.Constants.Permissions.ActiveEnergyBurned],
//       },
//     };

//     AppleHealthKit.initHealthKit(permissions, error => {
//       if (error) {
//         console.log('[ERROR] Cannot grant permissions!');
//       }

//       // past year
//       const options = {
//         startDate: new Date(2023, 0, 1).toISOString(),
//         endDate: new Date().toISOString(),
//       };

//       AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
//         if (err) {
//           console.log('error getting calories:', err);
//           return;
//         }
//         // console.log('results', results);

//         // Calculate total calories burned per day
//         const caloriesPerDay = {};

//         results.forEach(entry => {
//           const date = new Date(entry.start).toDateString();
//           caloriesPerDay[date] = (caloriesPerDay[date] || 0) + entry.quantity;
//         });

//         for (const [date, calories] of Object.entries(caloriesPerDay)) {
//           insertData('Calories', 'calories', date, calories);
//         }

//         setIsLoading(false);
//         setDataStatus(true);
//       });
//     });
//   } catch (e) {
//     console.log(e);
//     setApiResponse('Something went wrong.');
//     setError(e);
//     setIsLoading(false);
//     setDataStatus(false);

//     Alert.alert(
//       'Error',
//       `Failed to retrieve health data. Please try again. ${error}`,
//       [{text: 'OK', onPress: () => console.log('OK pressed')}],
//       {cancelable: false},
//     );
//   }
// };

// useEffect(() => {
// handleSteps();
// handleCalories();
// retrieveData('Calories', calories => {
//   const todaySteps = calories;
//   console.log('custom', todaySteps);
// });
// }, []);

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
  Animated,
} from 'react-native';

import {useHeaderHeight} from '@react-navigation/elements';

import {Configuration, OpenAIApi} from 'openai';

import AppleHealthKit from 'react-native-health';

import AppContext from '../hoc/AppContext';
import DotLoader from '../components/DotLoader';

import Voice from '@react-native-voice/voice';

import SendIcon from '../assets/send-icon.svg';
import MicrophoneIcon from '../assets/microphone.svg';
import ChatItem from './chat/ChatItem';
import Divider from '../components/Divider';

import SQLite from 'react-native-sqlite-storage';

import config from '../../../config';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

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

  console.log('db', db);

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

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
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
    const startDate = new Date(year, monthNames.indexOf(month), 1);
    const endDate = new Date(year, monthNames.indexOf(month) + 1, 0);
    return [startDate, endDate];
  };

  const handleSteps = async () => {
    setIsLoading(true);

    try {
      const permissions = {
        permissions: {
          read: [AppleHealthKit.Constants.Permissions.Steps],
        },
      };

      AppleHealthKit.initHealthKit(permissions, error => {
        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }

        // Get steps from the past year
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
          // Insert each step entry into the SQLite database
          results.forEach(entry => {
            insertSteps(entry.start, entry.quantity);
          });
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
                speaker: defaultValues.aiName,
                message: `You have taken ${todaySteps.steps} steps today.`,
              },
            ]);
          } else {
            setApiResponse(`You have taken 0 steps today.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.aiName,
                message: `You have taken 0 steps today.`,
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
                speaker: defaultValues.aiName,
                message: `You have taken ${lastSundaySteps.steps} steps last Sunday.`,
              },
            ]);
          } else {
            setApiResponse(`You have taken 0 steps last Sunday.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.aiName,
                message: `You have taken 0 steps last Sunday.`,
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
                speaker: defaultValues.aiName,
                message: `You have taken ${yesterdaySteps.steps} steps yesterday.`,
              },
            ]);
          } else {
            setApiResponse(`You have taken 0 steps yesterday.`);
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.aiName,
                message: `You have taken 0 steps yesterday.`,
              },
            ]);
          }
        });
      } else if (prompt.toLowerCase().includes('average')) {
        const match = prompt.match(/average in ([\w\s]+)$/);
        if (match) {
          const period = match[1];
          const [startDate, endDate] = parsePeriod(period);
          calculateAverageSteps(startDate, endDate, average => {
            setApiResponse(
              `Your average steps in ${period} was ${Math.round(average)}.`,
            );
            setConversation([
              ...conversation,
              {
                speaker: defaultValues.aiName,
                message: `Your average steps in ${period} was ${Math.round(
                  average,
                )}.`,
              },
            ]);
          });
        }
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

  // useEffect(() => {
  //   createDatabase();
  //   createTable();
  //   // optionally you can call handleSteps here to fetch steps on component mount
  //   // handleSteps();
  // }, []);

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

      <ScrollView style={styles.conversationContainer}>
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

      {isListening ? <Text>listening...</Text> : null}
      <Button title="Get steps" onPress={handleSteps} />
      <Button title="create table" onPress={createTable} />

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
            onPressIn={startListening}
            onPressOut={stopListening}>
            <MicrophoneIcon />
          </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
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
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
