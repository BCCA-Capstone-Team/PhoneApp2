import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import styles from '../styles';

const EditReminderForm = ({ reminderData, onSubmitForm }) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      defaultValues: { leavingHomeReminder: reminderData[1][1] },
    });
  
    const onSubmit = (data) => {
      onSubmitForm(data.leavingHomeReminder);
      reset();
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
        {errors.leavingHomeReminder && (
          <Text style={styles.error}>{errors.leavingHomeReminder.message}</Text>
        )}
  
        <Button title="Update" onPress={handleSubmit(onSubmit)} />
      </View>
    );
  };

  export default EditReminderForm;
  