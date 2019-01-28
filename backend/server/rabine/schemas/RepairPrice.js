const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const RepairPriceSchema = new Schema(
  {
    repairName: { type: String, trim: true, unique: false },
    areaRangeLow: { type: Number },
    areaRangeHigh: { type: Number },
    unit: { type: String, trim: true },
    y2018: { type: Number, default: false },
    y2019: { type: Number, default: false },
    y2020: { type: Number, default: false },
    y2021: { type: Number, default: false },
    y2022: { type: Number, default: false },
    y2023: { type: Number, default: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

RepairPriceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RepairPrice', RepairPriceSchema);
