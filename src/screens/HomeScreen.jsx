import React, {useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Tts from 'react-native-tts';
import styles from '../styles'


function HomeScreen({navigation}) {
  // event handler for buttons
  const handleButtonPress = (screenName, buttonText) => {
    navigation.navigate(screenName);
    handTouchableOpacityPress(screenName, buttonText);
  };

  useEffect(() => {
    Tts.speak("We are on the Home Page");

    return () => {
        Tts.stop();
  };
}, []);

  const handTouchableOpacityPress = (screenName, buttonText) =>{
    Tts.speak(screenName + ", " + buttonText);
    };

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
    </View>
  );
}



export default HomeScreen;