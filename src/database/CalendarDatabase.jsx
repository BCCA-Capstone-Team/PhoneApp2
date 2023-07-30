const { StrictMode } = require('react');
let Database = require('../database/Database.jsx');


class CalendarDatabase extends Database {
    constructor() {
        super('appointmentDatabase')
        this.appDatabaseReady = false
        this.createCalendar()
    }

    async createCalendar() {
        this.appTable = await this.createTable('appointment', (column) => {
            // Auto Clear is forcing a recreation of the table every time.
            // column.autoClear();

            column.create('eventTitle', 'TEXT');
            column.create('location', 'TEXT');
            column.create('remindBeforeTime', 'INT');
            column.create('date', 'TEXT');
            column.create('time', 'TEXT');

            column.run();
        });

        this.appReminderTable = await this.createTable('appointmentReminders', (column) => {
            // Auto Clear is forcing a recreation of the table every time.
            column.autoClear();

            column.create('appointmentId', 'INT');
            column.create('reminder', 'TEXT');

            column.run();
        })

        console.log('Set Ready')
        this.appDatabaseReady = true
    }

    onAppReady() {
        return new Promise((resolve, reject) => {
            let appInterval = setInterval(() => {
                console.log('Test')
                if (this.appDatabaseReady == true)
                    clearInterval(appInterval)
                    resolve()
            }, 1)
        })
    }

    async getAll() {
        await this.onAppReady()
        console.log('Call')
        console.log(this.appTable)
    }

}   

module.exports = CalendarDatabase