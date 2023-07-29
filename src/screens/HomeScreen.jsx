import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import Tts from 'react-native-tts';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import styles from '../styles';

function HomeScreen({navigation}) {
    const[isListening, setIsListening] = useState(false);


  useEffect(() => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
      if (result === 'denied') {
        request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(newResult => {
          // Handle the permission result
        });
      }
    });

    // Request permissions and initialize voice recognition
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Clean up voice recognition events when the component unmounts
      Voice.onSpeechStart = undefined;
      Voice.onSpeechEnd = undefined;
      Voice.onSpeechResults = undefined;
      Voice.onSpeechError = undefined;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceResults = (e: SpeechResultsEvent) => {
    // Handle voice results
    const spokenWords = e.value;
    const command = spokenWords[0].toLowerCase();
    switch (command) {
      case 'calendar':
        handleButtonPress('CalendarScreen');
        break;
      case 'reminders':
        handleButtonPress('RemindersScreen');
        break;
      case 'profile':
        handleButtonPress('ProfileScreen');
        break;
      default:
        Tts.speak('Sorry, I did not understand.'); //message for unknown commands
        break;
    }
  };

  // Event handlers for voice recognition
  const onSpeechStart = e => {
    // Handle speech start event
    console.log('Speech started');
  };


  const onSpeechResults = (e: SpeechResultsEvent) => {
    // Handle speech results event
    handleVoiceResults(e); // Call the existing voice results handler
    console.log(e.value[0]);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    // Handle speech error event
    console.error('Speech recognition error:', e);
  };

  const onSpeechEnd = (e) => {
    setIsListening(false);
  }

  // event handler for buttonss
  const handleButtonPress = screenName => {
    navigation.navigate(screenName);
  };

  const handleSpeakButtonPress = () => {
    if(isListening){
        setIsListening(false);
        stopListening();
    } else{
        setIsListening(true);
        startListening();
        Tts.speak("You can say 'Calendar', 'Reminders', or 'Profile'.");
    }
  };

  const startListening = async () => {
    try{
        await Voice.start('en-US');
        setIsListening(true);

    }catch(error){
    console.error('Error starting voice recognition:', error);
    }
  }


   const stopListening = async () => {
      try{
          await Voice.stop('en-US');
          setIsListening(false);

      }catch(error){
      console.error('Error starting voice recognition:', error);
      }
    }

  return (
    <View style={styles.homeContainer}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>We are on the Home Page</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('CalendarScreen')}>
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('RemindersScreen')}>
        <Text style={styles.buttonText}>Reminders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('ProfileScreen')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Speak Button */}
      <TouchableOpacity
        style={styles.speakButton}
        onPress={isListening ? stopListening : startListening }
      >
        <Text style={styles.speakButtonText}>
          {isListening ? 'Stop Listening' : 'Speak'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
