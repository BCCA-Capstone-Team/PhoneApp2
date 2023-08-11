import Radar from 'react-native-radar';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
let publishableKey = 'prj_test_pk_2aa353aba74916c7f8c717e47c142613c66c6c31';
import axios from 'axios';

class LocationServices {
  constructor() {
    this.myRadar = Radar;
    this.axios = axios;
    this.ready = false;
    this.homeStatus = false;
    this.homeJoining = [];
    this.homeLeaving = [];

    this.myRadar.startTrackingEfficient();
    this.myRadar.initialize(publishableKey);
    this.myRadar.setUserId('user1');

    this.myRadar.getPermissionsStatus().then(status => {
      if (status != 'GRANTED_BACKGROUND' || status != 'GRANTED_FOREGROUND') {
        //ANDROID PERMISSIONS
        this.requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
          permissionDetails => {
            // console.log(permissionDetails[1]);

            if (permissionDetails[0] == true) {
              this.myRadar.requestPermissions(true).then(newStatus => {
                // console.log(`Updated Permission State: ${newStatus}`);
                this.ready = true;
              });
            }
          },
        );

        //IOS PERMISSIONS
        this.requestPermission(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
          permissionDetails => {
            // console.log(permissionDetails[1]);

            if (permissionDetails[0] == true) {
              this.myRadar.requestPermissions(true).then(newStatus => {
                // console.log(`Updated Permission State: ${newStatus}`);
                this.ready = true;
              });
            }
          },
        );
      } else {
        this.ready = true;
      }
    });
  }

  onReady() {
    return new Promise((resolve, reject) => {
      let readyInterval = setInterval(() => {
        if (this.ready == true) {
          resolve();
          clearInterval(readyInterval);
        }
      }, 1);
    });
  }

  requestPermission(permissionNode) {
    return new Promise((resolve, reject) => {
      check(permissionNode)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              resolve([false, 'This feature is not available']);
              break;
            case RESULTS.DENIED:
              request(permissionNode).then(result => {
                resolve([true, 'The permission has been accepted']);
              });
              break;
            case RESULTS.GRANTED:
              resolve([true, 'The permission has been accepted']);
              break;
            case RESULTS.BLOCKED:
              resolve([
                false,
                'The permission is denied and not requestable anymore',
              ]);
              break;
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // GeoCoding Functions ========================

  async getCoordsByAddress(address) {
    console.log(
      'getCoordsByAddress function in Location.jsx ==================',
    );
    console.log(`${address}`);
    await this.onReady();
    return new Promise((resolve, reject) => {
      this.myRadar
        .geocode(address)
        .then(result => {
          Object.keys(result).forEach(key => {
            console.log(key, result[key]);
          });
          console.log(`${result} ===== Successful pull.`);
          resolve(result);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  // GeoFencing API Methods ======================

  // Unauthorized for some reason....still looking into it.

  async createGeofence(latitude, longitude, radius) {
    const RADAR_ENDPOINT = 'https://api.radar.io/v1/geofences';
    const RADAR_SECRET_KEY =
      'prj_test_sk_183802503547a201917729874412fdbe590a1a9f'; // Replace with your secret key

    const headers = {
      Authorization: `Bearer ${RADAR_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
    // h

    const data = {
      description: 'Home',
      type: 'circle',
      coordinates: [longitude, latitude], // Longitude first, then latitude
      radius: radius, // In meters, so 15 for 15 meters
      enabled: true,
      // Add more fields as necessary based on your requirements
    };

    try {
      const response = await this.axios.post(RADAR_ENDPOINT, data, {headers});
      console.log('======== SUCCESSFUL CREATION OF GEOFENCE ==========');
      return response.data;
    } catch (error) {
      console.error('Error creating geofence:', error, error.response.data);
    }
  }

  async getGeofenceId() {
    const RADAR_ENDPOINT = 'https://api.radar.io/v1/geofences';
    const RADAR_SECRET_KEY =
      'prj_test_sk_183802503547a201917729874412fdbe590a1a9f'; // Replace with your secret key

    const headers = {
      Authorization: `Bearer ${RADAR_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await this.axios.get(RADAR_ENDPOINT, {headers});
      if (response.data && response.data.geofences) {
        const geofence = response.data.geofences.find(
          gf => gf.description === 'Home',
        );
        if (geofence) {
          console.log(
            `======== SUCCESSFUL GETTING OF GEOFENCE ID ${geofence._id}==========`,
          );
          return geofence._id;
        }
      }
    } catch (error) {
      console.error('Error fetching geofences:', error);
      return null;
    }
  }

  async editGeofence(geofenceId, updatedData) {
    const RADAR_ENDPOINT = `https://api.radar.io/v1/geofences/${geofenceId}`;
    const RADAR_SECRET_KEY =
      'prj_test_sk_183802503547a201917729874412fdbe590a1a9f'; // Replace with your secret key

    const headers = {
      Authorization: `Bearer ${RADAR_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await this.axios.put(RADAR_ENDPOINT, updatedData, {
        headers,
      });
      console.log('======== SUCCESSFUL UPDATE OF GEOFENCE ==========');
      return response.data;
    } catch (error) {
      console.error('Error updating geofence:', error);
      return null;
    }
  }
}

module.exports = LocationServices;
