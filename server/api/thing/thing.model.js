'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var timeNow = function() {
  return new Date()
}

var timeLater = function() {
  return new Date((new Date()).getTime() + (20 * 60 * 1000)); // 20 minutes later
}

var ThingSchema = new Schema({
  name: String,
  desc: String,
  startTime: { 
    type: Date, 
    default: timeNow()
  },
  endTime: {
    type: Date,
    default: timeLater()
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