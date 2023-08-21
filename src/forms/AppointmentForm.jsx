import {React, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Controller, useForm, useFieldArray} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import LocationModal from '../components/LocationModal';
import styles from '../styles';
import TrashButton from '../components/TrashButton';
import ReminderPickerModal from '../components/ReminderPickerModal';

//let Database = require('../database/Database.jsx');
let Database = require('../database/CalendarDatabase.jsx');
let database = new Database('appointmentDatabase');

async function startDatabase() {
  await database.onAppReady();
  appointmentTable = database.appTable;
  appointmentRemindersTable = database.appReminderTable;
};
startDatabase();

const AppointmentForm = ({navigation, route}) => {
  const appointmentData = route.params;
  // console.log(appointmentData[0].eventTitle);
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
      setValue('city', appointmentData[0].location.city);
      setValue('state', appointmentData[0].location.state);
      setValue('zipcode', appointmentData[0].location.zipCode);
      setSelectedDate(convertedDate);
    }, [appointmentData, setValue]);
  };

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
      appointmentTable.update(
        appointmentData[0].id,
        'eventTitle',
        formData.eventTitle,
      );
      appointmentTable.update(
        appointmentData[0].id,
        'location',
        formData.location,
      );
      appointmentTable.update(
        appointmentData[0].id,
        'reminder',
        formData.reminder,
      );
      appointmentTable.update(
        appointmentData[0].id,
        'selectedDate',
        formData.selectedDate,
      );
      appointmentTable.update(
        appointmentData[0].id,
        'selectedTime',
        formData.selectedTime,
      );
      appointmentTable.reload();
    } else {
      console.log(formData.reminder);
      await appointmentTable.add(
        formData.eventTitle,
        formData.location,
        formData.reminder,
        formData.selectedDate,
        formData.selectedTime,
      );

      const newestAppointmentId =
        await appointmentTable.getNewestAppointmentId();

      for (const item of formData.thingsToBring) {
        await appointmentRemindersTable.add(newestAppointmentId, item.item);
      };

      appointmentTable.reload();
    };
    appointmentTable.reload();
    const passReload = true;
    navigation.navigate('Calendar', passReload);
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
    <ScrollView>
      <View style={styles.appointmentFormContainer}>
        {/* ============== EVENT TITLE INPUT VIEW ================== */}
        <View style={styles.dateContainer}>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
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
        </View>

        {/* ================== LOCATION MODAL SECTION VIEW */}
      <View style={styles.dateContainer}>
        {
          (appointmentData[1] && !appointmentData[0].location.address && 
          !appointmentData[0].location.city && 
          !appointmentData[0].location.state && 
          !appointmentData[0].location.zipCode) || 
          (!location.address && !location.city && !location.state && !location.zipCode) ? 
          (
            <>
              <Text style={styles.appointmentHeaderText}>No Location Saved.</Text>
            </>
          ) : (
            <>
              <Text style={styles.appointmentHeaderText}>
                  {appointmentData[1] ? appointmentData[0].location.address : location.address}
              </Text>
              <Text style={styles.appointmentHeaderText}>
                  {appointmentData[1] ? appointmentData[0].location.city : location.city},{' '}
                  {appointmentData[1] ? appointmentData[0].location.state : location.state}
              </Text>
            </>
          )
        }
        <LocationModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSubmit={handleLocationSubmit}
          locationData={appointmentData[1] ? appointmentData[0].location : location}
        />

      <TouchableOpacity style={styles.modalButton} onPress={() => setShowLocationModal(true)}>
        <Text style={styles.buttonText}>Add Location</Text>
      </TouchableOpacity>
      </View>
      {/* ======================= DATE PICKER ===================== */}
      <View style={styles.dateContainer}>
        <View style={styles.rowLayout}>
        <TouchableOpacity style={styles.dateTimeButton} onPress={showDatepicker}>
        <Text style={styles.buttonText}>Select Date:</Text>
      </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            textColor="#0C2340"
          />
        )}
        </View>
      </View>
      {/* ======================= TIME PICKER ===================== */}
      <View style={styles.dateContainer}>
        <View style={styles.rowLayout}>
        <TouchableOpacity style={styles.dateTimeButton} onPress={showTimepicker}>
          <Text style={styles.buttonText}>Select Time:</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
        </View>
      </View>

      {/* ========================= REMINDER TIME ========================= */}
        <View style={styles.dateReminderContainer}>
          <View style={styles.centeredView}>
          <Text style={styles.appointmentHeaderText}>Selected Alert Time:</Text>
          <Text style={styles.appointmentHeaderText}>{reminder} minutes before</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setShowReminderPicker(true)}>
            <Text style={styles.buttonText}>Set Alert Time:</Text>
          </TouchableOpacity>
          </View>
          
          <ReminderPickerModal 
            visible={showReminderPicker} 
            onClose={() => setShowReminderPicker(false)}
            selectedValue={reminder}
            onValueChange={itemValue => setReminder(itemValue)}
          />
          
        </View>

        <View style={styles.dateContainer}>
        <Text style={styles.appointmentHeaderText}>Add Items You Need:</Text>
          {fields.map((field, index) => (
            <View
              key={field.id}
              style={styles.appointmentFormRemindersContainer}>
              <Controller
                control={control}
                render={({field}) => (
                  <TextInput
                    {...field}
                    style={styles.inputReminders}
                    placeholder={`Item ${index + 1}`}
                    onChangeText={text => handleThingToBringChange(text, index)} // New line
                  />
                )}
                name={`thingsToBring[${index}].item`}
                defaultValue=""
              />
              <TrashButton onPress={() => remove(index)} />
            </View>
          ))}
          <TouchableOpacity style={styles.modalButton} onPress={() => append({item: ''})}>
            <Text style={styles.buttonText}>Add Item:</Text>
          </TouchableOpacity>
        </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AppointmentForm;
