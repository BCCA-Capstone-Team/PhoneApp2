import React, {useEffect} from 'react';
import {View, Modal, TextInput, Button} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Controller
            control={control}
            render={({field}) => (
              <TextInput
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

          <Button title="Submit" onPress={handleSubmit(handleLocationSubmit)} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default LocationModal;
