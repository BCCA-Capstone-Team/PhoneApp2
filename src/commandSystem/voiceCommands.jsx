class VoiceControlSystem {
    constructor() {
        this.parseString = ""
        this.commandKeys = []
        this.readyDict = []
    }

    addString(value) {
        if (this.parseString == '') {
            this.parseString = value
        } else {
            this.parseString = `${this.parseString} ${value}`
        }
    }

    breakDown() {
        return new Promise((resolve, reject) => {
            let stringArray = this.parseString.split(" ")
            let currentCommand = ''
            let currentData = ''
            let fullLength = (stringArray.length) - 1
            for (let i = 0; i < stringArray.length; i++) {
                let testString = stringArray[i].toLowerCase()
                if (this.commandKeys.includes(testString)) {
                    if (currentCommand == '') {
                        currentCommand = testString
                    } else {
                        this.saveCommandString(currentCommand, currentData)
                        currentCommand = testString
                        currentData = ''
                    }
                } else {
                    if (currentData == '') {
                        currentData = stringArray[i]
                    } else {
                        currentData = `${currentData} ${stringArray[i]}`
                    }
                }

                if (fullLength == i) {
                    this.saveCommandString(currentCommand, currentData)
                    currentCommand = testString
                    currentData = ''
                }
            }
            resolve()
        })
    }

    saveCommandString(command, value) {
        this.readyDict[command] = value
    }

    returnResults() {
        return this.readyDict
    }
}

module.exports = VoiceControlSystem