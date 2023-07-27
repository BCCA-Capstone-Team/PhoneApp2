import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { startOfWeek, addDays } from 'date-fns';
import { Calendar, WeekCalendar, Agenda, DateData } from 'react-native-calendars';

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const Schedule = () => {
  const [items, setItems] = useState({});

  const loadItems = day => {
    setTimeout(() => {
      const newItems = {};
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        let myItems = [];
        // Create events for different dates and add them to myItems array
        // Example:
        // myItems.push({ name: 'Event 1', height: 50 });
        // myItems.push({ name: 'Event 2', height: 80 });
        // ...

        newItems[strTime] = myItems;
      }
      setItems(newItems);
    }, 1000);
  };

  const renderItem = item => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderStyle: 'solid',
          borderBlockColor: 'red',
        }}
        onPress={() => {
          console.log(item);
        }}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Schedule;