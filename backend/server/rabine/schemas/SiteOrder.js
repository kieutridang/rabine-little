import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { LocationSchema } = require('./Common');

const { Schema } = mongoose;

export const SiteOrderSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },

    dronePlanId: { type: Schema.Types.ObjectId, default: null, required: false },
    droneCost: { type: Number, required: false },

    address: { type: String, required: true },
    addressLocation: LocationSchema,

    name: { type: String, unique: false, required: true },

    deadline: { type: Date, required: false },
    rabineS3Folder: { type: String, default: null, required: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteOrderSchema.plugin(uniqueValidator);

SiteOrderSchema.index({
  siteId: 1,
  status: 1
}, {
  unique: true
});

const model = mongoose.model('SiteOrder', SiteOrderSchema);
export default model;
