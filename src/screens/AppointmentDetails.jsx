import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppointmentFormScreen from './AppointmentFormScreen';

const AppointmentDetails = ({navigation, route}) => {
  let data = route.params;

  const handleAddItem = dayData => {
    // console.log('hello');
    if (dayData.date) {
      navigation.navigate('AppointmentFormScreen', dayData.date);
    } else {
      navigation.navigate('AppointmentFormScreen', dayData);
    }
  };
  if (data.date || data.eventTitle) {
    // console.log(data.date);
    return (
      <View>
        <Text>Event: {data.eventTitle}</Text>
        {data.location.address &&
        data.location.city &&
        data.location.state != null ? (
          <Text>
            Location: {data.location.address} {data.location.city},{' '}
            {data.location.state}
          </Text>
        ) : (
          <Text>No location info saved!</Text>
        )}

        {data.reminder[0] ? (
          <View>
            {data.reminder.map(reminder => (
              <Text>Bring: {reminder}</Text>
            ))}
          </View>
        ) : (
          <Text>No reminders to bring along!</Text>
        )}
        <View>
          <TouchableOpacity
            style={{marginBottom: 10}}
            onPress={() => {
              handleAddItem(data);
            }}>
            <Text>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Delete Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    console.log('No stuffs.');
    return (
      <View>
        <Text>No appointments today!</Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              console.log(data);
              handleAddItem(data);
            }}>
            <Text>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Delete Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default AppointmentDetails;
