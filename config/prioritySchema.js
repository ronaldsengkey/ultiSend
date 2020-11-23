'use strict';
var mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const priorityTime = mongoose.model('priorityTime', templateSchema, 'priorityTime');
module.exports = priorityTime;