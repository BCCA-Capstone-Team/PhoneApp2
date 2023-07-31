import React, {useEffect} from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import styles from '../styles';
import PropTypes from 'prop-types';

const ProfileForm = ({navigation, route, formData, setFormData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: formData, // Set default form values based on formData prop
  });

  useEffect(() => {
    // When formData changes, update the form fields
    setValue('firstName', formData.firstName || '');
    setValue('lastName', formData.lastName || '');
    setValue('street', formData.street || '');
    setValue('city', formData.city || '');
    setValue('state', formData.state || '');
    setValue('zipCode', formData.zipCode ? formData.zipCode.toString() : '');
  }, [formData, setValue]);

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
      {/* Other form fields... */}
      {/* ... */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

ProfileForm.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  formData: PropTypes.object, // New prop for passing form data
  setFormData: PropTypes.func, // New prop for setting form data
  onSubmit: PropTypes.func.isRequired, // New prop for handling form submission
};

export default ProfileForm;
