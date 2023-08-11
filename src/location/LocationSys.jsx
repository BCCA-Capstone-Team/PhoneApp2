import Radar from 'react-native-radar';
import axios from 'axios';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
let publishableKey = 'prj_test_pk_2aa353aba74916c7f8c717e47c142613c66c6c31';

class LocationServices {
    constructor() {
        this.myRadar = Radar;
        this.axios = axios
        this.ready = false;
        this.homeStatus = false;
        this.homeJoining = [];
        this.homeLeaving = [];
        this.baseCampLocation = { lat: 34.166543, lon: -89.627894 }

        this.myRadar.startTrackingEfficient();
        this.myRadar.initialize(publishableKey);
        this.myRadar.setUserId('user1');

        this.myRadar.getPermissionsStatus().then((status) => {
            if (status != 'GRANTED_BACKGROUND' && status != 'GRANTED_FOREGROUND') {
                //ANDROID PERMISSIONS
                this.requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((permissionDetails) => {
                    if (permissionDetails[0] == true) {
                        this.myRadar.requestPermissions(true).then(newStatus => {
                            this.ready = true;
                        });
                    }
                });

                //IOS PERMISSIONS
                this.requestPermission(PERMISSIONS.IOS.LOCATION_ALWAYS).then((permissionDetails) => {
                    if (permissionDetails[0] == true) {
                        this.myRadar.requestPermissions(true).then(newStatus => {
                            this.ready = true;
                        });
                    }
                });
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
            check(permissionNode).then(result => {
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
                        resolve([false, 'The permission is denied and not requestable anymore']);
                        break;
                }
            })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // GeoCoding Functions ========================

    async getMyDistanceValue(originLocation, destinationLocation) {
        await this.onReady();
        return new Promise((resolve, reject) => {
            this.myRadar.getDistance({
                origin: {
                    latitude: originLocation.lat,
                    longitude: originLocation.lon,
                },
                destination: {
                    latitude: destinationLocation.lat,
                    longitude: destinationLocation.lon,
                },
                modes: [`car`],
                units: 'imperial',
            }).then(result => {
                let stringLength = result.routes.geodesic.distance.text.length - 3
                resolve(parseFloat(result.routes.geodesic.distance.text.slice(0, stringLength)));
            }).catch(err => {
                reject(err);
            });
        })
    }

    async getCoordsByAddress(address) {
        await this.onReady();
        return new Promise((resolve, reject) => {
            this.myRadar.geocode(address).then((result) => {
                resolve({ lat: result.addresses[0].latitude, lon: result.addresses[0].longitude });
            })
        })
    }

    async getMyLocation() {
        await this.onReady();
        return new Promise((resolve, reject) => {
            //let myLocation = this.myRadar.trackOnce()
            //myLocation.then(async (result) => {
            //    resolve({ lat: result.location.latitude, lon: result.location.longitude });
            //})
            resolve(this.baseCampLocation)
        })
    }

    async createGeoFenceAddress(address, distance, enterCallback, leaveCallback, refreshRate) {
        await this.onReady();
        let currentState = false
        let firstRun = false
        // False = Outside | True = Inside
        setInterval(async () => {
            let addressCoords = await this.getCoordsByAddress(address)
            let myLocation = await this.getMyLocation()
            let testDistance = await this.getMyDistanceValue(addressCoords, myLocation)

            if (testDistance < distance && currentState == true || testDistance < distance && firstRun == false) {
                currentState = false
                firstRun = true
                enterCallback()
            } else if (testDistance > distance && currentState == false || testDistance > distance && firstRun == false) {
                currentState = true
                firstRun = true
                leaveCallback()
            }
        }, 1000 * refreshRate)
    }

    // GeoFencing API Methods ======================

    // Unauthorized for some reason....still looking into it.

    async createGeofence(latitude, longitude, radius) {
        const RADAR_ENDPOINT = 'https://api.radar.io/v1/geofences';
        const RADAR_SECRET_KEY = 'prj_test_sk_183802503547a201917729874412fdbe590a1a9f';  // Replace with your secret key

        const headers = {
            Authorization: `Bearer ${RADAR_SECRET_KEY}`,
            'Content-Type': 'application/json'
        };
        // h

        const data = {
            description: "Home",
            type: "circle",
            coordinates: [longitude, latitude],  // Longitude first, then latitude
            radius: radius,  // In meters, so 15 for 15 meters
            enabled: true,
            // Add more fields as necessary based on your requirements
        };

        try {
            const response = await this.axios.post(RADAR_ENDPOINT, data, { headers });
            console.log("======== SUCCESSFUL CREATION OF GEOFENCE ==========")
            return response.data;
        } catch (error) {
            console.error('Error creating geofence:', error, error.response.data);
        }
    }

    async getGeofenceId() {
        const RADAR_ENDPOINT = 'https://api.radar.io/v1/geofences';
        const RADAR_SECRET_KEY = 'prj_test_sk_183802503547a201917729874412fdbe590a1a9f';  // Replace with your secret key

        const headers = {
            Authorization: `Bearer ${RADAR_SECRET_KEY}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await this.axios.get(RADAR_ENDPOINT, { headers });
            if (response.data && response.data.geofences) {
                const geofence = response.data.geofences.find(gf => gf.description === 'Home');
                if (geofence) {
                    console.log(`======== SUCCESSFUL GETTING OF GEOFENCE ID ${geofence._id}==========`)
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
        const RADAR_SECRET_KEY = 'prj_test_sk_183802503547a201917729874412fdbe590a1a9f';  // Replace with your secret key

        const headers = {
            Authorization: `Bearer ${RADAR_SECRET_KEY}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await this.axios.put(RADAR_ENDPOINT, updatedData, { headers });
            console.log("======== SUCCESSFUL UPDATE OF GEOFENCE ==========")
            return response.data;
        } catch (error) {
            console.error('Error updating geofence:', error);
            return null;
        }
    }

}

module.exports = LocationServices;
