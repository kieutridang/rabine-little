import mongoose, { Schema } from 'mongoose';

export const LayerStatusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  layerId: {
    type: Schema.Types.ObjectId,
    ref: 'SiteMapLayer',
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    defaultValue: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

LayerStatusSchema.index({
  layerId: 1,
  userId: 1
});

const model = mongoose.model('SiteMapLayerStatus', LayerStatusSchema);

export default model;
