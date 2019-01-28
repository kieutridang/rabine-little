const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const DronePartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String, unique: true, required: true, trim: true
    },
    contactName: {
      type: String, unique: false, required: true, trim: true
    },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    notes: { type: String, required: true, trim: true },
    createdDate: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

DronePartnerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('DronePartner', DronePartnerSchema);
