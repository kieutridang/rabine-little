const mongoose = require('mongoose');

const { Schema } = mongoose;

const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  {
    versionKey: false,
    _id: false
  }
);

const LatLngBoxSchema = new Schema(
  {
    east: { type: Number, required: true },
    west: { type: Number, required: true },
    north: { type: Number, required: true },
    south: { type: Number, required: true }
  },
  {
    versionKey: false,
    _id: false
  }
);


module.exports = {
  LocationSchema,
  LatLngBoxSchema
};
