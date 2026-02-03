/**
 * Splash Screen Component
 * Displays CMT logo/text with letter-by-letter loading animation
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 3000,
}) => {
  const letters = ['C', 'M', 'T'];
  const letterAnims = letters.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    // Animate each letter appearing one by one
    const animations = letterAnims.map((anim, index) => {
      return Animated.sequence([
        Animated.delay(index * 200), // Delay each letter by 200ms
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [letterAnims, duration, onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {letters.map((letter, index) => {
            const opacity = letterAnims[index];
            const scale = letterAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            });

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.logoText,
                  {
                    opacity,
                    transform: [{ scale }],
                  },
                ]}
              >
                {letter}
              </Animated.Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'normal',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
});

export default SplashScreen;

