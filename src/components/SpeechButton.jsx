import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styles from '../styles';

export default function SpeechButton({ isListening, onPress }) {
  return (
    <TouchableOpacity style={styles.speakButton} onPress={onPress}>
        {isListening ? <Image source={(require('../assets/animatedLogo.gif'))} style={styles.listenButtonImage}/> : <Image source={(require('../assets/staticLogo.png'))} style={styles.listenButtonImage}/>}
    </TouchableOpacity>
  );
}
