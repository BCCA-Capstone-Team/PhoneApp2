import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import ProfileForm from '../forms/ProfileForm';
import styles from '../styles';
import Tts from 'react-native-tts';
import TtsButtonComponent from '../components/TtsButtonComponent';
import ProfileDatabase from '../database/ProfileDatabase';

function ProfileScreen({navigation, route}) {
  const {profileData} = route.params;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <ProfileForm
        navigation={navigation}
        route={route}
        profileData={profileData}
      />
      {/*TTS Button */}
      <TtsButtonComponent text="This is the profile screen.  Please enter the following information:first name, last name, street address, city, state, and your zipcode.  " />
    </View>
  );
}

export default ProfileScreen;
