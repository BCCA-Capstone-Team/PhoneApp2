import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, ScrollView, Button} from 'react-native';
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

function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [reminderIndexToEdit, setReminderIndexToEdit] = useState(null);
  console.log(reminders);

  const fetchRemindersFromDatabase = async () => {
    try {
      const remindersData = await leavingHomeReminderTable.view();
      setReminders(remindersData);
      console.log('Updated reminders:', remindersData);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

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
      Voice.onSpeechStart = undefined;
      Voice.onSpeechEnd = undefined;
      Voice.onSpeechResults = undefined;
      Voice.onSpeechError = undefined;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const readReminders = () => {
    if (reminders.length > 0) {
      reminders.forEach(reminder => {
        Tts.speak(reminder[1][1]);
      });
    } else {
      Tts.speak('No reminders found.');
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  // Event handlers for voice recognition
  const onSpeechStart = e => {
    console.log('Speech started');
  };

  const onSpeechEnd = e => {
    setIsListening(false);
  };

  const onSpeechResults = e => {
    console.log('onSpeechResults:', e);
    handleVoiceResults(e);
  };

  const onSpeechError = e => {
    console.error('Speech recognition error:', e);
  };

  // Handling voice results
  const handleVoiceResults = async e => {
    let spokenWords = e.value;
    const command = spokenWords[0].toLowerCase();

    if (voiceCommand === 'add') {

      await leavingHomeReminderTable.add(command);
      await fetchRemindersFromDatabase();
      setVoiceCommand('');
    } else if (voiceCommand === 'delete') {
      Tts.speak("What would you like to delete?")
      const index = parseInt(command, 10);
      if (index > 0 && index <= reminders.length) {
        await deleteReminder(reminders[index - 1][0][1]);
      }
      setVoiceCommand('');
    } else if (voiceCommand === 'edit') {
      Tts.speak("What would you like to edit?")
      if (reminderIndexToEdit === null) {
        const index = parseInt(command, 10);
        if (index > 0 && index <= reminders.length) {
          setReminderIndexToEdit(index - 1);
          setVoiceCommand('edit reminder content');
          startListening();
        }
      } else {
        await updateReminder(
          reminders[reminderIndexToEdit][0][1],
          command
        );
        setReminderIndexToEdit(null);
        setVoiceCommand('');
      }
    } else {
      switch (command) {
        case 'add':
        case 'delete':
        case 'edit':
          setVoiceCommand(command);
          startListening();
          break;
        case 'Sorry, I did not understand.':
          break;
        default:
          Tts.speak('Sorry, I did not understand.'); // message for unknown commands
          break;
      }
    }
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
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />
    </View>
  );
}

export default RemindersScreen;
