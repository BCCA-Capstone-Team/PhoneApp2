import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ScrollView } from 'react-native';
import RemindersForm from '../forms/RemindersForm';
import styles from '../styles';
import AddButtonModal from '../components/AddButtonModal';

function RemindersScreen() {
  const [reminders, setReminders] = useState([]);

  const fetchRemindersFromDatabase = async () => {
    try {
      console.log("here")
      const remindersData = await leavingHomeReminderTable.view();
      setReminders(remindersData);
      console.log(reminders.length)

    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  // Fetch reminders data on component mount
  useEffect(() => {
    fetchRemindersFromDatabase();
  }, []);


  const onSubmit = async (data) => {
    await leavingHomeReminderTable.add(data);
    await fetchRemindersFromDatabase();
    console.log('Reminders:', data);
  };


  return (
    <View style={{flex : 1}}>
      <Text style={styles.sectionTitle}>Reminders</Text>
      <AddButtonModal children={<RemindersForm/>} onSubmit={onSubmit}/>


      <ScrollView style={{ flex: 1 }}>
        {reminders.length > 0 ? (
          reminders.map((reminder, index) => (
            <Text key={index}>{reminder[1][1]}</Text>
          ))
        ) : (
          <Text>No reminders found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

export default RemindersScreen;