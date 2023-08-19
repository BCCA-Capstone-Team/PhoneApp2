// import Voice from '@react-native-voice/voice';
// let VoiceControlSystem = require('../commandSystem/voiceCommands.jsx');

// class DialogCommands extends VoiceControlSystem {
//   constructor() {
//     super();

//     //==========| VOICE EMITTERS |==========\\
//     Voice.onSpeechResults = this.onSpeechResults.bind(this);

//     //==========| EMITTERS |==========\\
//     this.onCommands = [];
//     this.readyCommands = [];
//     this.stashedStartingCommands = [];
//     this.secondCommands = false;
//     this.enableListening = true;
//     this.awaitingFinish = false;
//     this.timeDelay = 500;
//     this.currentVoiceResults = '';
//     this.returnCommandName = '';
//   }

//   /**
//    * Start Voice Listening
//    */
//   async startVoice() {
//     try {
//       await Voice.start('en-US');
//       console.log('Listening');
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   /**
//    * End Voice Listening
//    */
//   async endVoice() {
//     try {
//       await Voice.stop();
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   reloadVoice() {
//     this.endVoice();
//     this.currentVoiceResults = '';
//     setTimeout(() => {
//       this.startVoice();
//     }, 200);
//   }

//   awaitFullAnswer(callback) {
//     this.awaitingFinish = true;
//     let countDownInterval = setInterval(() => {
//       console.log(this.timeDelay);
//       if (this.timeDelay > 0) {
//         this.timeDelay = this.timeDelay - 1;
//       } else {
//         this.awaitingFinish = false;
//         this.timeDelay = 200;
//         clearInterval(countDownInterval);
//         callback();
//       }
//     }, 1);
//   }

//   /**
//    * Results of talking
//    * @param {object} results
//    */
//   onSpeechResults(results) {
//     if (results.value && this.enableListening == true) {
//       this.currentVoiceResults = results.value[0];
//       if (this.secondCommands == false) {
//         this.searchForCommand();
//       } else {
//         this.timeDelay = 200;
//         if (this.awaitingFinish == false) {
//           this.awaitFullAnswer(() => {
//             this.parseForCommand();
//           });
//         }
//       }
//       if (results.value[0].length > 50) {
//         this.reloadVoice();
//       }
//     }
//   }

//   readPromptText(text) {
//     console.log(text);
//   }

//   searchForCommand() {
//     let stringArray = this.currentVoiceResults.split(' ');
//     for (let i = 0; i < stringArray.length; i++) {
//       let testString = stringArray[i].toLowerCase();
//       if (this.readyCommands.includes(testString)) {
//         this.enableListening = false;
//         this.foundCommand(testString);
//         this.reloadVoice();
//         this.secondCommands = true;
//         return;
//       }
//     }
//   }

//   parseForCommand() {
//     let stringArray = this.currentVoiceResults.split(' ');
//     let currentCommand = '';
//     let currentData = '';
//     let fullLength = stringArray.length - 1;
//     for (let i = 0; i < stringArray.length; i++) {
//       let testString = stringArray[i].toLowerCase();
//       if (this.readyCommands.includes(testString)) {
//         if (currentCommand == '') {
//           currentCommand = testString;
//         } else {
//           this.runCommand(currentCommand, currentData);
//           currentCommand = testString;
//           currentData = '';
//         }
//       } else {
//         if (currentData == '') {
//           currentData = stringArray[i];
//         } else {
//           currentData = `${currentData} ${stringArray[i]}`;
//         }
//       }

//       if (fullLength == i) {
//         this.runCommand(currentCommand, currentData);
//         currentCommand = testString;
//         currentData = '';
//       }
//     }
//   }

//   registerCommand(commandName, commandPrompt, commands, callback) {
//     this.startVoice();
//     this.stashedStartingCommands.push(commandName);
//     this.readyCommands.push(commandName);
//     this.onCommands[commandName] = {
//       commands: commands,
//       prompt: commandPrompt,
//       callback: callback,
//     };
//   }

//   foundCommand(commandName) {
//     console.log(this.onCommands[commandName].prompt);
//     this.returnCommandName = commandName;
//     this.readyCommands = this.onCommands[commandName].commands;
//     this.enableListening = true;
//   }

//   runCommand(commandName, commandData) {
//     let sendData = [];
//     sendData[commandName] = commandData;
//     this.onCommands[this.returnCommandName].callback(sendData);
//     this.endVoice();
//   }

//   fullReset() {
//     this.secondCommands = false;
//     this.currentVoiceResults = '';
//     this.returnCommandName = '';
//     this.readyCommands = this.stashedStartingCommands;
//     this.reloadVoice();
//   }
// }

// module.exports = DialogCommands;
