import React, {useEffect, useMemo} from 'react';
import {Animated, Text} from 'react-native';

const fadeAnim = new Animated.Value(1);

const AnimatedView = ({message}) => {
  console.log('AnimatedView component rendering');
  const fadeAnim = useMemo(() => {
    console.log('Creating new Animated.Value');
    return new Animated.Value(1);
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    // zIndex: 1,
  };

  return (
    <Animated.View style={animatedStyle}>
      {/* Render the 'Text' element with 'message' */}
      {message !== '' && <Text>{message}</Text>}
    </Animated.View>
  );
};

export default AnimatedView;
