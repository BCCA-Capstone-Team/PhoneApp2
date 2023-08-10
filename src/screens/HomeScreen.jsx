import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import styles from '../styles';
import TtsButtonComponent from '../components/TtsButtonComponent';
import {useFocusEffect} from '@react-navigation/native';
import SpeechButton from '../components/SpeechButton';
import Radar from 'react-native-radar';

let Database = require('../database/ProfileDatabase.jsx');
let database = new Database();

function HomeScreen({navigation}) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
      if (result === 'denied') {
        request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(newResult => {
          // Handle the permission result
        });
      }
    });

    check(PERMISSIONS.IOS.MICROPHONE).then(result => {
      if (result === 'denied') {
        request(PERMISSIONS.IOS.MICROPHONE).then(newResult => {
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
      stopListening();
      Voice.onSpeechStart = undefined;
      Voice.onSpeechEnd = undefined;
      Voice.onSpeechResults = undefined;
      Voice.onSpeechError = undefined;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Alyx trying some thing
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = () => {
        stopListening();
        Voice.destroy().then(Voice.removeAllListeners);
      };

      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;

      return () => unsubscribe();
    }, []),
  );

  const handleVoiceResults = e => {
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
        handleButtonPress('ProfileDetailScreen');
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

  const onSpeechRecognized = e => {
    // Handle recognized speech event
    console.log('Speech recognized:', e);
  };

  const onSpeechResults = e => {
    // Handle speech results event
    handleVoiceResults(e); // Call the existing voice results handler
    console.log(e.value[0]);
  };

  const onSpeechError = e => {
    // Handle speech error event
    console.error('Speech recognition error:', e);
  };

  const onSpeechEnd = e => {
    setIsListening(false);
  };

    // event handler for buttons
    const handleButtonPress = async screenName => {
        await database.onProfileReady();
        await database.table.reload();
        let newProfileData = await database.getProfile();
        navigation.navigate(screenName, {profileData: newProfileData});
    };

  const stopListening = async () => {
    try {
      await Voice.stop('en-US');
      setIsListening(false);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };

  return (
    <View style={styles.homeContainer}>
      {/* Calendar Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('CalendarScreen')}>
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>

      {/* Reminders Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('RemindersScreen')}>
        <Text style={styles.buttonText}>Reminders</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('ProfileDetailScreen')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Test Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('TestScreen')}>
        <Text style={styles.buttonText}>Test</Text>
      </TouchableOpacity>

      {/* Speak Button */}

      <SpeechButton isListening={isListening} onPress={toggleListening} />

      {/*TTS Button */}
      <TtsButtonComponent text="Hello user, press on the listen button to state where you would like to go: Calendar, Profile, or Reminders." />

      {/* <MicrophoneComponent /> */}
    </View>
  );
}

export default HomeScreen;
