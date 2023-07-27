// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  errorText: {
    color: 'red',
  },
});