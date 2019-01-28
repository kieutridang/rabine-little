const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { GeoJsonSchema } = require('./SiteMapFeature');

const { Schema } = mongoose;

export const RoofingFeatureSchemaFields = {
  title: { type: String, trim: true },
  index: { type: Number, required: false, default: 0 },
  color: { type: String, trim: true },
  type: { type: String, trim: true },

  layerId: { type: Schema.Types.ObjectId, ref: 'SiteMapLayer' },
  layerType: { type: String, required: true },

  defectType: { type: String, trim: true },
  typeOfRepair: { type: String, trim: true },
  repairType: { type: String, trim: true },
  repairCost: { type: String, trim: true },

  zoneId: { type: String, trim: true },
  zoneType: { type: String, trim: true },
  zoneSubType: { type: String, trim: true },
  zoneName: { type: String, trim: true },
  rating: { type: Number }
};

export const RoofingFeatureSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
  geojson: GeoJsonSchema,
  ...RoofingFeatureSchemaFields,
  deleted: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

RoofingFeatureSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RoofingFeature', RoofingFeatureSchema);
