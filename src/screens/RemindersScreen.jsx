import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Text, View, ScrollView, Button} from 'react-native';
import RemindersForm from '../forms/RemindersForm';
import EditReminderForm from '../forms/EditReminderForm';
import AddButtonModal from '../components/AddButtonModal';
import EditButtonModal from '../components/EditButtonModal';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import SpeechButton from '../components/SpeechButton';
import styles from '../styles';

let LocationServices = require('../location/LocationSys.jsx')

let Database = require('../database/ProfileDatabase.jsx');
let database = new Database();

class trackingLocationReminder extends LocationServices {
    constructor() {
        super()
        this.ready = false
        this.start()
    }

    onReady() {
        return new Promise((resolve, reject) => {
            let readyInterval = setInterval(() => {
                if (this.ready == true) {
                    clearInterval(readyInterval)
                    resolve()
                }
            }, 1)
        })
    }

    async start() {
        let myAddress = await this.getMyAddress()
        console.log(myAddress)
    }

    async getMyAddress() {
        return new Promise(async (resolve, reject) => {
            await database.onProfileReady()
            await database.table.reload()
            let addressInterval = setInterval(() => {
                //console.log('Check')
                if (database.table.data[0]) {
                    clearInterval(addressInterval)
                    let myAddress = `${database.table.data[0][3][1]} ${database.table.data[0][4][1]} ${database.table.data[0][5][1]} ${database.table.data[0][6][1]}`
                    resolve(myAddress)
                }
            }, 1)
        })
    }

    async readReminders() {
        const remindersData = await leavingHomeReminderTable.view();
        if (remindersData.length > 0) {
            remindersData.forEach(reminder => {
                Tts.speak(reminder[1][1]);
            });
        } else {
            Tts.speak('No reminders found.');
        }
    }

    async setupDebugInterval() {
        setInterval(async () => {
            this.baseCampLocation = await this.getCoordsByAddress("60 Mimosa Dr, Grenada MS 38901")

            setTimeout(async () => {
                this.baseCampLocation = await this.getCoordsByAddress("802 Central St, Water Valley MS")
            }, 3000)
        }, 12000)
    }
}; new trackingLocationReminder()

//async function startLocationTracking() {

//    async function readReminders() {
       
//    };

//    locationServices.createGeoFenceAddress("802 Central St, Water Valley MS", 20, () => {
//        console.log('Enter')
//    }, async () => {
//        readReminders()
//    }, 4)


//};


