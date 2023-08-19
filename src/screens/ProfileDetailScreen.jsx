import React, {useState} from 'react';
import {View, Text,  TouchableOpacity } from 'react-native';
import styles from '../styles';
import {HeaderBackButton} from '@react-navigation/stack';
import SpeechButton from '../components/SpeechButton';

const ProfileDetailScreen = ({navigation, route}) => {
  const {profileData} = route.params;
  const [isListening, setIsListening] = useState(false);
  //console.log('Profile Data:', profileData);

  if (!profileData) {
    // Handle the case when profileData is not available
    return <Text>No profile data available.</Text>;
  }

  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };

  const handleEditProfile = () => {
    navigation.navigate('Profile Creation', {profileData});
  };

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.headerText}>{profileData.firstName} {profileData.lastName}</Text>
      <Text style={styles.infoText}>{profileData.street}</Text>
      <Text style={styles.infoText}>{profileData.city}, {profileData.state} {profileData.zipCode}</Text>


      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      <View style={styles.speechButtonContainer} >
      <SpeechButton isListening={isListening} onPress={toggleListening} />
      </View>

      
    </View>
  );
};



export default ProfileDetailScreen;
