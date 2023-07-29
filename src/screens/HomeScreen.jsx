import React, {useEffect} from 'react';
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
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Clean up voice recognition events when the component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceResults = (e) => {
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

  const onSpeechRecognized = (e) => {
    // Handle recognized speech event
    console.log('Speech recognized:', e);
  };

  const onSpeechResults = (e) => {
    // Handle speech results event
    handleVoiceResults(e); // Call the existing voice results handler
  };

  const onSpeechError = (e) => {
    // Handle speech error event
    console.error('Speech recognition error:', e);
  };

  // event handler for buttonss
  const handleButtonPress = (screenName, data) => {
    navigation.navigate(screenName, {profileData: data});

  };

  const handleSpeakButtonPress = () => {
    Tts.speak("You can say 'Calendar', 'Reminders', or 'Profile'.");
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>We are on the Home Page</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('CalendarScreen', 'Calendar')}>
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('RemindersScreen', 'Reminders')}>
        <Text style={styles.buttonText}>Reminders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('ProfileScreen', 'Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Speak Button */}
      <TouchableOpacity
        style={styles.speakButton}
        onPress={handleSpeakButtonPress}>
        <Text style={styles.speakButtonText}>Speak</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
