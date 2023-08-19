import {View, Text, TouchableOpacity, ScrollView, Platform, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import Tts from 'react-native-tts';
import SpeechButton from '../components/SpeechButton';
import AppointmentFormScreen from './AppointmentFormScreen';
import TrashButton from '../components/TrashButton';
import TtsButtonComponent from '../components/TtsButtonComponent';
//adding some styling too
import styles from '../styles.js';

let Database = require('../database/CalendarDatabase.jsx');
let database = new Database('appointmentDatabase');
//changed let data to const data for easier manipulation (JAQ) ALSO ADDED SOME TTS it should trigger automatically when called from the schedule.jsx file by voice in theory....
const AppointmentDetails = ({navigation, route}) => {
  const data = route.params;
  const [isListening, setIsListening] = useState(false);
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

  // Getting Directions Function

  const openMapWithAddress = (address, city, state, zipCode) => {
    let formattedAddress = `${address}, ${city}, ${state}, ${zipCode}`.replace(/ /g, "+");
    
    // For iOS - using Apple Maps
    if (Platform.OS === "ios") {
        Linking.openURL(`http://maps.apple.com/?address=${formattedAddress}`);
    } 
    // For Android - using Google Maps
    else {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`);
    }
};

// Listening Function

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };

  // Conversion of date and time for styling purposes:

  function formatDate(dateObj) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    const day = dateObj.getDate();
    let daySuffix = 'th';

    if (day % 10 === 1 && day !== 11) {
        daySuffix = 'st';
    } else if (day % 10 === 2 && day !== 12) {
        daySuffix = 'nd';
    } else if (day % 10 === 3 && day !== 13) {
        daySuffix = 'rd';
    }

    const monthName = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${monthName} ${day}${daySuffix}, ${year}`;
}

function formatTime(dateObj) {
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) {
      hours -= 12;
  } else if (hours === 0) {
      hours = 12; // for midnight
  }

  return `${hours}:${minutes} ${ampm}`;
}

  const dateTimeStr = data.time;

  const dateObj = new Date(dateTimeStr);

  const date = formatDate(dateObj); 
  const time = formatTime(dateObj); 

  console.log(date);  // Output: 8/19/2023
  console.log(time);  // Output: 12:30


  if (data.date || data.eventTitle) {
    // console.log(data.date);
    return (
      <View style={styles.homeContainer}>
        <View style={styles.trashButtonContainer}>
            <TrashButton onPress={handleDeleteItem} />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{data.eventTitle}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.appointmentText}>{date} at {time}</Text>
        </View>
        {data.location.address &&
        data.location.city &&
        data.location.state != null ? (
          <View>
            <Text style={styles.infoText}>Where:</Text>
            <Text style={styles.appointmentText}>
              {data.location.address} {data.location.city},{' '}
              {data.location.state}
            </Text>
          <TouchableOpacity 
            style={styles.appointmentButton} 
            onPress={() => openMapWithAddress(data.location.address, data.location.city, data.location.state, data.location.zipCode)}
        >
            <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
          </View>
          
        ) : (
          <Text style={styles.appointmentText}>No location info saved!</Text>
        )}
        {data.reminder[0] ? (
          <View style={styles.appointmentRemindersContainer}>
          <ScrollView style={{flex: 1}}>
            <Text style={styles.appointmentText}>Reminders:</Text>
            {/*/gonna try something new real quick feel free to move or delete if crash/*/}
            {data.reminder.map((reminder, index) => (
              <Text key={index} style={styles.appointmentText}>
                {reminder}
              </Text>
            ))}
          </ScrollView>
          </View>
        ) : (
          <Text style={styles.appointmentText} >No reminders to bring along!</Text>
        )}
        <View>
        <TouchableOpacity style={styles.appointmentButton}
            onPress={() => {
              //  console.log(data);
              handleAddItem();
            }}>
            <Text style={styles.buttonText}>Add Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appointmentButton}
            onPress={() => {
              handleEditItem();
            }}>
            <Text style={styles.buttonText}>Edit Appointment</Text>
          </TouchableOpacity>
        
        </View>
        {/* //added this button too// */}
        {/* <TtsButtonComponent onPress={readAppointments} /> */}
        <View style={styles.speechButtonContainer} >
          <SpeechButton isListening={isListening} onPress={toggleListening} />
        </View>
      
      </View>
    );
  } else {
    console.log('No stuffs.');
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.noAppointmentsText}>No appointments today!</Text>
        <View>
          <TouchableOpacity style={styles.button}
            onPress={() => {
              //  console.log(data);
              handleAddItem();
            }}>
            <Text style={styles.buttonText}>Add Appointment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.speechButtonContainer} >
          <SpeechButton isListening={isListening} onPress={toggleListening} />
        </View>
        
      </View>
    );
  }
};

export default AppointmentDetails;
