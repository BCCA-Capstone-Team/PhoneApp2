/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {startOfWeek, addDays} from 'date-fns';
import {Calendar, WeekCalendar, Agenda, DateData} from 'react-native-calendars';
import AppointmentForm from '../forms/AppointmentForm';
import styles from '../styles';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import SpeechButton from '../components/SpeechButton';

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
  return combinedDateString;
}

async function getAppointments() {
  let Database = require('../database/CalendarDatabase.jsx');
  let database = new Database();
  await database.onAppReady();

  let allData = await database.getAll();
  // console.log(allData);
  // console.log(allData['2023-6-29']);
  let test = database.checkForAppointment(2);
  test.then(resp => console.log(resp));
  return allData;
}
// getAppointments();

const timeToString = time => {
  const date = new Date(time);
  date.setHours(date.getHours() - 5);
  return date.toISOString().split('T')[0];
};

const Schedule = ({navigation}) => {
  const [items, setItems] = useState({});
  // const [allAppointmentData, setAllAppointmentData] = useState({});

  const [isListening, setIsListening] = useState(false);
  const voiceInputRef = useRef('');

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.onSpeechEnd = undefined;
      Voice.onSpeechResults = undefined;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // let allAppointmentData = {
  //   '2023-07-30': [{name: 'item 1 - any js object', date: '2023-07-30'}],
  //   '2023-08-07': [{name: 'item 1 for day'}, {name: 'item 2 for day'}],
  // };

  // Load appointments from database.
  async function loadAllAppointmentData() {
    let data = await getAppointments();
    let fixedDate = '';
    Object.keys(data).forEach(key => {
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
    });

    return data;
  }

  const loadItems = async day => {
    let allAppointmentData = await loadAllAppointmentData();
    // console.log(allAppointmentData);
    setTimeout(() => {
      const newItems = {};
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (i == 0) {
          console.log(strTime);
        }

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
    console.log(item);
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
  //voice commands and TTS//
  const onSpeechError = e => {};

  const onSpeechEnd = e => {
    // console.log('onSpeechEnd:', e);
    // console.log('Final voice input:', voiceInputRef.current);
    let a = 'a'; // Did this for testing.
    // const spokenWords = voiceInputRef.current.split(' ');
    // // console.log(`spokenWords ${spokenWords}`);
    // const command = spokenWords[0].toLowerCase();

    // if (command === 'add') {
    //   const date = extractDate(spokenWords);
    //   const otherInfo = extractOtherInfo(spokenWords);

    //   navigation.navigate('AppointmentFormScreen', {
    //     date: date,
    //     location: location,
    //     time: time,
    //   });
    // } else if (command === 'delete') {
    //   deleteAppointmentByVoice(spokenWords);
    // } else if (command === 'edit') {
    //   editAppointmentByVoice(spokenWords);
    // } else if (command === 'read') {
    //   navigation.navigate('AppointmentDetails', {readAppointments: true});
    // } else if (command === 'today') {
    //   // Logan, 'today' if statement is currently for testing
    //   // while I'm learning to take more than single word input.
    //   readTodaysAppointments;
    // } else if (
    //   command != 'delete' ||
    //   command != 'edit' ||
    //   command != 'read' ||
    //   command != 'today' ||
    //   command != 'add'
    // ) {
    //   Tts.speak('Sorry I did not understand.');
    // }
  };

  // Is now accepting speech results. Armando and I need to speak on the phone
  // in the morning to discuss how we want to do this. If we want to handle all
  // of the speech logic in schedule we will need to figure out how to have more
  // than one flow of Voice commands.

  const onSpeechResults = e => {
    // console.log(e.value[0]);
    const spokenWords = e.value[0].split(' ');
    console.log(spokenWords);
    const command = spokenWords.join(' ');
    console.log(command);
    if (command === 'add') {
      const date = extractDate(spokenWords);
      const otherInfo = extractOtherInfo(spokenWords);

      navigation.navigate('AppointmentFormScreen', {
        date: date,
        location: location,
        time: time,
      });
    } else if (command === 'delete') {
      deleteAppointmentByVoice(spokenWords);
    } else if (command === 'edit') {
      editAppointmentByVoice(spokenWords);
    } else if (command === 'read') {
      navigation.navigate('AppointmentDetails', {readAppointments: true});
    } else if (command == 'today') {
      // Logan, 'today' if statement is currently for testing
      // while I'm learning to take more than single word input.
      readDaysAppointments();
    } else {
      let b = 'b';
      // Tts.speak('Sorry I did not understand.');
      // Logan, I did this so I wouldn't have to keep hearing it during testing.
    }
  };

  // Logan, Testing some stuff to try to figure out tts and speech.
  // Altered this function to potentially take in a date
  // To make it applicable to today or a given day.
  const readDaysAppointments = async potentiallyADate => {
    const dateToBeRead = potentiallyADate
      ? potentiallyADate
      : timeToString(new Date());
    const appointments = await loadAllAppointmentData();
    if (appointments[dateToBeRead]) {
      appointments[dateToBeRead].forEach(each => {
        Tts.speak(each.eventTitle);
      });
    } else {
      Tts.speak('You have no appointments for today!');
    }
    // offerFullAppointmentInfo(appointments[dateToBeRead]);
  };
  // readDaysAppointments(new Date());  // Both of these examples work.
  // readDaysAppointments('2023-08-14');// Just need to crack implementation.

  // const offerFullAppointmentInfo = appointmentsForDate => {
  //   appointmentsForDate.forEach(each => {});
  // };

  const extractDate = spokenWords => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dateKeywords = ['on', 'to', 'for', 'at'];
    const dateKeywordIndex = spokenWords.findIndex(word =>
      dateKeywords.includes(word.toLowerCase()),
    );

    if (dateKeywordIndex != -1) {
      const dateParts = spokenWords.slice(dateKeywordIndex + 1);
      const dateStr = dateParts.join(' ');

      const matchingMonth = months.find(month =>
        dateStr.toLowerCase().includes(month.toLowerCase()),
      );
      const matchingDay = dateParts.find(part => !isNaN(part));

      if (matchingMonth && matchingDay) {
        const monthIndex = months.indexOf(matchingMonth);
        const day = parseInt(matchingDay, 10);
        if (monthIndex !== -1 && day >= 1 && day <= 31) {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const extractedDate = new Date(year, monthIndex, day);
          return extractedDate;
        }
      }
    }

    return null; //only null if failed
  };
  const extractOtherInfo = spokenWords => {
    const otherInfoKeywords = ['with', 'by', 'meeting', 'appointment', 'event'];
    const otherInfoKeywordIndex = spokenWords.findIndex(word =>
      otherInfoKeywords.includes(word.toLowerCase()),
    );

    if (otherInfoKeywordIndex !== -1) {
      const otherInfoParts = spokenWords.slice(otherInfoKeywordIndex + 1);
      const otherInfo = otherInfoParts.join(' ');
      return otherInfo;
    }

    return null; // only null if failed
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
        selected={new Date().toString()}
      />

      <View style={styles.speechButtonContainer}>
        <SpeechButton isListening={isListening} onPress={toggleListening} />
      </View>
    </View>
  );
};

export default Schedule;
