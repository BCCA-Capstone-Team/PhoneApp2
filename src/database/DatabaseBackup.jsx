/* eslint-disable no-undef */
import SQLite from 'react-native-sqlite-storage';
let debugMode = false;

class Database {
    constructor(fileName) {
        if (!fileName) { return console.error('No filename defined') }
        this.databaseReady = false;
        this.debugMode = debugMode;
        this.tasks = [];

        this.database = SQLite.openDatabase({ name: `${fileName}.db`, createFromLocation: 3 }, () => {
            this.databaseReady = true;
        }, (err) => {
            console.log('SQL Error: ' + err);
        })
    }

    onReady() {
        return new Promise((resolve, reject) => {
            let onReadyInterval = setInterval(() => {
                if (this.databaseReady == true) {
                    clearInterval(onReadyInterval);
                    resolve();
                }
            }, 1);
        });
    }

    //==========| TOOLS |==========\\
    async checkForTable(tableName) {
        await this.onReady();
        return new Promise((resolve, reject) => {
            this.database.transaction((tx) => {
                tx.executeSql(`SELECT * FROM ${tableName}`, [], (tx, results) => { });
            }, (error) => {
                if (this.debugMode) {
                    console.log('Table does not exits');
                    console.error(error)
                }
                resolve(false);
            }, () => {
                if (this.debugMode) { console.log('Table exits') }
                resolve(true);
            });
        });
    }

    async checkForColumn(tableName, columnName) {
        await this.onReady();
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT ${columnName} FROM ${tableName}`, [], (tx, results) => { });
            }, (error) => {
                if (this.debugMode) { console.log('Column does not exits') }
                resolve(false);
            }, () => {
                if (this.debugMode) { console.log('Column exits') }
                resolve(true);
            });
        });
    }

    async buildTable(tableName) {
        await this.onReady();
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`CREATE TABLE ${tableName} (ID INTEGER PRIMARY KEY AUTOINCREMENT)`);
            }, (error) => {
                if (this.debugMode) { console.log('Unable to create table') }
                reject();
            }, () => {
                if (this.debugMode) { console.log(`Created Table ${tableName}`) }
                resolve();
            });
        });
    }

    async deleteTable(tableName) {
        await this.onReady();
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`DROP TABLE ${tableName}`);
            }, (error) => {
                if (this.debugMode) { console.log('Unable to delete table') }
                reject();
            }, () => {
                if (this.debugMode) { console.log('Table deleted') }
                resolve();
            });
        });
    }

    //==========| FUNCTIONS |==========\\

    async createTable(tableName, callback) {
        await this.onReady();
        return new Promise(async (resolve, reject) => {
            let tableExists = await this.checkForTable(tableName);
            if (tableExists == false) { await this.buildTable(tableName) }
            let tableCreator = new DatabaseController(this.database, tableName);
            tableCreator.finish(data => {
                let controller = new DataController(
                    this.database,
                    tableName,
                    data[0],
                    data[1],
                );
                resolve(controller);
            });
            callback(tableCreator);
        });
    }

    close() {
        this.database.close(() => {
            console.log('Database shutdown');
        }, (error) => {
            console.log('Error shutting down:' + error.message);
        });
    }
}

class DatabaseController {
    constructor(database, tableName) {
        this.database = database;
        this.tableName = tableName;
        this.taskQueue = [];
        this.columnList = [];
        this.finishFunction = null;
        this.debugMode = debugMode;
    }

    //==========| TOOLS |==========\\

    async checkForTable(tableName) {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${tableName}`, [], (tx, results) => { });
            }, (error) => {
                if (this.debugMode) { console.log('Table does not exits') }
                resolve(false);
            }, () => {
                if (this.debugMode) { console.log('Table exits') }
                resolve(true);
            });
        });
    }

    async checkForColumn(tableName, columnName) {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT ${columnName} FROM ${tableName}`, [], (tx, results) => { });
            }, (error) => {
                if (this.debugMode) { console.log('Column does not exist') }
                resolve(false);
            }, () => {
                if (this.debugMode) { console.log('Column exits') }
                resolve(true);
            });
        });
    }

    async buildTable(tableName) {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`CREATE TABLE ${tableName} (ID INTEGER PRIMARY KEY AUTOINCREMENT)`);
            }, (error) => {
                if (this.debugMode) { console.log('Unable to create table') }
                reject();
            }, () => {
                if (this.debugMode) { console.log(`Created Table ${tableName}`) }
                resolve();
            });
        });
    }

    async deleteTable(tableName) {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`DROP TABLE ${tableName}`);
            }, (error) => {
                if (this.debugMode) { console.log('Unable to delete table') }
                reject();
            }, () => {
                if (this.debugMode) { console.log('Table deleted') }
                resolve();
            });
        });
    }

    //==========| FUNCTIONS |==========\\

    create(id, type) {
        this.taskQueue.push(() => {
            return new Promise(async (resolve, reject) => {
                this.columnList.push(id);
                let columnExits = await this.checkForColumn(this.tableName, id);
                if (columnExits == false) {
                    this.database.transaction(tx => {
                        tx.executeSql(`ALTER TABLE ${this.tableName} ADD ${id} ${type}; `, [], (tx, results) => { });
                    }, (error) => {
                        resolve(false);
                    }, () => {
                        resolve(true);
                    });
                } else {
                    resolve(true);
                }
            });
        });
    }

    autoClear() {
        this.taskQueue.push(() => {
            return new Promise(async (resolve, reject) => {
                let tableExists = await this.checkForTable(this.tableName);
                if (tableExists == true) {
                    await this.deleteTable(this.tableName);
                }
                await this.buildTable(this.tableName);
                resolve();
            });
        });
    }

    async run() {
        //===| RUN ALL TASKS |===\\
        for (let i = 0; i < this.taskQueue.length; i++) {
            await this.taskQueue[i]();
        }

        //===| COMPLETE TASKS |===\\
        if (this.finishFunction != null) {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${this.tableName}`, [], (tx, results) => {
                    this.finishFunction([results, this.columnList]);
                });
            }, (error) => {
                if (this.debugMode) { console.log('Unable to select database') }
                resolve(false);
            }, () => { });
        }
    }

    finish(callback) {
        this.finishFunction = callback;
    }
}

