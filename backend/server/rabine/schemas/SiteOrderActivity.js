import mongoose from 'mongoose';

const { Schema } = mongoose;

const types = [
  'ORDER_CREATED',
  'ORDER_SERVICE_CREATED',
  'ORDER_SERVICE_CHANGED',
  'ORDER_NOTE_CREATED',
  'ORDER_INSTRUCTION_CREATED',
  'ORDER_INSTRUCTION_SENT'
];

export const SiteOrderActivitySchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'SiteOrder', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, trim: true, enum: types },
    content: { type: String }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteOrderActivitySchema.index({
  siteId: 1,
  orderId: 1,
  userId: 1
});

const model = mongoose.model('SiteOrderActivity', SiteOrderActivitySchema);
export default model;
