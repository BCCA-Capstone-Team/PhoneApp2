import React from 'react';
import {View, StyleSheet} from 'react-native';
import SuccessModal from '../components/SuccessModal';

const TestScreen = () => {
  return (
    <View style={styles.container}>
      {/* Render the SuccessModal with desired props */}
      <SuccessModal
        visible={true}
        message="Profile created successfully!"
        onClose={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestScreen;
