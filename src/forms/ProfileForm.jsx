import React from 'react';
import {Text, View, TextInput, Button, StyleSheet,TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
let Database = require('../database/Database.jsx');
let database = new Database('profileDatabase');

async function startDatabase() {
  profileTable = await database.createTable('profile', column => {
    column.autoClear();

    column.create('firstName', 'TEXT');
    column.create('lastName', 'TEXT');
    column.create('street', 'TEXT');
    column.create('city', 'TEXT');
    column.create('state', 'TEXT');
    column.create('zipCode', 'INT');

    column.run();
  });
}
startDatabase();

const ProfileForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = async data => {
    //console.log('Address Data:', data);
    //console.log('Run Values')
    //console.log(data.firstName)
    //console.log(data.zipCode)

    await profileTable.add(
      data.firstName,
      data.lastName,
      data.street,
      data.city,
      data.state,
      data.zipCode,
    );

    profileTable.view();
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

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
  },
});

export default ProfileForm;