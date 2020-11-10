'use strict';
var mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    driverId: {
        type: String,
        required: false
    },
    driverName: {
        type: String,
        required: false
    },
    driverPhone: {
        type: String,
        required: false
    },
    driverAddress: {
        type: String,
        required: false
    },
    driverEmail: {
        type: String,
        required: false
    },
    driverVehicleInfo: {
        type: String,
        required: false
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
        required: false
        // on/off
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const driver = mongoose.model('driver', templateSchema, 'driver');
module.exports = driver;