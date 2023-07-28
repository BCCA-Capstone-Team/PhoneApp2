import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AppointmentForm from '../forms/AppointmentForm';
import Schedule from '../components/Schedule';
import styles from '../styles';
// yo
function CalendarScreen() {
  return (
    <View style={{height: 600}}>
      <Schedule />
      {/* <AppointmentForm /> */}
    </View>
  );
}

export default CalendarScreen;
