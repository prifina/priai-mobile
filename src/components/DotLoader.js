import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const DotLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: '#107569',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DotLoader;
