import {React, useState, useEffect} from 'react';
import {View, Text, Button, TextInput, Platform} from 'react-native';
import {Controller, useForm, useFieldArray} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import LocationModal from '../components/LocationModal';
import styles from '../styles';

//let Database = require('../database/Database.jsx');
let Database = require('../database/CalendarDatabase.jsx');
let database = new Database('appointmentDatabase');

async function startDatabase() {
  await database.onAppReady();
  appointmentTable = database.appTable;
  appointmentRemindersTable = database.appReminderTable;
}
startDatabase();

const AppointmentForm = ({navigation, route}) => {
  const appointmentData = route.params;
  console.log(appointmentData[0].eventTitle);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [reminder, setReminder] = useState('15'); // Default to 15 minutes reminder
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [showLocationModal, setShowLocationModal] = useState(false);

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'thingsToBring',
  });

  // Prefilling form data //

  if (appointmentData[1]) {
    let convertedDate = new Date(appointmentData[0].date);
    useEffect(() => {
      setValue('eventTitle', appointmentData[0].eventTitle || '');
      setValue('address', appointmentData[0].location.address);
      setSelectedDate(convertedDate);
    }, [appointmentData, setValue]);
  }

  // Prefilling form data //

  const onSubmit = async data => {
    const formData = {
      ...data,
      selectedDate,
      selectedTime,
      reminder,
      location: JSON.stringify(location),
    };

    if (appointmentData[1] == true) {
      appointmentTable.appTable.update(
        appointmentData[0].id,
        'eventTitle',
        formData.eventTitle,
      );
    } else {
      await appointmentTable.add(
        formData.eventTitle,
        formData.location,
        formData.reminder,
        formData.selectedDate,
        formData.selectedTime,
      );

      //appointmentTable.show();

      const newestAppointmentId =
        await appointmentTable.getNewestAppointmentId();

      for (const item of formData.thingsToBring) {
        await appointmentRemindersTable.add(newestAppointmentId, item.item);
      }
    }
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

  const handleLocationSubmit = data => {
    setLocation(data);
    setShowLocationModal(false);
  };

  return (
    <View>
      <Text>Make an Appointment</Text>

      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Event Title"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="eventTitle"
        rules={{required: 'Text is required.'}}
        defaultValue=""
      />
      {errors.eventTitle && (
        <Text style={styles.error}>{errors.eventTitle.message}</Text>
      )}

      <View>
        <Text>Location:</Text>
        {appointmentData[1] ? (
          <>
            <Text>Address: {appointmentData[0].location.address}</Text>
            <Text>City: {appointmentData[0].location.city}</Text>
            <Text>State: {appointmentData[0].location.state}</Text>
            <Text>Zip Code: {appointmentData[0].location.zipCode}</Text>
          </>
        ) : (
          <>
            <Text>Address: {location.address}</Text>
            <Text>City: {location.city}</Text>
            <Text>State: {location.state}</Text>
            <Text>Zip Code: {location.zipCode}</Text>
          </>
        )}

        <Button
          onPress={() => setShowLocationModal(true)}
          title="Add Location"
        />
      </View>

      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSubmit={handleLocationSubmit}
        locationData={appointmentData[0].location}
      />

      <View>
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
        <Text>Selected Reminder: {reminder} minutes before</Text>
        <Button
          onPress={showReminderPickerModal}
          title="Open Reminder Picker"
        />
        {showReminderPicker && (
          <Picker
            selectedValue={reminder}
            onValueChange={itemValue => setReminder(itemValue)}>
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
              render={({field}) => (
                <TextInput
                  {...field}
                  placeholder={`Item ${index + 1}`}
                  onChangeText={text => handleThingToBringChange(text, index)} // New line
                />
              )}
              name={`thingsToBring[${index}].item`}
              defaultValue=""
            />
            <Button onPress={() => remove(index)} title="Remove" />
          </View>
        ))}
        <Button onPress={() => append({item: ''})} title="Add Item" />
      </View>

      <Button onPress={handleSubmit(onSubmit)} title="Submit" />
    </View>
  );
};

export default AppointmentForm;
