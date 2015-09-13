'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  startTime: { 
    type: Date, 
    default: new Date()
  },
  endTime: {
    type: Date,
    default: new Date((new Date()).getTime() + (30 * 60 * 1000)) // 30 minutes later
  },
  host: String,
  latLng: Object,
  votes: {
    type: Number,
    default: 0
  },
  voted: [{
    userId: String,
    vote: Number
  }],
  user: Object
});

module.exports = mongoose.model('Thing', ThingSchema);