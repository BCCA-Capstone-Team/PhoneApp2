import Radar from 'react-native-radar';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
let publishableKey = 'prj_test_pk_2aa353aba74916c7f8c717e47c142613c66c6c31'

class LocationServices {
    constructor() {
        this.myRadar = Radar
        this.ready = false
        this.homeStatus = false
        this.homeJoining = []
        this.homeLeaving = []

        this.myRadar.initialize(publishableKey);
        this.myRadar.setUserId('user1');


        this.myRadar.getPermissionsStatus().then((status) => {
            if (status != 'GRANTED_BACKGROUND' || status != 'GRANTED_FOREGROUND') {
                //ANDROID PERMISSIONS
                this.requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((permissionDetails) => {
                    console.log(permissionDetails[1])

                    if (permissionDetails[0] == true) {
                        this.myRadar.requestPermissions(true).then((newStatus) => {
                            console.log(`Updated Permission State: ${newStatus}`)
                            this.ready = true
                        });
                    }
                })

                //IOS PERMISSIONS
                this.requestPermission(PERMISSIONS.IOS.LOCATION_ALWAYS).then((permissionDetails) => {
                    console.log(permissionDetails[1])

                    if (permissionDetails[0] == true) {
                        this.myRadar.requestPermissions(true).then((newStatus) => {
                            console.log(`Updated Permission State: ${newStatus}`)
                            this.ready = true
                        });
                    }
                })
            } else {
                this.ready = true
            }
        });
    }

    onReady() {
        return new Promise((resolve, reject) => {
            let readyInterval = setInterval(() => {
                if (this.ready == true) {
                    resolve()
                    clearInterval(readyInterval)
                }
            }, 1)
        })
    }

    requestPermission(permissionNode) {
        return new Promise((resolve, reject) => {
            check(permissionNode).then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        resolve([false, 'This feature is not available'])
                        break;
                    case RESULTS.DENIED:
                        request(permissionNode).then((result) => {
                            resolve([true, 'The permission has been accepted'])
                        });
                        break;
                    case RESULTS.GRANTED:
                        resolve([true, 'The permission has been accepted'])
                        break;
                    case RESULTS.BLOCKED:
                        resolve([false, 'The permission is denied and not requestable anymore'])
                        break;
                }
            }).catch((error) => {
                reject(error)
            });
        })
    }

    async getGeoLocOfAddress(address) {
        await this.onReady()
        return new Promise((resolve, reject) => {
            this.myRadar.geocode(address).then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            });
        })
    }

    async getGeoDistance(originLocation, destinationLocation, mode) {
        await this.onReady()
        return new Promise((resolve, reject) => {
            this.myRadar.getDistance({
                origin: {
                    latitude: originLocation.x,
                    longitude: originLocation.y
                },
                destination: {
                    latitude: destinationLocation.x,
                    longitude: destinationLocation.y
                },
                modes: [ `car` ],
                units: 'imperial'
            }).then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            });
        })
    }

    async setHomeLocation(location, distance) {
        await this.onReady()
        

        this.myRadar.trackOnce().then(async (result) => {
            console.log(result.user.location)

            Radar.reverseGeocode({
                latitude: result.location.latitude,
                longitude: result.location.longitude
            }).then((result) => {
                console.log(result)
            }).catch((err) => {
                // optionally, do something with err
            });
            //let currentCoords = { x: result.location.latitude, y: result.location.longitude }
            //let homeLocation = await this.getGeoLocOfAddress(location)
            //console.log(currentCoords)
            //let homeCoords = { x: homeLocation.addresses[0].latitude, y: homeLocation.addresses[0].longitude }
            //console.log(homeCoords)

            //let fullDistance = await this.getGeoDistance(homeCoords, currentCoords, 'car')
            //console.log(fullDistance)
        }).catch((err) => {
            console.error(err)
        });

        //this.myRadar.getLocation().then(async (result) => {
        //    let currentCoords = { x: result.location.latitude, y: result.location.longitude }
        //    let homeLocation = await this.getGeoLocOfAddress(location)
        //    console.log(currentCoords)
        //    let homeCoords = { x: homeLocation.addresses[0].latitude, y: homeLocation.addresses[0].longitude }
        //    console.log(homeCoords)

        //    //let fullDistance = await this.getGeoDistance(homeCoords, currentCoords, 'car')
        //    //console.log(fullDistance)
        //}).catch((err) => {
        //    console.error(err)
        //})
    }

    onHomeJoin(callback) {
        this.homeJoining.push(callback)
    }

    onHomeLeave(callback) {
        this.homeLeaving.push(callback)
    }

    test() {
        //myRadar.trackOnce().then((result) => {
        //    console.log(result)
        //}).catch((err) => {
        //    console.error(err)
        //});
    }

}

module.exports = LocationServices