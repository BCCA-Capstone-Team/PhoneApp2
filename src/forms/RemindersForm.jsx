import React from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

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

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
  },
});
  
  export default RemindersForm;