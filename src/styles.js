// When styling for the <View /> that contains the <Schedule /> you MUST HAVE a height set for the Schedule to render.
// Styling the Schedule is also somewhat tricky, I will note out all of that sometime.
import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    margin: 20,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    padding: 8,
  },
  button: {
    margin: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  speakButton: {
    backgroundColor: '#0C2340',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
  },
  speakButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  voiceButton: {
    backgroundColor: '#F26522',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
  },
  voiceButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#0C2340',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 3,
  },
  submitText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  speechButtonContainer:{
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  noAppointmentsText:{
  marginTop:40,
  fontWeight:'bold',
  margin: 60,
  fontSize: 30,
  textAlign:'center',
  },
  addText: {
  textAlign:'center',
  fontSize: 30,
  margin: 50,
  fontWeight: 'bold',
  },
  deleteText:{
  textAlign:'center',
  textDecorationStyle:'solid',
  fontWeight: 'bold',
  fontSize: 30,
  margin: 50,
  marginTop:10,
  }
});
