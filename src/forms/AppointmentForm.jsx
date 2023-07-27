import React, { useState } from 'react';
import { View, Text, Button, TextInput, Platform } from 'react-native';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles'

const AppointmentForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [reminder, setReminder] = useState('15'); // Default to 15 minutes reminder
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'thingsToBring',
  });

  const onSubmit = (data) => {
    const formData = {
        ...data,
        selectedDate,
        selectedTime,
        reminder,
      };
    console.log('Form data:', formData);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const showReminderPickerModal = () => {
    setShowReminderPicker(!showReminderPicker);
  };

  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const onTimeChange = (event, selected) => {
    const currentTime = selected || selectedTime;
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
  };

  const handleThingToBringChange = (text, index) => {
    setValue(`thingsToBring[${index}].item`, text); // Update the form value
  };

  return (
    <View>
      <Text>Make an Appointment</Text>

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Event Title"
            value={value}
            onChangeText={(text) => onChange(text)}
          />
        )}
        name="eventTitle"
        rules={{ required: 'Text is required.' }}
        defaultValue=""
      />
      {errors.eventTitle && <Text style={styles.error}>{errors.eventTitle.message}</Text>}


      <View>
        <Text>Select Date:</Text>
        <Button onPress={showDatepicker} title="Select Date" />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <View>
        <Text>Select Time:</Text>
        <Button onPress={showTimepicker} title="Select Time" />
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
      <View>
        <Text>Select Reminder:</Text>
        <Text>Selected Reminder: {reminder} minutes before</Text>
        <Button onPress={showReminderPickerModal} title="Open Reminder Picker" />
        {showReminderPicker && (
          <Picker
            selectedValue={reminder}
            onValueChange={(itemValue) => setReminder(itemValue)}
          >
            <Picker.Item label="15 minutes before" value="15" />
            <Picker.Item label="30 minutes before" value="30" />
            <Picker.Item label="1 hour before" value="60" />
            <Picker.Item label="2 hours before" value="120" />
          </Picker>
        )}
      </View>

        {/* Things to Bring as Reminders with Appointment: */}


      <View>
        <Text>Things to Bring:</Text>
        {fields.map((field, index) => (
          <View key={field.id}>
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder={`Item ${index + 1}`}
                  onChangeText={(text) => handleThingToBringChange(text, index)} // New line
                />
              )}
              name={`thingsToBring[${index}].item`}
              defaultValue=""
            />
            <Button onPress={() => remove(index)} title="Remove" />
          </View>
        ))}
        <Button onPress={() => append({ item: '' })} title="Add Item" />
      </View>
      
      <Button onPress={handleSubmit(onSubmit)} title="Submit" />
    </View>
  );
};

export default AppointmentForm;