
import React from 'react';

import Tts from 'react-native-tts';

//navigation imports
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="RemindersScreen" component={RemindersScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
