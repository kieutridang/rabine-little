const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { LatLngBoxSchema } = require('./Common');

const { Schema } = mongoose;

const OrthoPhotoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    planId: { type: Schema.Types.ObjectId, required: true },
    url: { type: String, required: true },
    taken: { type: Date, default: Date.now },
    kmlOrigin: { type: String },
    latLngBox: LatLngBoxSchema,
    createdDate: { type: Date, required: true, default: Date.now },
    deleted: { type: Boolean, default: false, required: true }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

OrthoPhotoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('OrthoPhoto', OrthoPhotoSchema);
