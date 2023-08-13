import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Tts from 'react-native-tts';
import styles from '../styles';

const TtsButtonComponent = ({text, onPress}) => {
  const handleSpeakButtonPress = () => {
    if (typeof onPress === 'function') {
      onPress();
    } else {
      console.warn('onPress prop of TtsButtonComponent should be a function');
    }
  };

  return (
    <TouchableOpacity
      style={styles.voiceButton}
      onPress={handleSpeakButtonPress}>
      <Text style={styles.voiceButtonText}>Speak</Text>
    </TouchableOpacity>
  );
};

export default TtsButtonComponent;
