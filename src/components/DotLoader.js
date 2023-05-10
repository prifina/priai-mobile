import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const DotLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" />
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
});

export default DotLoader;
