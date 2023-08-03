import React, {useState, useEffect, useRef} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Button} from 'react-native';
import RemindersForm from '../forms/RemindersForm';
import EditReminderForm from '../forms/EditReminderForm';
import styles from '../styles';
import AddButtonModal from '../components/AddButtonModal';
import EditButtonModal from '../components/EditButtonModal';
import TtsButtonComponent from '../components/TtsButtonComponent';
import Tts from 'react-native-tts';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { wordsToNumbers } from 'words-to-numbers';

function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);


  const [reminderIndexToEdit, setReminderIndexToEdit] = useState(null);
  const voiceInputRef = useRef('');
  console.log(reminders);

  // DATABASE REMINDERS FETCH ===========================

  const fetchRemindersFromDatabase = async () => {
    try {
      const remindersData = await leavingHomeReminderTable.view();
      setReminders(remindersData);
      console.log('Updated reminders:', remindersData);
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
  }, []);

  const readReminders = () => {
    if (reminders.length > 0) {
      reminders.forEach(reminder => {
        Tts.speak(reminder[1][1]);
        // DEBUG PURPOSES ========================
        console.log(reminder[1][1])
      });
    } else {
      Tts.speak('No reminders found.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };
  



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
    const numberString = spokenWords[1];
    const index = wordsToNumbers(numberString);
    if (index > 0 && index <= reminders.length) {
      await deleteReminder(reminders[index - 1][0][1]);
      console.log("DELETE HERE")
      // Fetch new list of reminders
      fetchRemindersFromDatabase();
    }
  }

  const editReminderByVoice = async (spokenWords) => {
    const numberString = spokenWords[1];
    const index = wordsToNumbers(numberString);
    
    if (!isNaN(index) && index > 0 && index <= reminders.length) {
      const newData = spokenWords[2];
      await updateReminder(reminders[index - 1][0][1], newData);
      fetchRemindersFromDatabase();
    }
  };
  
  const onSpeechEnd = (e) => {
    console.log('onSpeechEnd:', e);
    console.log('Final voice input:', voiceInputRef.current); // We use the ref here
    
    const spokenWords = voiceInputRef.current.split(" ");
    const command = spokenWords[0].toLowerCase();
  
    if (command === 'delete') {
      deleteReminderByVoice(spokenWords);
      return; // Skip the rest of the function
    }
    else if (command === 'add') {
      addReminderByVoice(spokenWords);
      return; // Skip the rest of the function
    } else if (command === 'edit') {
      editReminderByVoice(spokenWords);
    }
  
    // If command is not recognized, do nothing
    console.log('Command not recognized:', command);
  };
  


  const onSpeechResults = async (e) => {
    console.log('onSpeechResults:', e);
    console.log(e.value[e.value.length - 1]);
    const lastResult = e.value[e.value.length - 1];
    voiceInputRef.current = lastResult; // We update the ref here


    // delete reminder code that works:

    // const words = lastResult.split(' '); // Split the spoken words into an array
    // if (words[0].toLowerCase() === 'delete') {
    //   // User wants to delete a reminder
    //   const idWord = words[1]; // Assume the id of the reminder follows after 'delete'
    //   const id = wordsToNumbers(idWord); // Convert the word to a number
    //   if (!isNaN(id)) {
    //     await deleteReminder(id); // Call your delete function
    //     fetchRemindersFromDatabase(); // Update reminders from the database
    //   } else {
    //     console.log('Invalid reminder ID');
    //   }
    // }
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
      <Button title="Read Reminders" onPress={readReminders} />
      <TouchableOpacity style={styles.voiceButton} onPress={toggleListening}>
    <Text style={styles.voiceButtonText}>
      {isListening ? 'Stop Listening' : 'Listen'}
    </Text>
  </TouchableOpacity>
    </View>
  );
}

export default RemindersScreen;
