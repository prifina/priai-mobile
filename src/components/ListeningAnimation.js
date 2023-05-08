import React from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';

const ListeningAnimation = ({isListening}) => {
  const animValue = new Animated.Value(0);

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ).start();
    } else {
      animValue.setValue(0);
    }
  }, [isListening]);

  const circleScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          transform: [{scale: circleScale}],
          opacity: animValue,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListeningAnimation;
