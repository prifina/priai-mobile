import React, {useState} from 'react';
import {View, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewThread = ({navigation}) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    const timeStamp = Date.now();
    const newThread = {
      id: timeStamp,
      name,
      messages: [],
      timeLastEdited: timeStamp,
    };
    const existingThreads = await AsyncStorage.getItem('threads');
    let threads = [];
    if (existingThreads) threads = JSON.parse(existingThreads);
    threads.push(newThread);
    await AsyncStorage.setItem('threads', JSON.stringify(threads));
    navigation.goBack(() => {
      // Callback function to trigger getThreads after navigating back
      navigation.navigate('Threads');
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Thread Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Create" onPress={handleSubmit} />
    </View>
  );
};

export default NewThread;
