import {View, Text} from 'react-native';
import React from 'react';
import AppointmentForm from '../forms/AppointmentForm';

const AppointmentFormScreen = ({navigation}) => {
  return (
    <View>
      <AppointmentForm />
    </View>
  );
};

export default AppointmentFormScreen;
