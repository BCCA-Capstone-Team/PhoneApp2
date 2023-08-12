import React, {useEffect, useRef} from 'react';

import Tts from 'react-native-tts';

//navigation imports
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import AppointmentDetails from './src/screens/AppointmentDetails';
import AppointmentFormScreen from './src/screens/AppointmentFormScreen';
import TestScreen from './src/screens/TestScreen';

import ProfileDatabase from './src/database/ProfileDatabase';
//@ts-ignore
//import Radar from 'react-native-radar';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const navigationRef = useRef(null);

  useEffect(() => {
    Radar.initialize('prj_test_pk_2aa353aba74916c7f8c717e47c142613c66c6c31');

    Radar.getPermissionsStatus().then((status: any) => {
      // do something with status
      console.log(status);
    });

    Tts.getInitStatus()
      .then(() => {
        console.log('TTS INITIALIZED!');
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.0);
        Tts.addEventListener('tts-start', event => console.log('start', event));
        Tts.addEventListener('tts-finish', event =>
          console.log('finish', event),
        );
        Tts.addEventListener('tts-cancel', event =>
          console.log('cancel', event),
        );
      })
      .catch(error => {
        console.log('Failed to initialize TTS', error);
      });

    // Check for profile existence
    const checkForProfileAndNavigate = async () => {
      const profileDatabase = new ProfileDatabase();
      try {
        const profileExists = await profileDatabase.checkForProfile();
        if (!profileExists) {
          // Profile does not exist, navigate to the ProfileScreen
          (navigationRef.current as any)?.navigate('ProfileScreen', {
            profileData: null,
          });
        }
      } catch (error) {
        console.error('Error checking for profile:', error);
      }
    };
    checkForProfileAndNavigate();
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="RemindersScreen" component={RemindersScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen
          name="ProfileDetailScreen"
          component={ProfileDetailScreen}
        />
        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetails}
        />
        <Stack.Screen
          name="AppointmentFormScreen"
          component={AppointmentFormScreen}
        />
        <Stack.Screen name="TestScreen" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
