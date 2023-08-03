import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {startOfWeek, addDays} from 'date-fns';
import {Calendar, WeekCalendar, Agenda, DateData} from 'react-native-calendars';
import AppointmentForm from '../forms/AppointmentForm';
import styles from '../styles';

// Checks to see if the month and day of the date strings are 2 digits
// If they aren't then it adds a zero to the one missing it.
function monthAndDayFormatter(dateString) {
  let splitDateString = dateString.split('-');
  let combinedDateString = null;
  let neededFixing = false;
  if (splitDateString[1].length === 1) {
    splitDateString[1] = '' + '0' + splitDateString[1];
    neededFixing = true;
  }
  if (splitDateString[2].length === 1) {
    splitDateString[2] = '' + '0' + splitDateString[2];
    neededFixing = true;
  }
  if (neededFixing) {
    combinedDateString =
      '' +
      splitDateString[0] +
      '-' +
      splitDateString[1] +
      '-' +
      splitDateString[2];
  }

  // console.log(combinedDateString);
  return combinedDateString;
}
monthAndDayFormatter('2023-08-07');

async function getAppointments() {
  let Database = require('../database/CalendarDatabase.jsx');
  let database = new Database();
  await database.onAppReady();

  let allData = await database.getAll();
  // console.log(allData['2023-6-29']);
  return allData;
}
// getAppointments();

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const Schedule = ({navigation}) => {
  const [items, setItems] = useState({});

  // let allAppointmentData = {
  //   '2023-07-30': [{name: 'item 1 - any js object', date: '2023-07-30'}],
  //   '2023-08-07': [{name: 'item 1 for day'}, {name: 'item 2 for day'}],
  // };

  // Load appointments from database.
  async function loadAllAppointmentData() {
    let data = await getAppointments();
    let fixedDate = '';
    Object.keys(data).forEach(key => {
      // console.log(key);
      fixedDate = monthAndDayFormatter(key);
      let datesValue = data[key];
      if (fixedDate != null) {
        Object.defineProperty(
          data,
          fixedDate,
          Object.getOwnPropertyDescriptor(data, key),
        );
        delete data[key];
      }
      // console.log(data);
    });
    // console.log(data);
    return data;
  }

  // Split all keys at their '-' and make sure that the month and day is 2 digits.
  // If it isn't, make it.
  const loadItems = async day => {
    let allAppointmentData = await loadAllAppointmentData();
    // console.log(allAppointmentData);
    setTimeout(() => {
      const newItems = {};
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        // Create events for different dates and add them to myItems array
        // Example:
        // myItems.push({ name: 'Event 1', height: 50 });
        // myItems.push({ name: 'Event 2', height: 80 });
        // ...
        if (!allAppointmentData[strTime]) {
          items[strTime] = [];
        } else {
          items[strTime] = allAppointmentData[strTime];
        }
        // console.log(allAppointmentData);
        // if (i == 3) {
        //   console.log(items[strTime]);
        //   // console.log(strTime);
        // }
      }
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
        // console.log(key, '===', newItems[key]);
      });
      setItems(newItems);
    }, 1000);
  };

  // ============== Handle renderItem and it's onPress ============== //

  const handleItemPress = item => {
    // console.log(item);
    navigation.navigate('AppointmentDetails', item);
  };

  const renderItem = item => {
    // console.log('yo');
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderStyle: 'solid',
          borderBlockColor: 'red',
          marginBottom: 5,
          marginTop: 5,
        }}
        onPress={() => {
          handleItemPress(item);
        }}>
        <Text>{item.eventTitle}</Text>
      </TouchableOpacity>
    );
  };

  // ============== Handle renderItem and it's onPress ============== //

  // ============== Handle renderEmptyDay and it's onPress ============== //

  const handleEmptyDayPress = day => {
    navigation.navigate('AppointmentDetails', day);
  };

  const renderEmptyDay = day => {
    return (
      <TouchableOpacity
        style={{margin: 5}}
        onPress={() => {
          // console.log(timeToString(day));
          handleEmptyDayPress(timeToString(day));
        }}>
        <Text>Empty Day</Text>
      </TouchableOpacity>
    );
  };

  // ============== Handle renderEmptyDay and it's onPress ============== //

  // ============== DATABASE STUFF ============== //

  // ============== DATABASE STUFF ============== //

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDay}
      />
    </View>
  );
};

export default Schedule;
