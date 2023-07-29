// When styling for the <View /> that contains the <Schedule /> you MUST HAVE a height set for the Schedule to render.
// Styling the Schedule is also somewhat tricky, I will note out all of that sometime.
import {StyleSheet} from 'react-native';

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
    fontSize: 16,
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
  speakButton:{
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    },
   speakButtonText: {
   color: 'black',
   fontWeight: 'bold',
   fontSize: 16,
   },
});
