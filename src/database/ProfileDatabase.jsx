let Database = require('../database/Database.jsx');

class ProfileDatabase extends Database {
  constructor() {
    super('ProfileDatabaseTable');
    this.debug = true;
    this.ready = false;
    this.startProfileSystem();
  }

  async startProfileSystem() {
    this.table = await this.createTable('profileDatabase', column => {
      // column.autoClear();

      column.create('firstName', 'TEXT');
      column.create('lastName', 'TEXT');
      column.create('street', 'TEXT');
      column.create('city', 'TEXT');
      column.create('state', 'TEXT');
      column.create('zipCode', 'INT');
      column.create('lat', 'REAL');
      column.create('long', 'REAL');

      column.run();
    });
    this.ready = true;
  }

  onProfileReady() {
    return new Promise((resolve, reject) => {
      let readyInterval = setInterval(() => {
        if (this.ready == true) {
          resolve(true);
          clearInterval(readyInterval);
        }
      }, 1);
    });
  }

  async getProfile() {
    await this.onProfileReady();
    return new Promise(async (resolve, reject) => {
      await this.table.reload();
      let returnTable = {};
      if (this.table.data[0]) {
        returnTable.firstName = this.table.data[0][1][1];
        returnTable.lastName = this.table.data[0][2][1];
        returnTable.street = this.table.data[0][3][1];
        returnTable.city = this.table.data[0][4][1];
        returnTable.state = this.table.data[0][5][1];
        returnTable.zipCode = this.table.data[0][6][1];
        //returnTable.lat = this.table.data[0][7][1];
        //returnTable.long = this.table.data[0][8][1];
      }
      resolve(returnTable);
    });
  }

  async checkForProfile() {
    await this.onProfileReady();
    return new Promise(async (resolve, reject) => {
      await this.table.reload();
      if (this.table.data.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  // old editProfile function(incomplete)
  //
  // editProfile(key, value) {
  //   return new Promise((resolve, reject) => {
  //     if (!key || !value) {
  //       console.error('Invalid Update Value');
  //       resolve(false);
  //       return;
  //     }

  //     if (key == ' ' || value == ' ') {
  //       console.error('Invalid Update Value');
  //       resolve(false);
  //       return;
  //     }

  //     if (key.toLowerCase() == 'firstname') {
  //       resolve(true);
  //       let targetRow = this.table.data[0][0][1];
  //       this.table.update(targetRow, 'firstName', value);
  //     } else {
  //       resolve(false);
  //     }
  //   });
  // }
  //
  // new editProfile function (complete)
  editProfile(key, value) {
    return new Promise((resolve, reject) => {
      // if (!key || !value) {
      //   console.error('Invalid Update Value');
      //   resolve(false);
      //   return;
      // }

      // if (key === ' ' || value === ' ') {
      //   console.error('Invalid Update Value');
      //   resolve(false);
      //   return;
      // }

      // now checks all keys to update every field as needed
      if (key.toLowerCase() === 'firstname') {
        let targetRow = this.table.data[0][0][1];
        this.table.update(targetRow, 'firstName', value);
      } else if (key.toLowerCase() === 'lastname') {
        let targetRow = this.table.data[0][0][1];
        this.table.update(targetRow, 'lastName', value);
      } else if (key.toLowerCase() === 'street') {
        let targetRow = this.table.data[0][0][1];
        this.table.update(targetRow, 'street', value);
      } else if (key.toLowerCase() === 'city') {
        let targetRow = this.table.data[0][0][1];
        this.table.update(targetRow, 'city', value);
      } else if (key.toLowerCase() === 'state') {
        let targetRow = this.table.data[0][0][1];
        this.table.update(targetRow, 'state', value);
      } else if (key.toLowerCase() === 'zipcode') {
        let targetRow = this.table.data[0][0][1];
        this.table.update(targetRow, 'zipCode', parseInt(value, 10));
      } else if (key.toLowerCase() === 'long') {
        let targetRow = this.table.data[0][0][1];
      } else if (key.toLowerCase() === 'lat') {
        let targetRow = this.table.data[0][0][1];
      } else {
        console.error('Invalid key:', key);
        resolve(false);
        return;
      }

      resolve(true);
    });
  }

  async addProfile(
    firstName,
    lastName,
    street,
    city,
    state,
    zipCode,
    lat,
    long,
  ) {
    await this.onProfileReady();
    return new Promise(async (resolve, reject) => {
      await this.table.add(
        firstName,
        lastName,
        street,
        city,
        state,
        zipCode,
        lat,
        long,
      );
      resolve(true);
    });
  }
}

module.exports = ProfileDatabase;
