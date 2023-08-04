import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppointmentFormScreen from './AppointmentFormScreen';

let Database = require('../database/CalendarDatabase.jsx');
let database = new Database('appointmentDatabase');

const AppointmentDetails = ({navigation, route}) => {
  let data = route.params;
  // console.log(data);
  let editing;
  let listOfData = [data, editing];

  // Add Appointment
  const handleAddItem = () => {
    listOfData[1] = false;
    // console.log('hello');
    // if (dayData.date) {
    //   navigation.navigate('AppointmentFormScreen', dayData);
    // } else {
    //   navigation.navigate('AppointmentFormScreen', dayData);
    // }
    navigation.navigate('AppointmentFormScreen', listOfData);
  };

  // Edit Appointment
  const handleEditItem = dayData => {
    listOfData[1] = true;
    navigation.navigate('AppointmentFormScreen', listOfData);
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
        <Text>Event: {data.eventTitle}</Text>
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
            {data.reminder.map(reminder => (
              <Text>Bring: {reminder}</Text>
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
      </View>
    );
  } else {
    console.log('No stuffs.');
    return (
      <View>
        <Text>No appointments today!</Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              //   console.log(data);
              handleAddItem();
            }}>
            <Text>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Delete Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default AppointmentDetails;
