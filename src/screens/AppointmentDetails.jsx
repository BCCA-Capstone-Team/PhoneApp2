import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppointmentFormScreen from './AppointmentFormScreen';

const AppointmentDetails = ({navigation, route}) => {
  let data = route.params;

  const handleAddItem = dayData => {
    // console.log('hello');
    navigation.navigate('AppointmentFormScreen', dayData);
  };

  if (data.date || data.name) {
    // console.log(data.date);
    return (
      <View>
        <Text>{data.name}</Text>
        <View>
          <TouchableOpacity
            style={{marginBottom: 10}}
            onPress={() => {
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
