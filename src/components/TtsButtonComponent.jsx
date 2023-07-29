import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Tts from 'react-native-tts';
import styles from '../styles';

const TtsButtonComponent = ({text}) => {
  const handleSpeakButtonPress = () => {
    Tts.speak(text);
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
