import React, {useEffect} from 'react';
import {Animated, Text, View, StyleSheet} from 'react-native';

const Toast = ({visible, message, type, onDismiss}) => {
  const fadeAnim = new Animated.Value(0);
  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (visible) {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            onDismiss && onDismiss();
          });
        }, 1000);
      }
    });
  }, [visible]);
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#2CD5A0';
      case 'error':
        return '#FD3412';
      case 'warning':
        return '#E0C342';
      default:
        return '#2CD5A0';
    }
  };

  return (
    visible && (
      <Animated.View
        style={[
          styles.toast,
          {
            opacity: fadeAnim,
            transform: [{translateY: translateY}],
            backgroundColor: getBackgroundColor(),
          },
        ]}>
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  toast: {
    zIndex: 1,
    position: 'absolute',
    top: 38,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default Toast;
