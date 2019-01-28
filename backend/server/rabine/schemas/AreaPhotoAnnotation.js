import mongoose, { Schema } from 'mongoose';

import { GeoJsonSchema } from './SiteMapFeature';

const AreaPhotoAnnotationSchema = new Schema({
  photoId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String },
  index: { type: Number },
  description: { type: String },
  geojson: GeoJsonSchema
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

AreaPhotoAnnotationSchema.index({
  id: 1,
  photoId: 1
});

module.exports = mongoose.model('AreaPhotoAnnotation', AreaPhotoAnnotationSchema);
