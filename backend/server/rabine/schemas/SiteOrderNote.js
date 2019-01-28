import mongoose from 'mongoose';

const { Schema } = mongoose;

export const SiteOrderNoteSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'SiteOrder', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteOrderNoteSchema.index({
  siteId: 1,
  orderId: 1,
  serviceId: 1,
  userId: 1
});

const model = mongoose.model('SiteOrderNote', SiteOrderNoteSchema);
export default model;
