import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { STATUS_MAP } from '~/constants/siteOrderStatus';

const { Schema } = mongoose;

const statusEnum = Object.keys(STATUS_MAP);
const typeEnum = [
  'Pavement',
  'Roofing',
  'HVAC',
  'Landscaping'
];

const SiteOrderServiceStatusSchema = new Schema(
  {
    name: { type: String, required: true, enum: statusEnum, defaultValue: STATUS_MAP.NEW_ORDER },
    completedAt: { type: Date },
    completedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

export const SiteOrderServiceSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    type: { type: String, trim: true, enum: typeEnum },
    cost: { type: Number, required: true },
    status: { type: String, enum: statusEnum, required: true },
    statusLog: { type: [SiteOrderServiceStatusSchema] }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteOrderServiceSchema.plugin(uniqueValidator);

SiteOrderServiceSchema.index({
  orderId: 1,
  siteId: 1,
  type: 1
}, {
  unique: true
});

const model = mongoose.model('SiteOrderService', SiteOrderServiceSchema);
export default model;
