import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../styles';
import SpeechButton from '../components/SpeechButton';
import Voice from '@react-native-voice/voice';

// Import the ProfileDatabase class and create an instance
let Database = require('../database/ProfileDatabase.jsx');
let database = new Database();

const ProfileDetailScreen = ({navigation, route}) => {
  const {profileData} = route.params;

  // State to manage whether the app is listening for voice commands
  const [isListening, setIsListening] = useState(false);

  // State to store the recognized voice command
  const [voiceCommand, setVoiceCommand] = useState('');

  // Callback function to process voice commands
  const processVoiceCommand = useCallback(async command => {
    // Split the command into words
    const words = command.toLowerCase().split(' ');

    // Parse the words to extract field names and values
    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Check for "edit" command
      if (word === 'edit') {
        // Initialize variables to store field name and value
        let fieldName = '';
        let fieldValue = '';

        // Iterate through the next words to extract field name and value
        while (i + 1 < words.length) {
          i++;
          const nextWord = words[i];

          // Check for known field names (firstName, lastName, street, etc.)
          if (
            nextWord === 'firstname' ||
            nextWord === 'lastname' ||
            nextWord === 'street' ||
            nextWord === 'city' ||
            nextWord === 'state' ||
            nextWord === 'zipcode'
          ) {
            fieldName = nextWord;
          } else {
            // Assume the word is a value
            fieldValue = nextWord;
            break;
          }
        }

        // Check if we found a valid fieldName and fieldValue
        if (fieldName && fieldValue) {
          // Update the profile data using your ProfileDatabase methods
          try {
            await database.onProfileReady();
            await database.table.reload();
            let profileExists = await database.checkForProfile();

            if (profileExists) {
              await database.editProfile(fieldName, fieldValue);

              // Log a success message
              console.log(`Updated ${fieldName} to ${fieldValue}`);
            } else {
              console.error('Profile does not exist.');
            }
          } catch (error) {
            console.error(`Failed to update ${fieldName}: ${error.message}`);
          }
        } else {
          console.error('Invalid voice command format');
        }
      }
    }
  }, []);

  // Toggle listening when the "Speak" button is pressed
  const toggleListening = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };

  // Listen for changes in voiceCommand and process the command
  useEffect(() => {
    if (voiceCommand.trim() !== '') {
      processVoiceCommand(voiceCommand);
      setVoiceCommand(''); // Clear the voiceCommand
    }
  }, [voiceCommand, processVoiceCommand]);

  const handleEditProfile = () => {
    navigation.navigate('Profile Creation', {profileData});
  };

  // Render the profile details screen
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.headerText}>
        {profileData.firstName} {profileData.lastName}
      </Text>
      <Text style={styles.infoText}>{profileData.street}</Text>
      <Text style={styles.infoText}>
        {profileData.city}, {profileData.state} {profileData.zipCode}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      <View style={styles.speechButtonContainer}>
        <SpeechButton isListening={isListening} onPress={toggleListening} />
      </View>
    </View>
  );
};

export default ProfileDetailScreen;
