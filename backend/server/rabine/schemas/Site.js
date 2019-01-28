const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { LocationSchema } = require('./Common');

const { Schema } = mongoose;

const SiteSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    dronePlanId: { type: Schema.Types.ObjectId, default: null, required: false },
    dronePlanName: { type: String, unique: false, required: false },
    name: { type: String, unique: false, required: true },
    status: { type: String, required: true },
    address: { type: String, required: true },
    location: LocationSchema,
    addressLocation: LocationSchema,
    deadline: { type: Date, required: false },
    type: { type: String, required: true },
    cost: { type: Number },
    droneCost: { type: Number, required: false },
    sqFoot: { type: Number, required: false },
    notes: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false, required: true },
    googleDriveId: { type: String, default: null, required: false },
    rabineS3Folder: { type: String, default: null, required: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Site', SiteSchema);
