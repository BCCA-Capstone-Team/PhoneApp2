import React, {useEffect} from 'react';
import {View, Modal, Text, TextInput, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import styles from '../styles';

const LocationModal = ({visible, onClose, onSubmit, locationData}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm();

  const handleLocationSubmit = data => {
    onSubmit(data);
  };

  if (locationData != null) {
    useEffect(() => {
      setValue('address', locationData.address);
      setValue('city', locationData.city);
      setValue('state', locationData.state);
      setValue('zipCode', locationData.zipCode);
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Controller
            control={control}
            render={({field}) => (
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
            name="address"
            rules={{required: 'Address is required.'}}
            defaultValue=""
          />
          {errors.address && (
            <Text style={{color: 'red'}}>{errors.address.message}</Text>
          )}

          <Controller
            control={control}
            render={({field}) => (
              <TextInput
                placeholder="City"
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
            name="city"
            rules={{required: 'City is required.'}}
            defaultValue=""
          />
          {errors.city && (
            <Text style={{color: 'red'}}>{errors.city.message}</Text>
          )}

          <Controller
            control={control}
            render={({field}) => (
              <TextInput
                placeholder="State"
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
            name="state"
            rules={{required: 'State is required.'}}
            defaultValue=""
          />
          {errors.state && (
            <Text style={{color: 'red'}}>{errors.state.message}</Text>
          )}

          <Controller
            control={control}
            render={({field}) => (
              <TextInput
                placeholder="Zip Code"
                value={field.value}
                style={styles.input}
                onChangeText={field.onChange}
                keyboardType="numeric"
              />
            )}
            name="zipCode"
            rules={{required: 'Zip Code is required.'}}
            defaultValue=""
          />
          {errors.zipCode && (
            <Text style={{color: 'red'}}>{errors.zipCode.message}</Text>
          )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LocationModal;
