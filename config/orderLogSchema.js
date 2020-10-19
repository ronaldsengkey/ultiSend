'use strict';
var mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    driverId: {
        type: String,
        required: true
    },
    responseNotes: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    userCreated: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const orderLog = mongoose.model('orderLog', templateSchema, 'orderLog');
module.exports = orderLog;