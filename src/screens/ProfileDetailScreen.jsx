import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HeaderBackButton} from '@react-navigation/stack';

const ProfileDetailScreen = ({navigation, route}) => {
  const {profileData} = route.params;
  //console.log('Profile Data:', profileData);

  if (!profileData) {
    // Handle the case when profileData is not available
    return <Text>No profile data available.</Text>;
  }

  const handleEditProfile = () => {
    navigation.navigate('ProfileScreen', {profileData});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>First Name: {profileData.firstName}</Text>
      <Text style={styles.text}>Last Name: {profileData.lastName}</Text>
      <Text style={styles.text}>Street: {profileData.street}</Text>
      <Text style={styles.text}>City: {profileData.city}</Text>
      <Text style={styles.text}>State: {profileData.state}</Text>
      <Text style={styles.text}>Zip Code: {profileData.zipCode}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProfileDetailScreen;
