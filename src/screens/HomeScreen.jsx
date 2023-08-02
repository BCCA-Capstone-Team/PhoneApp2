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
import MicrophoneComponent from '../components/MicrophoneComponent';
import TtsButtonComponent from '../components/TtsButtonComponent';
import { useFocusEffect } from '@react-navigation/native';


async function testDatabase() {
  let Database = require('../database/CalendarDatabase.jsx');
  let database = new Database();
  await database.onAppReady();

  // database.appReminderTable.show();

  //ADD NEW
  // var addDt = new Date();
  // addDt.setDate(addDt.getDate() + 1);
  // let giveDate = new Date(addDt)
  // let givenDate = `${giveDate.getFullYear()}-${giveDate.getMonth()}-${giveDate.getDate()}`
  //database.appTable.add('New Event', JSON.stringify({ address: "60", city: "Grenada", state: "MS", zipCode: "38901" }), 15, givenDate, giveDate.getTime())

  //SELECT ALL
  let allData = await database.getAll();
  for (const property in allData) {
    console.log(`${property}: ${JSON.stringify(allData[property])}`);
  }

  //SELECT SOLO
  // var soloDt = new Date();
  // soloDt.setDate(soloDt.getDate() + 1);

  // let soloData = await database.selectSingle(soloDt)

  //UPDATE

  // await database.edit('2023-7-4', 'eventTitle', 'Single Date update')

  // let allData2 = await database.getAll()
  // for (const property in allData2) {
  //   console.log(`${property}: ${JSON.stringify(allData2[property])}`);
  // }

  //DELETION

  // var dt = new Date();
  // dt.setDate(dt.getDate() - 1);
  // await database.remove(dt)

  //let allData3 = await database.getAll()
  //for (const property in allData3) {
  //    console.log(`${property}: ${JSON.stringify(allData3[property])}`);
  //}
}
testDatabase();

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
    }, [])
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

  // event handler for buttonss
  const handleButtonPress = (screenName, data) => {
    navigation.navigate(screenName, {profileData: data});
  };

  const handleSpeakButtonPress = () => {
    if (isListening) {
      setIsListening(false);
      stopListening();
    } else {
      setIsListening(true);
      startListening();
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop('en-US');
      setIsListening(false);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
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
        onPress={() => handleButtonPress('ProfileScreen')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Speak Button */}
      <TouchableOpacity
        style={styles.speakButton}
        onPress={isListening ? stopListening : startListening}>
        <Text style={styles.speakButtonText}>
          {isListening ? 'Stop Listening' : 'Listen'}
        </Text>
      </TouchableOpacity>

      {/*TTS Button */}
      <TtsButtonComponent text="Welcome to the home screen.  Here you can decide where to go such as: Calendar, Reminders, and Profile.  If you need to go by voice please click on the red button and say the name of the page you wish to go." />

      {/* <MicrophoneComponent /> */}
    </View>
  );
}

export default HomeScreen;
