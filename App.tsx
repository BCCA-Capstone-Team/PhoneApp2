import React, {useEffect, useRef} from 'react';

// import Tts from 'react-native-tts';   this doesn't appear to be being used at the moment

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

import ProfileDatabase from './src/database/ProfileDatabase';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const navigationRef = useRef(null);

  useEffect(() => {
    // Check for profile existence
    const checkForProfileAndNavigate = async () => {
      const profileDatabase = new ProfileDatabase();
      try {
        const profileExists = await profileDatabase.checkForProfile();
        if (!profileExists) {
          // Profile does not exist, navigate to the ProfileScreen
          (navigationRef.current as any)?.navigate('Create/Edit Profile', {
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Reminders" component={RemindersScreen} />
        <Stack.Screen name="Create/Edit Profile" component={ProfileScreen} />
        <Stack.Screen name="Profile Details" component={ProfileDetailScreen} />
        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetails}
        />
        <Stack.Screen
          name="AppointmentFormScreen"
          component={AppointmentFormScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
