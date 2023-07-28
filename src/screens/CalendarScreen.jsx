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
import {Agenda} from 'react-native-calendars';

function CalendarScreen() {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Calendar</Text>
      <Schedule />
      {/* <AppointmentForm /> */}
    </View>
  );
}

export default CalendarScreen;
