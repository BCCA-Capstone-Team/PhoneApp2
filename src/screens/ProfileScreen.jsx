import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import ProfileForm from '../forms/ProfileForm';
import styles from '../styles';

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
    </View>
  );
}

export default ProfileScreen;
