import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import Tts from 'react-native-tts';
import SpeechButton from '../components/SpeechButton';
import AppointmentFormScreen from './AppointmentFormScreen';
import TtsButtonComponent from '../components/TtsButtonComponent';
//adding some styling too
import styles from '../styles.js';

let Database = require('../database/CalendarDatabase.jsx');
let database = new Database('appointmentDatabase');
//changed let data to const data for easier manipulation (JAQ) ALSO ADDED SOME TTS it should trigger automatically when called from the schedule.jsx file by voice in theory....
const AppointmentDetails = ({navigation, route}) => {
  const data = route.params;
  console.log(data);

  useEffect(() => {
    if (route.params.readAppointments) {
      readAppointments();
    }
  }, [route.params.readAppointments]);
  //this is automated tts...should be at least
  const readAppointments = () => {
    // Start with an introduction
    Tts.speak('Here are your appointment details:');

    // Read event title
    Tts.speak(`Event title: ${data.eventTitle}`);

    // Read location details
    if (
      data.location &&
      data.location.address &&
      data.location.city &&
      data.location.state
    ) {
      Tts.speak(
        `Location: ${data.location.address}, ${data.location.city}, ${data.location.state}`,
      );
    } else {
      Tts.speak('No location info saved.');
    }

    // Read reminders
    if (data.reminder && data.reminder.length > 0) {
      Tts.speak('Reminders:');
      data.reminder.forEach(reminder => {
        Tts.speak(`Bring: ${reminder}`);
      });
    } else {
      Tts.speak('No reminders to bring along.');
    }
  };
  // console.log(data);
  let editing;
  let listOfData = [data, editing];

  // Add Appointment
  const handleAddItem = () => {
    listOfData[1] = false;
    navigation.navigate('Appointment Creation', listOfData);
  };

  // Edit Appointment
  const handleEditItem = dayData => {
    listOfData[1] = true;
    navigation.navigate('Appointment Creation', listOfData);
  };

  // Delete Appointment
  const handleDeleteItem = () => {
    database.appTable.removeIndex(listOfData[0].id);
    let allReminders = listOfData[0].detailReminder;
    for (let i = 0; i < allReminders.length; i++) {
      database.appReminderTable.removeIndex(allReminders[i].id);
    }
  };

  if (data.date || data.eventTitle) {
    // console.log(data.date);
    return (
      <View>
        <Text style={styles.eventTitle}>Event: {data.eventTitle}</Text>
        {data.location.address &&
        data.location.city &&
        data.location.state != null ? (
          <Text>
            Location: {data.location.address} {data.location.city},{' '}
            {data.location.state}
          </Text>
        ) : (
          <Text>No location info saved!</Text>
        )}
        {data.reminder[0] ? (
          <View>
            {/*/gonna try something new real quick feel free to move or delete if crash/*/}
            {data.reminder.map((reminder, index) => (
              <Text key={index} style={styles.reminderText}>
                Bring: {reminder}
              </Text>
            ))}
          </View>
        ) : (
          <Text>No reminders to bring along!</Text>
        )}
        <View>
          <TouchableOpacity
            style={{marginBottom: 10}}
            onPress={() => {
              handleAddItem();
            }}>
            <Text>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleEditItem();
            }}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteItem}>
            <Text>Delete Item</Text>
          </TouchableOpacity>
        </View>
        {/* //added this button too// */}
        <TtsButtonComponent onPress={readAppointments} />
      </View>
    );
  } else {
    console.log('No stuffs.');
    return (
      <View>
        <Text style={styles.noAppointmentsText}>No appointments today!</Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              //  console.log(data);
              handleAddItem();
            }}>
            <Text style={styles.addText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.deleteText}>Delete Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default AppointmentDetails;
