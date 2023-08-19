import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {Text, View, TouchableOpacity, Animated} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import styles from '../styles';
import TtsButtonComponent from '../components/TtsButtonComponent';
import {useFocusEffect} from '@react-navigation/native';
import SpeechButton from '../components/SpeechButton';
import Radar from 'react-native-radar';
import AnimatedView from '../components/AnimatedView';

let Database = require('../database/ProfileDatabase.jsx');
let database = new Database();

let voiceCommands = require('../commandSystem/voiceCommands.jsx');

// let dialogClass = require('../commandSystem/dialogCommands.jsx');
// let dialogSystem = new dialogClass();
// dialogSystem.readPromptText('Would you like to edit, add, read, or delete');
// dialogSystem.registerCommand(
//   'edit',
//   'Let me know what you would like to edit',
//   ['title', 'value'],
//   returnValues => {
//     console.log('Return values');
//     console.log(returnValues.title);
//   },
// );

function HomeScreen({navigation, route}) {
  const {message} = route.params || '';
  const [visible, setVisible] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Use useFocusEffect to run animation logic when screen gains focus
  useFocusEffect(
    useCallback(() => {
      const fadeOutAnimation = () => {
        console.log(message);
        const fadeOut = Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        });

        console.log(message, 'inside HomeScreen');
        console.log('Before animation start');
        fadeOut.start();
        console.log('Animation completed');
      };

      fadeOutAnimation(); // Trigger the animation logic
      // return () => {
      //   // Cleanup logic if needed
      // };
    }, [fadeAnim, message]),
  );

  // useEffect(() => {
  //   showAlertAndHide();
  // }, []);

  useEffect(() => {
    // Fetch profile data asynchronously and update state
    const fetchProfileData = async () => {
      const data = await database.getProfile();
      setProfileData(data);
    };
    console.log('fetch profile triggered');
    fetchProfileData();
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const readInstructions = () => {
    Tts.speak(
      'Hello user, press on the listen button to state where you would like to go: Calendar, Profile, or Reminders.',
    );
  };

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };
  console.log(message);
  return (
    <View style={styles.homeContainer}>
      <AnimatedView message={message} />
      {/* Calendar Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Calendar')}>
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>
      {/* Reminders Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Leaving Home Reminders')}>
        <Text style={styles.buttonText}>Reminders</Text>
      </TouchableOpacity>
      {/* Profile Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      {/* Test Button
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('TestScreen')}>
        <Text style={styles.buttonText}>Test</Text>
      </TouchableOpacity> */}
      {/* Speak Button */}
      <SpeechButton isListening={isListening} onPress={toggleListening} />
      {/*TTS Button */}
      <TtsButtonComponent text="Read Instructions" onPress={readInstructions} />

      {/* <MicrophoneComponent /> */}
    </View>
  );
}

export default HomeScreen;
