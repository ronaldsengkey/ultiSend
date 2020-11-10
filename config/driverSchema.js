'use strict';
var mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    driverId: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    driverPhone: {
        type: String,
        required: true
    },
    driverAddress: {
        type: String,
        required: true
    },
    driverEmail: {
        type: String,
        required: true
    },
    driverVehicleInfo: {
        type: String,
        required: false
    },
    driverImage: {
        type: String,
        required: false
    },    
    driverStatus: {
        type: String,
        required: true
        // on/off
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const driver = mongoose.model('driver', templateSchema, 'driver');
module.exports = driver;