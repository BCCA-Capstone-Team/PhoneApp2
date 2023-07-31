/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';

// import Tts from 'react-native-tts';   this doesn't appear to be being used at the moment

//navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
<<<<<<< Updated upstream
=======
  const [profileExists, setProfileExists] = useState<boolean>(false);

  useEffect(() => {
    //checking if profile exists
    const checkProfileExists = async () => {
      const profileDB = new ProfileDatabase();
      const exists = await profileDB.checkForProfile();
      setProfileExists(exists);
    };

    checkProfileExists();
  }, []);

  const handleProfileSubmit = async (data: {
    firstName: any;
    lastName: any;
    street: any;
    city: any;
    state: any;
    zipCode: string;
  }) => {
    const profileDB = new ProfileDatabase();
    await profileDB.addProfile(
      data.firstName,
      data.lastName,
      data.street,
      data.city,
      data.state,
      parseInt(data.zipCode, 10),
    );
    setProfileExists(true);
  };
>>>>>>> Stashed changes

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {profileExists ? (
          <Stack.Screen name="Home Screen" component={HomeScreen} />
        ) : (
          <Stack.Screen
            name="ProfileScreen"
            options={{title: 'Create Profile'}}
            component={(
              props: React.JSX.IntrinsicAttributes & {
                navigation: any;
                route: any;
              },
            ) => <ProfileScreen {...props} onSubmit={handleProfileSubmit} />}
          />
        )}
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="RemindersScreen" component={RemindersScreen} />

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
