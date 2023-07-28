import React, {useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Tts from 'react-native-tts';
import styles from '../styles';

function HomeScreen({navigation}) {
  // event handler for buttons
  // const handleButtonPress = (screenName, buttonText) => {
  const handleButtonPress = (screenName, data) => {
    // navigation.navigate(screenName);
    navigation.navigate(screenName, {profileData: data});
    // handleTouchableOpacityPress(screenName, buttonText); //fixed a typo here
    handleTouchableOpacityPress(screenName, data);
  };

  useEffect(() => {
    Tts.speak('We are on the Home Page');

    return () => {
      Tts.stop();
    };
  }, []);

  const handleTouchableOpacityPress = (screenName, buttonText) => {
    Tts.speak(screenName + ', ' + buttonText);
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
    </View>
  );
}

export default HomeScreen;