class DataController {
    constructor(database, tableName, currentData, columnList) {
        this.database = database;
        this.tableName = tableName;
        this.currentData = currentData;
        this.columnList = columnList;
        this.debugMode = debugMode;
        this.data = [];
    }

    show() {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${this.tableName}`, [], (tx, results) => {
                    let fullTable = [];

                    for (let i = 0; i < results.rows.length; i++) {
                        let currentRow = [];
                        let rowData = results.rows.item(i)['ID'];
                        currentRow.push(['ID', rowData]);

                        for (let i2 = 0; i2 < this.columnList.length; i2++) {
                            let rowLable = this.columnList[i2];
                            let rowData = results.rows.item(i)[this.columnList[i2]];
                            currentRow.push([rowLable, rowData]);
                        }
                        console.log(currentRow);
                    }
                    this.data = fullTable;
                    resolve();
                });
            }, (error) => {
                console.error(error);
            }, () => { });
        });
    }

    view() {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${this.tableName}`, [], (tx, results) => {
                    let fullTable = [];

                    for (let i = 0; i < results.rows.length; i++) {
                        let currentRow = [];
                        let rowData = results.rows.item(i).ID;
                        currentRow.push(['ID', rowData]);

                        for (let i2 = 0; i2 < this.columnList.length; i2++) {
                            let rowLabel = this.columnList[i2];
                            let rowData = results.rows.item(i)[this.columnList[i2]];
                            currentRow.push([rowLabel, rowData]);
                        }

                        fullTable.push(currentRow);
                    }

                    this.data = fullTable;
                    resolve(this.data);
                });
            }, (error) => {
                console.error(error);
                reject(error);
            }, () => { })
        });
    }

    reload() {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${this.tableName}`, [], (tx, results) => {
                    let fullTable = [];

                    for (let i = 0; i < results.rows.length; i++) {
                        let currentRow = [];
                        let rowData = results.rows.item(i).ID;
                        currentRow.push(['ID', rowData]);

                        for (let i2 = 0; i2 < this.columnList.length; i2++) {
                            let rowLable = this.columnList[i2];
                            let rowData = results.rows.item(i)[this.columnList[i2]];
                            currentRow.push([rowLable, rowData]);
                        }

                        fullTable.push(currentRow);
                    }

                    this.data = fullTable;
                    resolve();
                },
                );
            }, (error) => {
                console.error(error);
            }, () => { });
        });
    }

    add(...args) {
        return new Promise((resolve, reject) => {
            let argsValue = 0
            let columnString = ''

            for (const index in this.columnList) {
                if (columnString != '') {
                    columnString = `${columnString}, '${this.columnList[index]}'`;
                } else {
                    columnString = `'${this.columnList[index]}'`;
                }

                if (index != 'ID') {
                    argsValue += 1;
                }
            }

            if (argsValue != arguments.length) {
                return console.error(`Unable to add. There are not enough parameters | Parameters given: ${args}`)
            }

            let insertValues = '';
            for (const index in args) {
                if (insertValues != '') {
                    insertValues = `${insertValues}, '${args[index]}'`;
                } else {
                    insertValues = `'${args[index]}'`;
                }
            }

            let insertString = `INSERT INTO ${this.tableName} (${columnString}) VALUES (${insertValues})`;

            this.database.transaction(tx => {
                tx.executeSql(insertString, [], (tx, results) => {
                    if (this.debugMode) {
                        console.log(`INETER RESULTS | insertId: ${results.insertId} | 'rowsAffected: ${results.rowsAffected}`)
                    }
                    resolve();
                });
            },
                error => {
                    console.error(error);
                }, () => { });
        });
    }

    update(rowId, columnName, newValue) {
        return new Promise((resolve, reject) => {
            let foundColumn = false;

            for (const index in this.columnList) {
                if (this.columnList[index] == columnName) {
                    foundColumn = true;
                }
            }

            if (!rowId && rowId != 0) {
                return console.error('No row id value specified');
            }
            if (foundColumn == false) {
                return console.error(`No Column Found with name ${columnName}`);
            }
            if (!newValue) {
                return console.error('No new value specified');
            }

            let updateString = `UPDATE ${this.tableName} SET ${columnName} = '${newValue}' WHERE ID = ${rowId}`;

            this.database.transaction(tx => {
                tx.executeSql(updateString, [], (tx, res) => {
                    if (this.debugMode) {
                        console.log(`UPDATE RESULTS | updateId: ${rowId} | rowsAffected: ${res.rowsAffected}`)
                    }
                    resolve();
                }, (tx, error) => {
                    console.log(`UPDATE error: ${error.message}`);
                    reject();
                });
            });
        });
    }

    removeIndex(indexNumber) {
        return new Promise((resolve, reject) => {
            if (!indexNumber) {
                return console.error('Please give a index number to remove');
            }

            let deletionString = `DELETE FROM ${this.tableName} WHERE ID = ${indexNumber}`;

            this.database.transaction(tx => {
                tx.executeSql(deletionString, [], (tx, res) => {
                    if (this.debugMode) {
                        console.log(`DELETION RESULTS | deletionId: ${indexNumber} | rowsAffected: ${res.rowsAffected}`)
                    }
                    resolve();
                }, (tx, error) => {
                    console.log('UPDATE error: ' + error.message);
                    reject();
                });
            });
        });
    }

    // DATABASE FEATURES FOR APPOINTMENTS =================

    // getting the most recent appointment created id to add the reminders for the appointment to it's own table.
    async getNewestAppointmentId() {
        return new Promise((resolve, reject) => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT ID FROM ${this.tableName} ORDER BY ID DESC LIMIT 1`, [], (tx, results) => {
                    if (results.rows.length > 0) {
                        const newestAppointmentId = results.rows.item(0).ID;
                        resolve(newestAppointmentId);
                    } else {
                        resolve(null); // Return null if no appointments found
                    }
                }, (error) => {
                    reject(error);
                });
            });
        });
    }

    // DATABASE FEATURES FOR LEAVING HOME REMINDERS =================
}

module.exports = Database;
