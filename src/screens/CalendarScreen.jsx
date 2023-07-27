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

function CalendarScreen() {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Calendar</Text>
      <Schedule />
      {/* <AppointmentForm /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default CalendarScreen;
