import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {startOfWeek, addDays} from 'date-fns';
import {Calendar, WeekCalendar, Agenda, DateData} from 'react-native-calendars';
import AppointmentForm from '../forms/AppointmentForm';
import styles from '../styles';

let Database = require('../database/Database.jsx');
let database = new Database('appointmentDatabase');

async function getAppointments() {
  return new Promise((resolve, reject) => {
    database.database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM appointment ORDER BY DATE DESC`,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const allAppointments = JSON.parse(results.rows.item(0));
            resolve(allAppointments);
          } else {
            resolve(null);
          }
        },
        error => {
          reject(error);
        },
      );
    });
  });
}
getAppointments()
  .then(results => console.log(results))
  .catch(err => console.log(err));

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const Schedule = ({navigation}) => {
  const [items, setItems] = useState({});
  let myItems = {
    '2023-07-30': [{name: 'item 1 - any js object', date: '2023-07-30'}],
    '2023-08-07': [{name: 'item 1 for day'}, {name: 'item 2 for day'}],
  };

  const loadItems = day => {
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
        if (!myItems[strTime]) {
          items[strTime] = [];
        } else {
          items[strTime] = myItems[strTime];
        }
      }
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
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
        <Text>{item.name}</Text>
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
