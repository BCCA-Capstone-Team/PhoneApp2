import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Voice from '@react-native-voice/voice';

const MicrophoneComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const onSpeechError = (e) => {
    console.error('Error during speech recognition:', e);
};

useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
        Voice.onSpeechStart = undefined;
        Voice.onSpeechEnd = undefined;
        Voice.onSpeechResults = undefined;
        Voice.onSpeechError = undefined;
        Voice.destroy().then(Voice.removeAllListeners);
    };
}, []);

  const onSpeechStart = (e) => {
    setIsListening(true);
  };

  const onSpeechEnd = (e) => {
    setIsListening(false);
  };

  const onSpeechResults = (e) => {
    setRecognizedText(e.value[0]);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  return (
    <View>
      <Button
        title={isListening ? 'Listening...' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
        disabled={isListening}
      />
      <Text>Recognized Text: {recognizedText}</Text>
    </View>
  );
};

export default MicrophoneComponent;