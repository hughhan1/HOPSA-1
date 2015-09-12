'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  desc: String,
  host: String,
  latLng: Object
});

module.exports = mongoose.model('Thing', ThingSchema);