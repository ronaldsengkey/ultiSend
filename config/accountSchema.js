'use strict';
var mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    company_id: {
        type: String,
        required: false
    },
    company_name: {
        type: String,
        required: false
    },
    employee_id: {
        type: String,
        required: false
    },
    employee_name: {
        type: String,
        required: false
    },
    auth_id: {
        type: String,
        required: false
    },    
    division_id: {
        type: String,
        required: false
    },
    division_name: {
        type: String,
        required: false
    },    
    employee_phone: {
        type: String,
        required: false
    },
    employee_email: {
        type: String,
        required: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const driver = mongoose.model('account', templateSchema, 'account');
module.exports = driver;