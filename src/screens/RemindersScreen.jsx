import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, ScrollView, Button} from 'react-native';
import RemindersForm from '../forms/RemindersForm';
import EditReminderForm from '../forms/EditReminderForm';
import styles from '../styles';
import AddButtonModal from '../components/AddButtonModal';
import EditButtonModal from '../components/EditButtonModal';
import TtsButtonComponent from '../components/TtsButtonComponent';
import Tts from 'react-native-tts';

function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
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

  // Fetch reminders data on component mount note
  useEffect(() => {
    const fetchData = async () => {
      await fetchRemindersFromDatabase();
    };

    fetchData();

    return () => {
      Tts.stop();
    };
  }, []);
  //this logic will read reminders if any else no reminders found

  const readReminders = () => {
    if (reminders.length > 0) {
      reminders.forEach(reminder => {
        Tts.speak(reminder[1][1]);
      });
    } else {
      Tts.speak('No reminders found.');
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
    </View>
  );
}

export default RemindersScreen;
