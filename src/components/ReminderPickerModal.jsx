// ReminderPickerModal.js
import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from '../styles';

const ReminderPickerModal = ({
  visible,
  onClose,
  selectedValue,
  onValueChange,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
            <Picker.Item label="15 minutes before" value="15" />
            <Picker.Item label="30 minutes before" value="30" />
            <Picker.Item label="1 hour before" value="60" />
            <Picker.Item label="2 hours before" value="120" />
          </Picker>
          <TouchableOpacity
            style={[styles.modalButton, {marginTop: 20}]}
            onPress={onClose}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// const styles = {
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
// };

export default ReminderPickerModal;
