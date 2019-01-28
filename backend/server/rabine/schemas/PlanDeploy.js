const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { LocationSchema } = require('./Common');

const PlanDeploySchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    location: LocationSchema,
    imageCount: { type: Number, required: false },
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

PlanDeploySchema.plugin(uniqueValidator);
module.exports = mongoose.model('PlanDeploy', PlanDeploySchema);
