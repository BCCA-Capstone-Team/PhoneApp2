import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import styles from '../styles';

const AddButtonModal = ({ children, onSubmit}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const onSubmitForm = async (data) => {
    await onSubmit(data);
    handleCloseModal();
  }

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Render the children inside the modal */}
            {React.cloneElement(children, {onSubmitForm})}

            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default AddButtonModal;
