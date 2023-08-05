import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Text, View} from 'react-native';
import ProfileForm from '../forms/ProfileForm';
import styles from '../styles';
import Tts from 'react-native-tts';
import TtsButtonComponent from '../components/TtsButtonComponent';
import ProfileDatabase from '../database/ProfileDatabase';
import SuccessModal from '../components/SuccessModal';

function ProfileScreen({navigation, route}) {
  //Phillip trying something
  const {profileData: initialProfileData} = route.params;
  const [profileCreated, setProfileCreated] = useState(false);

  // Function to handle successful profile creation
  const handleProfileCreated = () => {
    setProfileCreated(true);
  };

  // Inside ProfileScreen.jsx or TestScreen.jsx
  const handleCloseModal = () => {
    setProfileCreated(false); // Assuming you are using the state 'profileCreated' to control the modal visibility
  };
  // Function to handle modal close (OK button)
  const closeModal = () => {
    setProfileCreated(false);
    console.log('test1');
  };
  const [profileData, setProfileData] = useState(initialProfileData);

  useEffect(() => {
    const fetchProfileData = async () => {
      const profileDatabase = new ProfileDatabase();
      try {
        const profileExists = await profileDatabase.checkForProfile();
        if (profileExists) {
          const data = await profileDatabase.getProfile();
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: profileData
        ? undefined // Show the back button(default behavior)
        : () => null, // Hide the back button
    });
  }, [navigation, profileData]);
  //end of try

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <ProfileForm
        navigation={navigation}
        route={route}
        profileData={profileData}
        onProfileCreated={handleProfileCreated}
      />
      {/*TTS Button */}
      <TtsButtonComponent text="This is the profile screen.  Please enter the following information:first name, last name, street address, city, state, and your zipcode.  " />
      {/* Success Modal */}
      <SuccessModal
        visible={profileCreated}
        message={
          profileData
            ? 'Profile edited successfully!'
            : 'Profile created successfully!'
        }
        onClose={handleCloseModal}
      />
    </View>
  );
}

export default ProfileScreen;
