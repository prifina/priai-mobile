import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentWrapper from '../../components/ContentWrapper';
import {Swipeable} from 'react-native-gesture-handler';

import ThreadItemIcon from '../../assets/thread-item-icon.svg';
import PencilLineIcon from '../../assets/pencil-line.svg';

import ClockRewindIcon from '../../assets/clock-rewind.svg';
import PriAIAvatar from '../../assets/pri-ai-avatar.svg';

const ThreadsScreen = ({navigation}) => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    getThreads();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getThreads);
    return unsubscribe;
  }, [navigation]);

  const getThreads = async () => {
    try {
      const value = await AsyncStorage.getItem('threads');
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          setThreads(parsedValue);
        } else {
          // Handle invalid data, show error message, etc.
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [swiping, setSwiping] = useState(false);

  const handleThreadSelect = thread => {
    navigation.navigate('Chat', {thread});
  };

  const handleThreadDelete = async id => {
    const newThreads = threads.filter(thread => thread.id !== id);
    await AsyncStorage.setItem('threads', JSON.stringify(newThreads));
    setThreads(newThreads);
  };

  const renderThread = ({item}) => {
    const formattedDate = formatDate(item.timeLastEdited);

    const renderRightActions = (progress, dragX) => {
      return (
        <TouchableOpacity
          style={styles.rightAction}
          onPress={() => handleThreadDelete(item.id)}>
          <Text style={styles.rightActionText}>Delete</Text>
        </TouchableOpacity>
      );
    };

    const renderLeftActions = (progress, dragX) => {
      return (
        <TouchableOpacity
          style={styles.leftAction}
          onPress={() => handleThreadRename(item)}>
          <Text style={styles.leftActionText}>Rename</Text>
        </TouchableOpacity>
      );
    };

    const handleThreadRename = item => {
      Alert.prompt('Rename Thread', 'Enter new thread name:', newName => {
        if (newName && newName.trim() !== '') {
          const newThreads = threads.map(thread => {
            if (thread.id === item.id) {
              return {...thread, name: newName};
            }
            return thread;
          });
          setThreads(newThreads);
          AsyncStorage.setItem('threads', JSON.stringify(newThreads));
        }
      });
    };

    const handleThreadPress = () => {
      if (!swiping) {
        handleThreadSelect(item);
      }
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableWillOpen={() => setSwiping(true)}
        onSwipeableWillClose={() => setSwiping(false)}>
        <TouchableOpacity onPress={handleThreadPress}>
          <View style={styles.threadItem}>
            <View
              style={{flexDirection: 'row', padding: 8, alignItems: 'center'}}>
              <ThreadItemIcon />
              <View style={{marginLeft: 12}}>
                <Text style={styles.threadName}>{item.name}</Text>
                <Text>{formattedDate}</Text>
              </View>
            </View>
            <View
              style={{
                paddingRight: 8,
                paddingVertical: 12,
              }}>
              <PriAIAvatar />
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const formatDate = timestamp => {
    if (timestamp && !isNaN(timestamp)) {
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return '';
  };

  const handleThreadCreate = () => {
    Alert.prompt('Thread Name', null, text => {
      if (text) {
        createThread(text);
      }
    });
  };

  const createThread = async threadName => {
    const timeStamp = Date.now();
    const newThread = {
      id: timeStamp,
      name: threadName,
      messages: [],
      timeLastEdited: timeStamp,
    };

    const existingThreads = await AsyncStorage.getItem('threads');
    let threads = [];
    if (existingThreads) threads = JSON.parse(existingThreads);
    threads.push(newThread);
    await AsyncStorage.setItem('threads', JSON.stringify(threads));

    // Update the state to include the new thread
    setThreads(threads);
  };

  return (
    // <ContentWrapper>
    <View style={styles.wrapper}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 13}}>
        <Text
          style={{
            marginRight: 6,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 20,
          }}>
          Recents
        </Text>
        <ClockRewindIcon />
      </View>
      <View style={styles.threadsContainer}>
        <FlatList
          data={threads}
          renderItem={renderThread}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleThreadCreate}>
        <PencilLineIcon />
        <Text style={styles.buttonText}>New Thread</Text>
      </TouchableOpacity>
    </View>
    // </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    marginBottom: 16,
    paddingBottom: 0,
  },
  threadsContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    justifyContent: 'space-between',
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderColor: '#EAECF0',
  },
  threadName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 18,
  },
  leftAction: {
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
    width: 80,
  },
  leftActionText: {
    color: '#FFFFFF',
  },
  rightAction: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    width: 80,
  },
  rightActionText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    backgroundColor: '#0E9384',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
    marginLeft: 10,
  },
});

export default ThreadsScreen;
