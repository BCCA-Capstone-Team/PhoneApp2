import React from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import styles from '../styles';

let Database = require('../database/Database.jsx');
let database = new Database('leavingHomeReminderDatabase');

async function startDatabase() {
  leavingHomeReminderTable = await database.createTable(
    'leavingHomeReminder',
    column => {
      // Auto Clear is forcing a recreation of the table every time.
      // column.autoClear();

      column.create('reminderText', 'TEXT');

      column.run();
    },
  );
}
startDatabase();

const RemindersForm = ({onSubmitForm}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const onSubmit = data => {
    onSubmitForm(data.leavingHomeReminder);
    reset();
  };

  return (
    <View>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Reminder"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="leavingHomeReminder"
        rules={{required: 'Text is required.'}}
        defaultValue=""
      />
      {errors.leavingHomeReminder && (
        <Text style={styles.error}>{errors.leavingHomeReminder.message}</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RemindersForm;
