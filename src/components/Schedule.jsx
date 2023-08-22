import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
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

// == Loads appointments from database
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

// == Converts Date object to ISOString
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

  // == Example of how 'items' object data should end up
  // let allAppointmentData = {
  //   '2023-07-30': [{name: 'item 1 - any js object', date: '2023-07-30'}],
  //   '2023-08-07': [{name: 'item 1 for day'}, {name: 'item 2 for day'}],
  // };

  // == Fixes dates because of how database stores them
  // == Schedule needs single digits to have 0 in front of them.
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

  // == Converts appointment data into object to be used to fill Schedule
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

  // == Handles how each appontment will be rendered
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

  // == Handles what happens when you click on an empty day
  const handleEmptyDayPress = day => {
    navigation.navigate('Appointment', day);
  };

  // == Handles how days with no appointments shall be rendered
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

  // == Handles what happens when speech has ended
  const onSpeechEnd = async e => {
    console.log('onSpEnd');
    let VoiceCommands = new voiceCommands();
    VoiceCommands.commandKeys = [
      'address',
      'city',
      'state',
      'title',
      'tidal',
      'date',
      'zip',
      'add',
      'edit',
      'remove',
      'read',
      'directions'
    ];
    VoiceCommands.parseString = result;
    await VoiceCommands.breakDown();
    let fullResult = VoiceCommands.returnResults();

    if (fullResult.add) {
      addVoiceOption(fullResult, VoiceCommands);
    } else if (fullResult.edit) {
      editVoiceOptions(fullResult, VoiceCommands);
    } else if (fullResult.remove) {
      removeVoiceOption(fullResult, VoiceCommands);
    } else if (fullResult.read) {
      readVoiceOption(fullResult, VoiceCommands);
    } else if (fullResult.directions) {
      getDirections(fullResult, VoiceCommands)
    }

  };
  
  const onSpeechResults = e => {
    // setResult('');
    let appointmentData = {};
    const spokenWords = e.value[0].split(' ');
    const command = spokenWords.join(' ').toLowerCase();
    // setResult(e.value[0]);
    result = e.value[0];
    handleVoiceResults(e); /////should trigger the added function to make the button stop listening..armando
  };


  const onSpeechRecognized = e => {
    console.log(e.isFinal);
    // Object.keys(e).forEach(each => console.log(each));
    let a = 'a';
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



//==========| ADD NEW APPT |==========\\
async function addVoiceOption(fullResult, VoiceCommands) {
  let fullTitle = '';
  if (fullResult.title) {
    fullTitle = fullResult.title[0];
  } else if (fullResult.tidal) {
    fullTitle = fullResult.tidal[0];
  }

  if (fullTitle != '' && fullResult.date) {
    let cityValue = '';
    let stateValue = '';
    let zipValue = '';
    let addressValue = '';
    if (fullResult.city) {
      cityValue = fullResult.city;
    }
    if (fullResult.state) {
      stateValue = fullResult.state;
    }
    if (fullResult.zip) {
      zipValue = fullResult.zip;
    }
    if (fullResult.address) {
      addressValue = fullResult.address;
    }

    let currentDate = fullResult.date[0];
    let dateTable = currentDate.split(' ');
    for (let i = 0; i < dateTable.length; i++) {
      dateTable[i] = dateTable[i].replaceAll(',', '');
    }
    let newDate = new Date(
      dateTable[2],
      allMonths[dateTable[0]].value - 1,
      dateTable[1],
    );

    await database.appTable.add(
      fullTitle,
      JSON.stringify({
        address: addressValue,
        city: cityValue,
        state: stateValue,
        zipCode: zipValue,
      }),
      JSON.stringify([]),
      newDate.toString(),
      newDate.toString(),
    );
  } else {
    console.error('Missing Data to add event');
    console.error(VoiceCommands.parseString);
  }
}

//==========| EDIT APPT |==========\\
async function editVoiceOptions(fullResult, VoiceCommands) {
  if (fullResult.title && fullResult.date) {
    await database.onAppReady();
    await database.appTable.reload();
    let findDate = fullResult.date[0];
    let title = fullResult.title[0];

    let dateTable = findDate.split(' ');
    for (let i = 0; i < dateTable.length; i++) {
      dateTable[i] = dateTable[i].replaceAll(',', '');
    }
    let newDate = new Date(
      dateTable[2],
      allMonths[dateTable[0]].value - 1,
      dateTable[1],
    );

    database.appTable.data.forEach(event => {
      let testDate = new Date(event[4][1]);

      let parseDate1 = `${newDate.getMonth()}-${newDate.getDate()}-${newDate.getFullYear()}`;
      let parsedate2 = `${testDate.getMonth()}-${testDate.getDate()}-${testDate.getFullYear()}`;

      if (
        parseDate1 == parsedate2 &&
        title.toLowerCase() == event[1][1].toLowerCase()
      ) {
        if (fullResult.title[1]) {
          database.appTable.update(
            event[0][1],
            'eventTitle',
            fullResult.title[1],
          );
        } else {
          console.error('No valid');
        }
      }
    });
  } else {
    console.error('Missing Data to edit event');
    console.error(VoiceCommands.parseString);
    Tts.speak('I am sorry but I need a little more detail to create a new event');
  }
}

//==========| REMOVE APPT |==========\\
async function removeVoiceOption(fullResult, VoiceCommands) {
  if (fullResult.title && fullResult.date) {
    await database.onAppReady();
    await database.appTable.reload();
    let findDate = fullResult.date[0];
    let title = fullResult.title[0];

    let dateTable = findDate.split(' ');
    for (let i = 0; i < dateTable.length; i++) {
      dateTable[i] = dateTable[i].replaceAll(',', '');
    }
    let newDate = new Date(
      dateTable[2],
      allMonths[dateTable[0]].value - 1,
      dateTable[1],
    );

    database.appTable.data.forEach(event => {
      let testDate = new Date(event[4][1]);

      let parseDate1 = `${newDate.getMonth()}-${newDate.getDate()}-${newDate.getFullYear()}`;
      let parsedate2 = `${testDate.getMonth()}-${testDate.getDate()}-${testDate.getFullYear()}`;

      let currentTitle = event[1][1]
      if (parseDate1 == parsedate2 && title.toLowerCase() == currentTitle.toLowerCase()) {
        database.appTable.removeIndex(event[0][1]);
      }
    });
  } else {
    console.error('Missing Data to remove event');
    console.error(VoiceCommands.parseString);
    Tts.speak('I am sorry but I need a little more detail to remove a event.');
  }
}

//==========| READ APPT |==========\\
async function readVoiceOption(fullResult, VoiceCommands) {
  await database.onAppReady();
  await database.appTable.reload();
  if (fullResult.read) {
    let findDate = fullResult.read[0];

    let dateTable = findDate.split(' ');
    for (let i = 0; i < dateTable.length; i++) {
      dateTable[i] = dateTable[i].replaceAll(',', '');
    }
    let newDate = new Date(
      dateTable[2],
      allMonths[dateTable[0]].value - 1,
      dateTable[1],
    );
  
    let foundReminder = false
    database.appTable.data.forEach(event => {
      let testDate = new Date(event[4][1]);
  
      let parseDate1 = `${newDate.getMonth()}-${newDate.getDate()}-${newDate.getFullYear()}`;
      let parsedate2 = `${testDate.getMonth()}-${testDate.getDate()}-${testDate.getFullYear()}`;
  
      if (parseDate1 == parsedate2) {
        if (foundReminder == false) {
          foundReminder = true
          Tts.speak('Your reminders are the following.');
        }
        Tts.speak(event[1][1]);
      }
    });
    if (foundReminder == false) {
      Tts.speak('You have no reminders');
    }
  } else {
    Tts.speak('I am sorry but I need a little more detail to find your event.');
  }
}

setInterval(async () => {
  await database.onAppReady();
  await database.appTable.reload();
  let fullData = database.appTable.data;
  fullData.forEach(event => {
    event;
  });
}, 55000);



//==========| Get Directions |==========\\
async function getDirections(fullResult, VoiceCommands) {
  await database.onAppReady();
  await database.appTable.reload();
  if (fullResult.directions && fullResult.title) {
    let findDate = fullResult.directions[0];
    let findTitle = fullResult.title[0]

    let dateTable = findDate.split(' ');
    for (let i = 0; i < dateTable.length; i++) {
      dateTable[i] = dateTable[i].replaceAll(',', '');
    }
    let newDate = new Date(
      dateTable[2],
      allMonths[dateTable[0]].value - 1,
      dateTable[1],
    );

    Tts.speak('Getting directions to your event');
    database.appTable.data.forEach(event => {
      let testDate = new Date(event[4][1]);

      let parseDate1 = `${newDate.getMonth()}-${newDate.getDate()}-${newDate.getFullYear()}`;
      let parsedate2 = `${testDate.getMonth()}-${testDate.getDate()}-${testDate.getFullYear()}`;

      let currentTitle = event[1][1]
      if (parseDate1 == parsedate2 && findTitle.toLowerCase() == currentTitle.toLowerCase()) {
        let addressObject = JSON.parse(event[2][1])
        let formattedAddress = `${addressObject.address}, ${addressObject.city}, ${addressObject.state}, ${addressObject.zipCode}`;
        // For iOS - using Apple Maps
        if (Platform.OS === 'ios') {
          Linking.openURL(`http://maps.apple.com/?address=${formattedAddress}`);
        }
        // For Android - using Google Maps
        else {
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`);
        };
      }
    });
  } else {
    console.error('Not enough data to get directions')
    console.error(VoiceCommands.parseString);
    Tts.speak('I am sorry but I need a little more detail to get your directions.');
  }
}