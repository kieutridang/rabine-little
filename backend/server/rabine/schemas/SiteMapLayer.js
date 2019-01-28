import mongoose, { Schema } from 'mongoose';

export const LayerSchemaFields = {
  name: { type: String, trim: true },
  index: { type: Number },
  featureType: { type: String, default: 'PAVEMENT', required: true }
};

export const LayerSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
  ...LayerSchemaFields,
  oldId: { type: Schema.Types.ObjectId }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

LayerSchema.index({
  siteId: 1
});

const model = mongoose.model('SiteMapLayer', LayerSchema);

export default model;
