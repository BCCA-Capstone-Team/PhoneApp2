import React, {useEffect, useState} from 'react';

import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import styles from '../styles';

let Database = require('../database/ProfileDatabase.jsx');
let database = new Database();

let LocationServices = require('../location/LocationSys.jsx');
let locationServices = new LocationServices();

const ProfileForm = ({navigation, route, updateProfileData}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm();

  // Check if there's pre-existing profile data
  const {profileData} = route.params;
  //console.log('Profile Data:', profileData);

  useEffect(() => {
    if (profileData) {
      // Populate the form fields with the pre-existing data
      setValue('firstName', profileData.firstName || '');
      setValue('lastName', profileData.lastName || '');
      setValue('street', profileData.street || '');
      setValue('city', profileData.city || '');
      setValue('state', profileData.state || '');
      setValue(
        'zipCode',
        profileData.zipCode ? profileData.zipCode.toString() : '',
      );
    }
  }, [profileData, setValue]);

  const fadeAnim = new Animated.Value(1);

  const onSubmit = async data => {
    // const profileDatabase = new ProfileDatabase();
    try {
      await database.onProfileReady();
      await database.table.reload();
      let profileExists = await database.checkForProfile();

      // geocoding inserted address for latitude and longitude:
      let homeAddress = `${data.street} ${data.city} ${data.state} ${data.zipCode}`;
      console.log(homeAddress);
      let homeLocation = await locationServices.getCoordsByAddress(homeAddress);
      console.log(homeLocation);
      let latitude = homeLocation.lat;
      let longitude = homeLocation.lon;
      console.log(latitude, longitude);

      if (profileExists) {
        database.editProfile('firstName', data.firstName);
        database.editProfile('lastName', data.lastName);
        database.editProfile('street', data.street);
        database.editProfile('city', data.city);
        database.editProfile('state', data.state);
        database.editProfile('zipCode', data.zipCode);
        database.editProfile('lat', 0o0);
        database.editProfile('long', 0o0);
      } else {
        await database.addProfile(
          data.firstName,
          data.lastName,
          data.street,
          data.city,
          data.state,
          parseInt(data.zipCode, 10), // Convert zipCode to an integer (since it was stored as INT in the database)
          latitude,
          longitude,
        );
        // onProfileCreated();
      }

      const message = profileExists
        ? 'Profile successfully updated!'
        : 'New profile successfully created!';

      //fix attempt

      await updateProfileData();

      await navigation.navigate('Home', {
        profileData: data,
        message: message,
        fadeAnim: fadeAnim,
      });
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="firstName"
        rules={{required: 'First name is required'}}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="lastName"
        rules={{required: 'Last name is required'}}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="street"
        rules={{required: 'Street is required'}}
        defaultValue=""
      />
      {errors.street && (
        <Text style={styles.error}>{errors.street.message}</Text>
      )}

      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="City"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="city"
        rules={{required: 'City is required'}}
        defaultValue=""
      />
      {errors.city && <Text style={styles.error}>{errors.city.message}</Text>}

      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="State"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="state"
        rules={{required: 'State is required'}}
        defaultValue=""
      />
      {errors.state && <Text style={styles.error}>{errors.state.message}</Text>}

      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            value={value}
            onChangeText={text => onChange(text)}
          />
        )}
        name="zipCode"
        rules={{required: 'Zip Code is required'}}
        defaultValue=""
      />
      {errors.zipCode && (
        <Text style={styles.error}>{errors.zipCode.message}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileForm;
