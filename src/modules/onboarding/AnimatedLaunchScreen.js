import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import LaunchScreenLogo from '../../assets/launch-screen-logo.svg';

import {useNavigation} from '@react-navigation/native';

const AnimatedLaunchScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const positionAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current; // Add this line
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(positionAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        // And this block
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.replace('MainApp'));
  }, [fadeAnim, positionAnim, scaleAnim, navigation]);

  return (
    <LinearGradient
      colors={['#125D56', '#107569']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <Animated.View
        style={{
          transform: [{translateY: positionAnim}, {scale: scaleAnim}], // Add scale to transform
          opacity: fadeAnim,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LaunchScreenLogo />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default AnimatedLaunchScreen;
