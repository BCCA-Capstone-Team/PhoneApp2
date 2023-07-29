/* eslint-disable no-undef */
import React, {useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import styles from '../styles';
let Database = require('../database/Database.jsx');
let database = new Database('profileDatabase');

//async function startDatabase() {
//  profileTable = await database.createTable('profile', column => {
//    column.autoClear();

//    column.create('firstName', 'TEXT');
//    column.create('lastName', 'TEXT');
//    column.create('street', 'TEXT');
//    column.create('city', 'TEXT');
//    column.create('state', 'TEXT');
//    column.create('zipCode', 'INT');

//    column.run();
//  });
//}
//startDatabase();

//async function testDatabase() {
//    let pDatabase = require('../database/ProfileDatabase.jsx');
//    let profileDatabase = new pDatabase()
//    let additionState = await profileDatabase.addProfile('Joseph', 'Last', 'Street', 'City', 'State', 38901)
//    console.log(`Add Profile State ${additionState}`)
//    let profileCreated = await profileDatabase.checkForProfile()
//    console.log(`Profile Created ${profileCreated}`)
//    profileDatabase.table.show()
//    let editStatus = await profileDatabase.editProfile('firstName', ' ')
//    console.log(`Update status ${editStatus} `)
//    profileDatabase.table.show()
//}; testDatabase()

const ProfileForm = ({navigation, route}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm();

  // Check if there's pre-existing profile data
  const {profileData} = route.params;
  console.log('Profile Data:', profileData);

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

  const onSubmit = async data => {
    //console logs for confirmation
    console.log('Address Data:', data);
    console.log('Run Values');
    console.log(data.firstName);
    console.log(data.zipCode);

    //await profileTable.add(
    //  data.firstName,
    //  data.lastName,
    //  data.street,
    //  data.city,
    //  data.state,
    //  data.zipCode,
    //);

    //profileTable.view();

    await navigation.navigate('ProfileDetailScreen', {profileData: data});
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
