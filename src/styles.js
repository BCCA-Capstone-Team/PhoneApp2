// When styling for the <View /> that contains the <Schedule /> you MUST HAVE a height set for the Schedule to render.
// Styling the Schedule is also somewhat tricky, I will note out all of that sometime.
import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
let blueColor = '#0C2340';
let orangeColor = '#F26522';

export default StyleSheet.create({
  // Home Page Styling
  homeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 0,

  },
  childHomeContainer: {
    marginTop: -50,
  },
  container: {
    margin: 20,
  },
  welcomeText: {
    position: 'absolute',
    top: 15,
    left: 15,
    fontSize: 30,
    fontWeight: 'bold',
  },
  // Button Styling
  navButton: {
    backgroundColor: orangeColor,
    width: width * 0.7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
    marginVertical: 25,
  },
  navButtonText: {
    color: blueColor,
    fontSize: 30,
    fontWeight: 'bold',
  },
  // Listening Button Styling
  speakButton: {
    backgroundColor: blueColor,
    width: 100,            
    height: 100,          
    borderRadius: 50,      
    justifyContent: 'center', 
    alignItems: 'center',     
    margin: 5,
  },
  listenButtonImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden'
  },
  speechButtonContainer:{
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  // Other
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20,
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
