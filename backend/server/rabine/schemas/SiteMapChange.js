import mongoose from 'mongoose';

import { FeatureSchema, FeatureSchemaFields } from '~/schemas/SiteMapFeature';
import { LayerSchema, LayerSchemaFields } from '~/schemas/SiteMapLayer';

const { Schema } = mongoose;

const FieldsSchema = new Schema({ ...FeatureSchemaFields, ...LayerSchemaFields });

const ChangedFieldsSchema = new Schema({
  old: {
    type: FieldsSchema
  },
  new: {
    type: FieldsSchema
  }
});

export const SiteMapChange = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true
    },
    title: {
      type: String
    },
    type: {
      type: String,
      required: true,
      enum: [
        'CREATE_FEATURE',
        'UPDATE_FEATURE',
        'RESTORE_FEATURE',
        'CUT_FEATURE',
        'DELETE_FEATURE',

        'CREATE_LAYER',
        'UPDATE_LAYER',
        'RESTORE_LAYER',
        'DELETE_LAYER',

        'REORDER_FEATURES',
        'REORDER_LAYERS'
      ]
    },
    layer: {
      type: LayerSchema
    },
    feature: {
      type: FeatureSchema
    },
    changedFields: {
      type: ChangedFieldsSchema
    },
    isFirstEdit: {
      type: Boolean
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

SiteMapChange.index({
  siteId: 1,
  type: 1
});

const SiteMapChangeModel = mongoose.model('SiteMapChange', SiteMapChange);

export default SiteMapChangeModel;
