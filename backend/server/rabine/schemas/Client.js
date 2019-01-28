const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactName: { type: String, required: false, trim: true },
    address: { type: String, required: false },
    phone: { type: String, trim: true },
    email: { type: String, required: false, trim: true },
    notes: { type: String, required: false, trim: true },
    companyLogoKey: { type: String },
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

ClientSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Client', ClientSchema);
