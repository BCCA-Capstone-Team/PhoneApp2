import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import ProfileForm from '../forms/ProfileForm';
import styles from '../styles';
import Tts from 'react-native-tts';

function ProfileScreen({navigation, route}) {
  const {profileData} = route.params;
  function handleSpeakButtonPress() {
    const messageToSpeak =
      'In this screen.  Please enter your information in the designated boxes; first name, last name, street address, city, state, and your zipcode.  When finished please click the submit button.';
    Tts.speak(messageToSpeak);
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <ProfileForm
        navigation={navigation}
        route={route}
        profileData={profileData}
      />

      {/*Speak Button */}
      <TouchableOpacity
        style={styles.speakButton}
        onPress={handleSpeakButtonPress}>
        <Text style={styles.speakButtonText}>Speak</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileScreen;
