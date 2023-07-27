import React from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import styles from '../styles';

const RemindersForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Reminders:', data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Reminder"
            value={value}
            onChangeText={(text) => onChange(text)}
          />
        )}
        name="leavingHomeReminder"
        rules={{ required: 'Text is required.' }}
        defaultValue=""
      />
      {errors.leavingHomeReminder && <Text style={styles.error}>{errors.leavingHomeReminder.message}</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
  
  export default RemindersForm;