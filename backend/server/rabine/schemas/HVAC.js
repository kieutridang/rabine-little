const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { GeoJsonSchema } = require('./SiteMapFeature');

const { Schema } = mongoose;

const HVACSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    currentUnitCost: { type: String, trim: true },
    drigInstallCost: { type: String, trim: true },
    geojson: GeoJsonSchema,
    invoice: { type: String, trim: true },
    layerType: { type: String, trim: true },
    manufactureDate: { type: Date, default: Date.now },
    modelNumber: { type: String, trim: true },
    pubScore: { type: String, trim: true },
    serialNumber: { type: String, trim: true },
    unitNumber: { type: String, trim: true },
    unitTonnage: { type: String, trim: true },
    unitType: { type: Schema.Types.Mixed },
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

HVACSchema.plugin(uniqueValidator);

module.exports = mongoose.model('HVAC', HVACSchema);
