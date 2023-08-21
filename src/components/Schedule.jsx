import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {startOfWeek, addDays} from 'date-fns';
import {Calendar, WeekCalendar, Agenda, DateData} from 'react-native-calendars';
import AppointmentForm from '../forms/AppointmentForm';
import styles from '../styles';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import SpeechButton from '../components/SpeechButton';

let voiceCommands = require('../commandSystem/voiceCommands.jsx');
let Database = require('../database/CalendarDatabase.jsx');
let database = new Database('appointmentDatabase');
let allMonths = {
  January: {value: 1},
  February: {value: 2},
  March: {value: 3},
  April: {value: 4},
  May: {value: 5},
  June: {value: 6},
  July: {value: 7},
  August: {value: 8},
  September: {value: 9},
  October: {value: 10},
  November: {value: 11},
  December: {value: 12},
};

// Checks to see if the month and day of the date strings are 2 digits
// If they aren't then it adds a zero to the one missing it.
function monthAndDayFormatter(dateString) {
  let splitDateString = dateString.split('-');
  let combinedDateString = null;
  let neededFixing = false;
  if (splitDateString[1].length === 1) {
    splitDateString[1] = '' + '0' + splitDateString[1];
    neededFixing = true;
  };
  if (splitDateString[2].length === 1) {
    splitDateString[2] = '' + '0' + splitDateString[2];
    neededFixing = true;
  };
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
};
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
  const [doneListening, setDoneListening] = useState(true);
  const voiceInputRef = useRef('');

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
      // setDoneListening(true);
    } else {
      Voice.start('en-US');
      // setDoneListening(false);
    };
    setIsListening(!isListening);
  };
  ///armando added the command to be able to stop listening via voice special command is 'finish'
  const handleVoiceResults = e => {
    const recognizedText = e.value[0].toLowerCase();

    if (recognizedText.includes('finish')) {
      toggleListening(); // Stop listening when 'finish' is recognized
    };;
  };

  useEffect(() => {
    // Voice.onSpeechStart = e => {
    //   // setDoneListening(false);
    //   // console.log(e);
    // };
    Voice.onSpeechEnd = onSpeechEnd;
    // Voice.onSpeechRecognized = onSpeechRecognized;
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
      };
    });

    return data;
  };

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
        };

        // Create events for different dates and add them to myItems array
        // Example:
        // myItems.push({ name: 'Event 1', height: 50 });
        // myItems.push({ name: 'Event 2', height: 80 });
        // ...
        if (!allAppointmentData[strTime]) {
          items[strTime] = [];
        } else {
          items[strTime] = allAppointmentData[strTime];
        };;
      };;
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
    navigation.navigate('Appointment', item);
  };

  // ============= Format Time for Styling Purposes ================= //

  function formatTime(dateObj) {
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12; // for midnight
    };;

    return `${hours}:${minutes} ${ampm}`;
  };;

  const renderItem = item => {
    const dateTimeStr = item.time;

    const dateObj = new Date(dateTimeStr);
    const time = formatTime(dateObj);
    return (
      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={styles.eventButton}
        onPress={() => {
          handleItemPress(item);
        }}>
        <Text style={styles.appointmentDayText}>{item.eventTitle}</Text>
        <Text style={styles.appointmentDayText}>at {time}</Text>
      </TouchableOpacity>
    );
  };

  // ============== Handle renderItem and it's onPress ============== //

  // ============== Handle renderEmptyDay and it's onPress ============== //

  const handleEmptyDayPress = day => {
    navigation.navigate('Appointment', day);
  };

  const renderEmptyDay = day => {
    return (
      <TouchableOpacity
        style={styles.emptyDayButton}
        onPress={() => {
          // console.log(timeToString(day));
          handleEmptyDayPress(timeToString(day));
        }}>
        <Text style={styles.appointmentText}>No appointments</Text>
        <Text style={styles.emptyDayText}>Add appointment</Text>
      </TouchableOpacity>
    );
  };
  //voice commands and TTS//
  const onSpeechError = e => {};

  const onSpeechEnd = async e => {
    let VoiceCommands = new voiceCommands();
    VoiceCommands.commandKeys = [
      'address',
      'city',
      'state',
      'title',
      'tidal',
      'date',
      'zip',
    ];
    VoiceCommands.parseString = result;
    await VoiceCommands.breakDown();
    let fullResult = VoiceCommands.returnResults();

      if (fullResult.add) {
          addVoiceOption(fullResult);
      } else if (fullResult.edit) {
          editVoiceOptions(fullResult);
      } else if (fullResult.remove) {
          removeVoiceOption(fullResult);
      };

    
    

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
  // let result;
  // const [result, setResult] = useState('');
  const onSpeechResults = e => {
    // setResult('');
    let appointmentData = {};
    const spokenWords = e.value[0].split(' ');
    const command = spokenWords.join(' ').toLowerCase();
    // setResult(e.value[0]);
    result = e.value[0];
    handleVoiceResults(e); /////should trigger the added function to make the button stop listening..armando
  };

  // ORIGINAL ONSPEECHRESULTS //

  // Is now accepting speech results. Armando and I need to speak on the phone
  // in the morning to discuss how we want to do this. If we want to handle all
  // of the speech logic in schedule we will need to figure out how to have more
  // than one flow of Voice commands.

  const onSpeechRecognized = e => {
    console.log(e.isFinal);
    // Object.keys(e).forEach(each => console.log(each));
    let a = 'a';
  };

  // // Logan, Testing some stuff to try to figure out tts and speech.
  // // Altered this function to potentially take in a date
  // // To make it applicable to today or a given day.
  // const readDaysAppointments = async potentiallyADate => {
  //   console.log('here');
  //   const dateToBeRead = potentiallyADate
  //     ? potentiallyADate
  //     : timeToString(new Date());
  //   const appointments = await loadAllAppointmentData();
  //   if (appointments[dateToBeRead]) {
  //     appointments[dateToBeRead].forEach(each => {
  //       Tts.speak(each.eventTitle);
  //     });
  //   } else {
  //     Tts.speak('You have no appointments for today!');
  //   }
  //   // offerFullAppointmentInfo(appointments[dateToBeRead]);
  // };

  // ORIGINAL ONSPEECHRESULTS //

  // const editAppointmentByVoice = async () => {
  //   Tts.speak('Please say the title of the appointment you want to edit.');

  //   // Listener starts for the appointment title to edit
  //   Voice.onSpeechResults = async e => {
  //     const lastResult = e.value[e.value.length - 1];
  //     const appointmentTitle = lastResult.trim();

  //     // Fetch appointment data and find the correct title
  //     const appointments = await loadAllAppointmentData();
  //     const appointmentDate = timeToString(new Date());

  //     if (appointments[appointmentDate]) {
  //       const appointmentToEdit = appointments[appointmentDate].find(
  //         appointment =>
  //           appointment.eventTitle.toLowerCase() ===
  //           appointmentTitle.toLowerCase(),
  //       );
  //       if (appointmentToEdit) {
  //         // Stops listening for title
  //         Voice.onSpeechResults = undefined;

  //         Tts.speak('Please state the changes you want to make.');

  //         // Listener starts for the changes to be made
  //         Voice.onSpeechResults = async e => {
  //           const changes = e.value.join(' ');

  //           // Process and apply the changes here
  //           const remindersPattern = /reminders:\s*(.*)/i;
  //           const timePattern = /time:\s*(.*)/i;

  //           const remindersMatch = changes.match(remindersPattern);
  //           const timeMatch = changes.match(timePattern);

  //           if (remindersMatch) {
  //             const newReminders = remindersMatch[1];
  //             // Handle new reminders update here
  //           }

  //           if (timeMatch) {
  //             const newTime = timeMatch[1];
  //             // Handle new time update here
  //           }

  //           // End the voice interaction
  //           Voice.onSpeechResults = undefined;
  //           Tts.speak('Appointment updated successfully.');
  //         };
  //       } else {
  //         // No appointment found with the given title
  //         Tts.speak('No appointment found with the provided title.');
  //       }
  //     }
  //   };
  // };

  //HAS NOT BEEN TESTED YET
  const deleteAppointmentByVoice = async spokenWords => {
    const date = extractDate(spokenWords);
    const otherInfo = extractOtherInfo(spokenWords);

    if (date) {
      try {
        const success = await deleteAppointment(date, otherInfo);

        if (success) {
          Tts.speak('Appointment deleted successfully.');
        } else {
          Tts.speak('Appointment deletion failed.');
        };
      } catch (error) {
        console.error('Error deleting appointment:', error);
        Tts.speak('Sorry, an error occurred while deleting the appointment.');
      };
    } else {
      Tts.speak("Sorry, I couldn't understand the date for deletion.");
    };
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
    //added days of the week to help logic flow smoother...maybe
    const daysOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    const dateKeywords = ['on', 'to', 'for', 'at'];
    const dateKeywordIndex = spokenWords.findIndex(word =>
      dateKeywords.includes(word.toLowerCase()),
    );

    if (dateKeywordIndex !== -1) {
      const dateParts = spokenWords.slice(dateKeywordIndex + 1);
      const dateStr = dateParts.join(' ');

      const matchingMonth = months.find(month =>
        dateStr.toLowerCase().includes(month.toLowerCase()),
      );
      const matchingDay = dateParts.find(part => !isNaN(part));
      const matchingDayOfWeek = daysOfWeek.find(day =>
        dateStr.toLowerCase().includes(day.toLowerCase()),
      );

      if (matchingMonth && (matchingDay || matchingDayOfWeek)) {
        const monthIndex = months.indexOf(matchingMonth);
        const day = parseInt(matchingDay, 10);
        if (monthIndex !== -1 && day >= 1 && day <= 31) {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const extractedDate = new Date(year, monthIndex, day);
          return extractedDate;
        };;
      };;
    };;

    return null; //only null if failed
  };
  const extractOtherInfo = spokenWords => {
    const otherInfoKeywords = ['with', 'by', 'meeting', 'appointment', 'event'];
    const otherInfoKeywordIndex = spokenWords.findIndex(word =>
      otherInfoKeywords.includes(word.toLowerCase())
    );

    if (otherInfoKeywordIndex !== -1) {
      const otherInfoParts = spokenWords.slice(otherInfoKeywordIndex + 1);
      const otherInfo = otherInfoParts.join(' ');
      return otherInfo;
    };

    return null; // only null if failed
  };

  // ============== Handle renderEmptyDay and it's onPress ============== //

  // ============== DATABASE STUFF ============== //

  // ============== DATABASE STUFF ============== //

  return (
    <View style={{flex: 1}}>
      <Agenda
        theme={{ 
          dotColor: '#0C2340',
          todayDotColor: '#0C2340',
          selectedDotColor: '#0C2340',
          selectedDayBackgroundColor: '#F26522',
          todayTextColor: '#0C2340',
          dayTextColor: '#0C2340',
          textSectionTitleColor: '#0C2340',
          agendaDayTextColor: '#0C2340',
          agendaKnobColor: '#0C2340',
          agendaTodayColor: '#F26522',
          agendaDayNumColor: '#0C2340'
        }}
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


// //==========| ADD NEW APPT |==========\\
// async function addVoiceOption(fullResult) {
//     let fullTitle = '';
//     if (fullResult.title[0]) {
//       fullTitle = fullResult.title[0];
//     } else if (fullResult.tidal[0]) {
//         fullTitle = fullResult.tidal[0];
//     };

//     if (
//       fullTitle != '' &&
//       fullResult.address[0] &&
//       fullResult.city[0] &&
//       fullResult.state[0] &&
//       fullResult.date[0] &&
//       fullResult.zip[0]
//     ) {
//         let currentDate = fullResult.date[0];
//         let dateTable = currentDate.split(' ');
//         for (let i = 0; i < dateTable.length; i++) {
//             dateTable[i] = dateTable[i].replaceAll(',', '');
//         };
//         let newDate = new Date(
//             dateTable[2],
//             allMonths[dateTable[0]].value - 1,
//             dateTable[1],
//         );
//       let currentDate = fullResult.date[0];
//       let dateTable = currentDate.split(' ');
//       for (let i = 0; i < dateTable.length; i++) {
//         dateTable[i] = dateTable[i].replaceAll(',', '');
//       };
//       let newDate = new Date(
//         dateTable[2],
//         allMonths[dateTable[0]].value - 1,
//         dateTable[1],
//       );

//       await database.appTable.add(
//         fullTitle,
//         JSON.stringify({
//           address: fullResult.address[0],
//           city: fullResult.city[0],
//           state: fullResult.state[0],
//           zipCode: fullResult.zip[0],
//         }),
//         JSON.stringify([]),
//         newDate.toString(),
//         newDate.toString(),
//       );
//       console.log('Created Event');
//     } else {
//         console.error('Missing Data to add event');
//         console.error(VoiceCommands.parseString);
//         console.error(`Title: ${fullTitle}`);
//         console.error(`Address: ${fullResult.address[0]}`);
//         console.error(`City: ${fullResult.city[0]}`);
//         console.error(`State: ${fullResult.state[0]}`);
//         console.error(`Date: ${fullResult.date[0]}`);
//         console.error(`Zip: ${fullResult.zip[0]}`);
//     };
// };


//   //==========| EDIT APPT |==========\\
//   async function editVoiceOptions(fullResult) {
//     if (fullResult.title[0] && fullResult.date[0]) {
//       console.log('Edit Stuff');
//       await database.reload();
//       let allData = database.data;
//     } else {
//       console.error('Missing Data to add event');
//       console.error(VoiceCommands.parseString);
//       console.error(`Title: ${fullResult.title[0]}`);
//       console.error(`Date: ${fullResult.date[0]}`);
//     };
//   };
//   //==========| REMOVE APPT |==========\\
//   async function removeVoiceOption(fullResult) {
//     if (fullResult.title[0] && fullResult.date[0]) {
//       console.log('Edit Stuff');
//       await database.reload();
//       let allData = database.data;
//     } else {
//         console.error('Missing Data to add event');
//         console.error(VoiceCommands.parseString);
//         console.error(`Title: ${fullResult.title[0]}`);
//         console.error(`Date: ${fullResult.date[0]}`);
//     }
// }