function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const voiceInputRef = useRef('');


  // DATABASE REMINDERS FETCH ===========================

  const fetchRemindersFromDatabase = async () => {
    try {
      const remindersData = await leavingHomeReminderTable.view();
      setReminders(remindersData);
      console.log('Updated reminders:', remindersData);
      return remindersData;
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  // CRUD REMINDERS ================================

  const onSubmit = async data => {
    await leavingHomeReminderTable.add(data);
    await fetchRemindersFromDatabase();
    console.log('Reminders:', data);
  };

  const deleteReminder = async id => {
    try {
      await leavingHomeReminderTable.removeIndex(id);
      await fetchRemindersFromDatabase();
      console.log('Reminders after deletion:', reminders);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const updateReminder = async (id, newData) => {
    try {
      await leavingHomeReminderTable.update(id, 'reminderText', newData);
      await fetchRemindersFromDatabase();
      console.log('EDITED SUCCESSFULLY', newData);
    } catch (error) {
      console.error('Error editing reminder:', error);
    }
  };

  // USE EFFECT  ======================

  useEffect(() => {
    // Fetch reminders data
    const fetchData = async () => {
      await fetchRemindersFromDatabase();
    };
    fetchData();
  
    // Setup voice commands
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
  
    // Cleanup on component unmount
    return () => {
      Tts.stop();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [toggleListening]);

  const readReminders = async () => {
    const remindersData = await fetchRemindersFromDatabase();
    console.log(remindersData);
    if (remindersData.length > 0) {
      remindersData.forEach(reminder => {
        Tts.speak(reminder[1][1]);
        // DEBUG PURPOSES ========================
        console.log(reminder[1][1])
      });
    } else {
      Tts.speak('No reminders found.');
    }
  };

  const toggleListening = useCallback(() => {
    if (isListening) {
      console.log("STOP PLEASE");
      Voice.stop();
    } else {
      Tts.speak("Say add to add a reminder, delete to delete a reminder, or read to read your reminders aloud.");
      Voice.start('en-US');
      // Tts.addEventListener('tts-finish', event => {
      //   if (!isListening) {
      //     console.log("HELP")
      //     Voice.start('en-US');
      //   }
      // });
      // Removed Voice.start('en-US') from here
    }
    setIsListening(!isListening);
  }, [isListening]);
  



  // Event handlers for voice recognition
  const onSpeechStart = e => {
    console.log('Speech started');
  };
  const addReminderByVoice = async (spokenWords) => {
    // Remove the 'add' command word from the input
    spokenWords.shift();
    // Join the remaining words to form the reminder
    const data = spokenWords.join(' ');
  
    // Add reminder to the database
    await onSubmit(data);
  
    // Fetch new list of reminders
    fetchRemindersFromDatabase();
  }
  
  const deleteReminderByVoice = async (spokenWords) => {
    try {
    // Remove the 'delete' command word from the input
    spokenWords.shift();

    // Join the remaining words to form the reminder content
    const reminderContent = spokenWords.join(' ');

    // Find the reminder to be deleted
    const reminderToDelete = reminders.find(reminder => reminder[1][1].toLowerCase() === reminderContent.toLowerCase());

      if (reminderToDelete) {
        await deleteReminder(reminderToDelete[0][1]);
        console.log('Deleted reminder:', reminderToDelete);
      } else {
        console.log(reminderToDelete);
        console.log('Reminder not found:', spokenWords);
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
    fetchRemindersFromDatabase();
  }


  
  const onSpeechEnd = (e) => {
    console.log('onSpeechEnd:', e);
    console.log('Final voice input:', voiceInputRef.current); // We use the ref here
    
    const spokenWords = voiceInputRef.current.split(" ");
    const command = spokenWords[0].toLowerCase();
  
    if (command === 'delete') {
      console.log("HERE TO DELETE =================")
      deleteReminderByVoice(spokenWords);
      return; // Skip the rest of the function
    }
    else if (command === 'add') {
      addReminderByVoice(spokenWords);
      return; // Skip the rest of the function
    } else if (command === 'read') {
      console.log("HERE TO READ ====================")
      readReminders();
      return;
    }
  
    // If command is not recognized, do nothing
    console.log('Command not recognized:', command);
  };
  


  const onSpeechResults = async (e) => {
    console.log('onSpeechResults:', e);
    console.log(e.value[e.value.length - 1]);
    const lastResult = e.value[e.value.length - 1];
    voiceInputRef.current = lastResult; // We update the ref here
  };

  const onSpeechError = e => {
    console.error('Speech recognition error:', e);
  };



  return (
    <View style={{flex: 1}}>

      <Text style={styles.sectionTitle}>Reminders</Text>
      <AddButtonModal children={<RemindersForm />} onSubmit={onSubmit} />

      <ScrollView style={{flex: 1}}>
        {reminders === null ? (
          <Text>Loading...</Text>
        ) : reminders.length > 0 ? (
          reminders.map((reminder, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>{reminder[1][1]}</Text>

              <EditButtonModal
                children={<EditReminderForm reminderData={reminder} />}
                onEditSubmit={editedData =>
                  updateReminder(reminder[0][1], editedData)
                }
              />
              <Button
                title="Delete"
                onPress={() => {
                  deleteReminder(reminder[0][1]);
                }}
              />
            </View>
          ))
        ) : (
          <Text>No reminders found.</Text>
        )}
      </ScrollView>
      {/* <Button title="Read Reminders" onPress={readReminders} /> */}
      <SpeechButton isListening={isListening} onPress={toggleListening} />
    </View>
  );
}

export default RemindersScreen;
