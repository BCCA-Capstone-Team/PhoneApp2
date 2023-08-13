/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo} from 'react';
import {Animated, Text} from 'react-native';

const AnimatedView = ({message}) => {
  const fadeAnim = useMemo(() => new Animated.Value(1), []);

  //   useEffect(() => {
  //     console.log('animation effect triggered: ', message);
  //     const fadeOut = Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 9000, // Fade out over 3 seconds
  //       useNativeDriver: true,
  //     });

  //     if (message !== '') {
  //       console.log(message, 'inside AnimatedView');
  //       fadeOut.start();
  //     }
  //   }, [fadeAnim, message]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        zIndex: 1,
      }}>
      {/* Render the 'Text' element with 'message' */}
      {message !== '' && <Text>{message}</Text>}
    </Animated.View>
  );
};

export default AnimatedView;
