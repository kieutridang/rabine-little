import mongoose from 'mongoose';

const { Schema } = mongoose;

export const SiteOrderInstructionSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'SiteOrder', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    deadline: { type: String, required: true },
    content: { type: String, required: true },
    fileURL: { type: String },
    screenshotURL: { type: String, required: true },
    isSent: { type: Boolean, defaultValue: false },
    sentAt: { type: Date }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteOrderInstructionSchema.index({
  siteId: 1,
  orderId: 1,
  userId: 1,
  email: 1
});

const model = mongoose.model('SiteOrderInstruction', SiteOrderInstructionSchema);
export default model;
