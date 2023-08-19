import React, {useEffect, useRef} from 'react';
import {Animated, Text} from 'react-native';

const MinimalAnimatedView = ({message}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  //
  useEffect(() => {
    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 6000,
      useNativeDriver: true,
    });

    fadeOut.start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{opacity: fadeAnim}}>
      {message !== '' && <Text>{message}</Text>}
    </Animated.View>
  );
};

export default MinimalAnimatedView;
