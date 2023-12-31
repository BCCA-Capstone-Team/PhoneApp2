import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View, TouchableOpacity, Animated} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import styles from '../styles';
import {useFocusEffect} from '@react-navigation/native';
import SpeechButton from '../components/SpeechButton';
import AnimatedView from '../components/AnimatedView';
import MinimalAnimatedView from '../components/MinimalAnimatedView';
let allMonths = {
    January: { value: 1 },
    February: { value: 2 },
    March: { value: 3 },
    April: { value: 4 },
    May: { value: 5 },
    June: { value: 6 },
    July: { value: 7 },
    August: { value: 8 },
    September: { value: 9 },
    October: { value: 10 },
    November: { value: 11 },
    December: { value: 12 },
};

let Database = require('../database/ProfileDatabase.jsx');
let database = new Database();


let voiceCommands = require('../commandSystem/voiceCommands.jsx');

let DatabaseOld = require('../database/CalendarDatabase.jsx');
let databaseOld = new DatabaseOld();

async function setupDateInterval() {
    setInterval(async () => {
        await databaseOld.onAppReady();
        await databaseOld.appTable.reload();
        let fullData = databaseOld.appTable.data;
        fullData.forEach(event => {
            let remindBefore = event[3][1]
            let remindDate = event[5][1]

            let testDate = new Date(remindDate)
            let testString = `${testDate.getMonth()}-${testDate.getDate()}-${testDate.getFullYear()} ${testDate.getHours()}:${testDate.getMinutes()}`

            let currentDate = new Date();
            let timeToAdd = remindBefore * 60 * 1000;
            let newDate = new Date(currentDate.getTime() + timeToAdd);
            let newString = `${newDate.getMonth()}-${newDate.getDate()}-${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`

            if (testString == newString) {
                Tts.speak(`You have a appointment in ${remindBefore} minutes`)
                Tts.speak(`Your appointment is for ${event[1][1]}`)
                Tts.speak(`Be sure to be there by ${event[5][1].slice(0, event[5][1].length - 8)}`)
            }
        });
    }, 55000);
}; setupDateInterval()

function HomeScreen({navigation, route}) {
  const [refreshKey, setRefreshKey] = useState(0);
  console.log('HomeScreen rendering');
  const {message} = route.params || '';
  //const [visible, setVisible] = useState(true);
  const [profileData, setProfileData] = useState(null);

  //---------- ANIMATION LOGIC -----------//

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Add a listener to the Animated value to track its changes
  //fadeAnim.addListener(value => {
  //  console.log('fadeAnim value:', value);
  //});

  // useEffect(() => {
  //   triggerRefresh;
  //   const fadeOut = Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 6000,
  //     useNativeDriver: true,
  //   });

  //   fadeOut.start();
  // }, [fadeAnim, message, refreshKey]);

  // const triggerRefresh = () => {
  //   setRefreshKey(prevKey => prevKey + 1);
  // };

  //---------------------------
  //Use useFocusEffect to run animation logic when screen gains focus
  // useFocusEffect(
  //   useCallback(() => {
  //     triggerRefresh();
  //     const fadeOutAnimation = () => {
  //       console.log(message);
  //       const fadeOut = Animated.timing(fadeAnim, {
  //         toValue: 0,
  //         duration: 6000,
  //         useNativeDriver: true,
  //       });

  //       fadeOut.start();
  //     };

  //     fadeOutAnimation(); // Trigger the animation logic
  //     return () => {
  //       // Cleanup logic if needed
  //     };
  //   }, [fadeAnim, message]),
  // );

  // const triggerRefresh = () => {
  //   setRefreshKey(prevKey => prevKey + 1);
  // };
  //------------------------
  // useEffect(() => {
  //   showAlertAndHide();
  // }, []);
  //--------------------------------------//

  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await database.getProfile();
      if (data.firstName != undefined) {
        setProfileData(data);
        console.log(data);
        await readInstructions(data.firstName);
      }
      
    };
    console.log('fetch profile triggered');

    // Check if there is updatedProfileData in the route params
    const updatedProfileData = route.params?.updatedProfileData;
    if (updatedProfileData) {
      // If there is updatedProfileData, set it as the new profileData
      setProfileData(updatedProfileData);
    } else {
      // If there is no updatedProfileData, fetch the profile data as usual
      fetchProfileData();
    };
    // await readInstructions(data.firstName);
  }, [route.params]);

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
      if (result === 'denied') {
        request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(newResult => {
          // Handle the permission result
        });
      };
    });

    check(PERMISSIONS.IOS.MICROPHONE).then(result => {
      if (result === 'denied') {
        request(PERMISSIONS.IOS.MICROPHONE).then(newResult => {
          // Handle the permission result
        });
      };
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
        handleButtonPress('Calendar');
        break;
      case 'reminders':
        handleButtonPress('Leaving Home Reminders');
        break;
      case 'profile':
        handleButtonPress('Profile');
        break;
      default:
        Tts.speak('Sorry, I did not understand.'); //message for unknown commands
        break;
    };
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
    };
  };

  const readInstructions = name => {
    Tts.speak(
      `Hello ${name}, press on the J button to state where you would like to go: Calendar, Profile, or Reminders.`,
    );
  };

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    };
    setIsListening(!isListening);
  };
  console.log(message);
  return (
    <View style={styles.homeContainer}>
      {/* <AnimatedView message={message} /> */}
      <Text style={styles.welcomeText}>
        Hello {profileData ? profileData.firstName : 'Loading...'}!
      </Text>
      {/* <AnimatedView message={message} /> */}

      <MinimalAnimatedView message={message} />

      {/* Calendar Button */}
      <View style={styles.childHomeContainer}>
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
      </View>
      {/* Speak Button */}
      <View style={styles.speechButtonContainer}>
        <SpeechButton isListening={isListening} onPress={toggleListening} />
      </View>
    </View>
  );
};

export default HomeScreen;
