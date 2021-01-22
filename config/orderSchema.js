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
    merchantId:{
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
    merchantLat: {
        type: String,
        required: false
    },
    merchantLong: {
        type: String,
        required: false
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
    receiverLat: {
        type: String,
        required: false
    },
    receiverLong: {
        type: String,
        required: false
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
    pickupDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    assignId: {
        type: Schema.Types.ObjectId,
        ref: 'driver'
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
    packageType: {
        type: String,
        required: false
    },
    paymentBy: {
        type: String,
        required: false
    },    
    paymentMethod: {
        type: String,
        required: false
    },    
    note: {
        type: String,
        required: false
    },        
    total: {
        type: String,
        required: false
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