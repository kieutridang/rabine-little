const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const SiteActivitySchema = new Schema(
  {
    title: {
      type: String, trim: true
    },
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creatorName: {
      type: String, unique: false, required: true, trim: true
    },
    type: { type: String, required: true, trim: true },
    notes: { type: String, required: false, trim: true },
    oldStatus: { type: String, required: false, trim: true },
    newStatus: { type: String, required: false, trim: true },
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

SiteActivitySchema.plugin(uniqueValidator);
module.exports = mongoose.model('SiteActivity', SiteActivitySchema);
