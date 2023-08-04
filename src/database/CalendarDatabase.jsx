const {StrictMode} = require('react');
let Database = require('../database/Database.jsx');

class CalendarDatabase extends Database {
  constructor() {
    super('appointmentDatabase');
    this.appDatabaseReady = false;
    this.createCalendar();
  }

  async createCalendar() {
    this.appTable = await this.createTable('appointment', column => {
      // Auto Clear is forcing a recreation of the table every time.
      //column.autoClear();

      column.create('eventTitle', 'TEXT');
      column.create('location', 'TEXT');
      column.create('remindBeforeTime', 'INT');
      column.create('date', 'TEXT');
      column.create('time', 'TEXT');

      column.run();
    });

    this.appReminderTable = await this.createTable(
      'appointmentReminders',
      column => {
        // Auto Clear is forcing a recreation of the table every time.
        //column.autoClear();

        column.create('appointmentId', 'INT');
        column.create('reminder', 'TEXT');

        column.run();
      },
    );

    this.appDatabaseReady = true;
  }

  onAppReady() {
    return new Promise((resolve, reject) => {
      let appInterval = setInterval(() => {
        if (this.appDatabaseReady == true) {
          clearInterval(appInterval);
          resolve();
        }
      }, 1);
    });
  }

  async getAll() {
    await this.onAppReady();
    return new Promise(async (resolve, reject) => {
      await this.appTable.reload();
      await this.appReminderTable.reload();

      let createdTable = {};

      this.appTable.data.forEach(element => {
        let reminderArray = [];
        // console.log(element[0]);

        this.appReminderTable.data.forEach(reminder => {
          if (reminder[1][1] == element[0][1]) {
            reminderArray.push(reminder[2][1]);
          }
        });

        let newDate = new Date(element[4][1]);
        let dateParse = `${newDate.getFullYear()}-${
          newDate.getMonth() + 1
        }-${newDate.getDate()}`;

        if (!createdTable[dateParse]) {
          createdTable[dateParse] = [];
        }

        try {
          createdTable[dateParse].push({
            id: element[0][1],
            eventTitle: element[1][1],
            location: JSON.parse(element[2][1]),
            remindBeforeTime: element[3][1],
            date: dateParse,
            time: element[5][1],
            reminder: reminderArray,
          });
        } catch {
          console.error('Unable to parse data');
        }
      });

      resolve(createdTable);
    });
  }

  // TESTING HOW TO CHECK FOR ROW //
  async checkForAppointment(appointmentId) {
    await this.onAppReady();
    return new Promise(async (resolve, reject) => {
      await this.appTable.reload();
      await this.appReminderTable.reload();
      // console.log(this.appTable.data[0][0]);

      for (let i = 0; i < this.appTable.data.length; i++) {
        // console.log(i);
        if (this.appTable.data[i][0][1] == appointmentId) {
          resolve(true);
        } else if (i == this.appTable.length - 1) {
          resolve(false);
        }
      }
    });
  }
  // TESTING HOW TO CHECK FOR ROW //

  async edit(changeDate, key, value) {
    let giveDate = new Date(changeDate);
    let givenDate = `${giveDate.getFullYear()}-${giveDate.getMonth()}-${giveDate.getDate()}`;

    await this.onAppReady();
    return new Promise(async (resolve, reject) => {
      await this.appTable.reload();

      let allKeys = [];
      let tempItem = this.appTable.data[0];
      let editReady = false;
      if (tempItem) {
        editReady = true;
        for (let i = 0; i < tempItem.length; i++) {
          allKeys.push(tempItem[i][0]);
        }
      }

      if (allKeys.includes(key) && editReady == true) {
        for (let i = 0; i < this.appTable.data.length; i++) {
          let selectedItem = this.appTable.data[i];
          let newDate = new Date(selectedItem[4][1]);
          let dateParse = `${newDate.getFullYear()}-${
            newDate.getMonth() + 1
          }-${newDate.getDate()}`;

          if (givenDate == dateParse) {
            await this.appTable.update(selectedItem[0][1], key, value);
          }
        }
      }

      resolve();
    });
  }

  async remove(changeDate) {
    await this.onAppReady();
    return new Promise(async (resolve, reject) => {
      await this.appTable.reload();

      let giveDate = new Date(changeDate);
      let givenDate = `${giveDate.getFullYear()}-${giveDate.getMonth()}-${giveDate.getDate()}`;

      for (let i = 0; i < this.appTable.data.length; i++) {
        let selectedItem = this.appTable.data[i];
        let newDate = new Date(selectedItem[4][1]);
        let dateParse = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;

        if (givenDate == dateParse) {
          await this.appTable.removeIndex(selectedItem[0][1]);
        }
      }

      resolve();
    });
  }
}

module.exports = CalendarDatabase;
