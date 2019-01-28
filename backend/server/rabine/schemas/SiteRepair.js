const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const SiteRepairSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    title: { type: String, trim: true },
    unit: { type: String, trim: true },
    type: { type: String, trim: true },
    qty: { type: String, trim: true },
    year: { type: String, trim: true },
    zone: { type: String, trim: true },
    createdDate: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteRepairSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SiteRepair', SiteRepairSchema);
