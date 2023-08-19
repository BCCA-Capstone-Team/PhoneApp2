import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles';

export default function SpeechButton({ isListening, onPress }) {
  return (
    <TouchableOpacity style={styles.speakButton} onPress={onPress}>
      <Text style={styles.speakButtonText}>
        {isListening ? 'Stop Listening' : 'Listen'}
      </Text>
    </TouchableOpacity>
  );
}
