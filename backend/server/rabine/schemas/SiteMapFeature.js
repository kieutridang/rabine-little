import mongoose, { Schema } from 'mongoose';

import GeometrySchema from './SiteMapFeatureGeometry';

const geojsonSchema = {
  type: {
    type: String,
    trim: true
  },

  geometry: GeometrySchema
};

export const GeoJsonSchema = {
  ...geojsonSchema,
  features: [new Schema({ ...geojsonSchema })]
};

export const FeatureSchemaFields = {
  title: { type: String },
  index: { type: Number },
  layerId: { type: Schema.Types.ObjectId, ref: 'SiteMapLayer' },
  zoneId: { type: String },
  pci: { type: String },
  repairType: { type: String },
  surfaceType: { type: String },
  trafficType: { type: String },
  color: { type: String },
  restripeAffectedArea: { type: Boolean },
  fillAsphaltCrack: { type: Boolean },
  concreteCrackFill: { type: Boolean },
  overrideSF: { type: Boolean },
  patchNumber: { type: String },

  inputArea: { type: String },
  inputAsphalt: { type: String },
  inputConcreteCrackFill: { type: String },
  inputOverrideSF: { type: String }

};

export const FeatureSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
  geojson: GeoJsonSchema,
  ...FeatureSchemaFields,
  featureType: { type: String, default: 'PAVEMENT', required: true }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const model = mongoose.model('SiteMapFeature', FeatureSchema);

export default model;
