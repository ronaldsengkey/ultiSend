'use strict';
var mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    orderCode: {
        type: String,
        required: true
    },
    orderReff: {
        type: String,
        required: true
    },
    merchantName: {
        type: String,
        required: true
    },
    merchantAddress: {
        type: String,
        required: true
    },
    merchantPhone: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    receiverPhone: {
        type: String,
        required: true
    },
    receiverImage: {
        type: String,
        required: false
    },    
    serviceName: {
        type: String,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    assignId: {
        type: String,
        required: false
    },    
    assignName: {
        type: String,
        required: false
    },
    assignImage: {
        type: String,
        required: false
    },        
    orderItem: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: true
        //example : orderId:receiverName:receiverPhone
    },
    userCreated: {
        type: String,
        required: true
    },
    userUpdated: {
        type: String,
        required: false
    },    
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const order = mongoose.model('order', templateSchema, 'order');
module.exports = order;