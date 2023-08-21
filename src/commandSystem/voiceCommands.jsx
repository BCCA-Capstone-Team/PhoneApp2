class VoiceControlSystem {
  constructor() {
    this.parseString = '';
    this.commandKeys = [];
    this.readyDict = [];
    this.currentCoolDown = 0;
    this.callbackFunc = null;
    this.coolDownInterval = null;
  };

  addString(value) {
    if (this.parseString == '') {
      this.parseString = value;
    } else {
      this.parseString = `${this.parseString} ${value}`;
    };

    if (this.currentCoolDown == 0) {
      this.currentCoolDown = 200;
      this.awaitTimer();
    } else {
      this.currentCoolDown = 200;
    };
  };

  addFullString(value) {
    this.parseString = value;

    if (this.currentCoolDown == 0) {
      this.currentCoolDown = 200;
      this.awaitTimer();
    } else {
      this.currentCoolDown = 200;
    };
  };

  awaitTimer() {
    this.coolDownInterval = setInterval(async () => {
      if (this.currentCoolDown > 0) {
        this.currentCoolDown = this.currentCoolDown - 1;
      } else {
        clearInterval(this.coolDownInterval);
        await this.breakDown();
        if (this.callbackFunc != null) {
          this.callbackFunc(this.readyDict);
        };
        this.resetValues();
      };
    }, 1);
  };

  resetValues() {
    this.parseString = '';
    this.commandKeys = [];
    this.readyDict = [];
    this.currentCoolDown = 0;
    this.callbackFunc = null;
    this.coolDownInterval = null;
  };

  breakDown() {
    return new Promise((resolve, reject) => {
      let stringArray = this.parseString.split(' ');
      let currentCommand = '';
      let currentData = '';
      let fullLength = stringArray.length - 1;
      for (let i = 0; i < stringArray.length; i++) {
        let testString = stringArray[i].toLowerCase();
        if (this.commandKeys.includes(testString)) {
          if (currentCommand == '') {
            currentCommand = testString;
          } else {
            this.saveCommandString(currentCommand, currentData);
            currentCommand = testString;
            currentData = '';
          };
        } else {
          if (currentData == '') {
            currentData = stringArray[i];
          } else {
            currentData = `${currentData} ${stringArray[i]}`;
          };
        };

        if (fullLength == i) {
          this.saveCommandString(currentCommand, currentData);
          currentCommand = testString;
          currentData = '';
        };
      };
      resolve();
    });
  };

  saveCommandString(command, value) {
    if (!this.readyDict[command]) {
      this.readyDict[command] = [];
    };
    if (value) {
      this.readyDict[command].push(value);
    } else {
      this.readyDict[command].push(true);
    };
  };

  returnResults() {
    return this.readyDict;
  };

  setReturnCallback(callback) {
    this.callbackFunc = callback;
  };
};

module.exports = VoiceControlSystem;
