import {View, Text} from 'react-native';
import React from 'react';
import AppointmentForm from '../forms/AppointmentForm';

const AppointmentFormScreen = ({navigation, route}) => {
  return (
    <View>
      <AppointmentForm navigation={navigation} route={route} />
    </View>
  );
};

export default AppointmentFormScreen;
