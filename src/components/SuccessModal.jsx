import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import styles from '../styles';

const SuccessModal = ({visible, message, onClose}) => {
  console.log(visible, message, onClose);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
