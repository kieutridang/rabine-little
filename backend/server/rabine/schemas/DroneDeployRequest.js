const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const DroneDeployRequest = new mongoose.Schema(
  {
    siteId: { type: String, unique: false, required: false },
    planId: { type: String, unique: false, required: true },
    droneDeployExportRequestId: { type: String, unique: false },
    droneDeployStatus: { type: String, unique: false },
    droneDeployUpdatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
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

DroneDeployRequest.plugin(uniqueValidator);
module.exports = mongoose.model('DroneDeployRequest', DroneDeployRequest);
