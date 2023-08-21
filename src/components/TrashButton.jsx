import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import trashCanImage from '../assets/trash-can.png';
import styles from '../styles';

const TrashButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.trashButton}>
      <Image source={trashCanImage} style={styles.trashIcon} />
    </TouchableOpacity>
  );
};

export default TrashButton;
