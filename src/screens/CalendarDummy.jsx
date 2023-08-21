import {View, Text} from 'react-native';
import React from 'react';

const CalendarDummy = ({navigation}) => {
  setTimeout(() => {
    navigation.navigate('Calendar');
  }, 200);

  return <View />;
};

export default CalendarDummy;
