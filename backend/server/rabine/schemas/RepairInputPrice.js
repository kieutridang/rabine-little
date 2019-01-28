const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const RepairInputPriceSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    featureId: { type: String, required: true },
    unitPrice: { type: String, required: true },
    qty: { type: Number, required: false, default: 0 },
    createdDate: { type: Date, default: Date.now }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

RepairInputPriceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RepairInputPrice', RepairInputPriceSchema);
