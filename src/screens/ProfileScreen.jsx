import React, {useState} from 'react';
import {Text, View} from 'react-native';
import ProfileForm from '../forms/ProfileForm';
import styles from '../styles';
import TtsButtonComponent from '../components/TtsButtonComponent';

function ProfileScreen({navigation, route, onSubmit}) {
  const {profileData} = route.params;

  // State to hold the form data
  const [formData, setFormData] = useState({
    firstName: profileData.firstName || '',
    lastName: profileData.lastName || '',
    street: profileData.street || '',
    city: profileData.city || '',
    state: profileData.state || '',
    zipCode: profileData.zipCode || '',
  });

  // Function to handle the form submission
  const handleSubmit = data => {
    // Update the form data state with the submitted data
    setFormData(data);

    // Navigate to the next screen or perform any other actions with the data if needed
    navigation.navigate('ProfileDetailScreen', {profileData: data});
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <ProfileForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
      {/* TTS Button */}
      <TtsButtonComponent text="This is the profile screen.  Please enter the following information:first name, last name, street address, city, state, and your zipcode.  " />
    </View>
  );
}

export default ProfileScreen;
