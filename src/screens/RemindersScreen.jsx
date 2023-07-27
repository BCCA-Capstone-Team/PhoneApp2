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
import RemindersForm from '../forms/RemindersForm';
import styles from '../styles'

function RemindersScreen() {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Reminders</Text>
      <RemindersForm />
    </View>
  );
}


export default RemindersScreen;
