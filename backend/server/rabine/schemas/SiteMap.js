import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { FeatureSchema } from '~/schemas/SiteMapFeature';
import { LayerSchema } from '~/schemas/SiteMapLayer';

const SiteMapSchema = new Schema(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true
    },
    layers: {
      type: [LayerSchema],
      required: true,
      defaultValue: []
    },
    features: {
      type: [FeatureSchema],
      required: true,
      defaultValue: []
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteMapSchema.index({
  siteId: 1
});

SiteMapSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SiteMap', SiteMapSchema);
