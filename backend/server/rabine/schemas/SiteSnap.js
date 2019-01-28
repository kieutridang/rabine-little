const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const SiteSnapSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site' },
    layerId: { type: String, default: null },
    bidSheetPhotoKey: { type: String, default: '', required: true },
    bidSheetPhotoUrl: { type: String, default: '', required: true },
    createdDate: { type: Date, required: true, default: Date.now },
    deleted: { type: Boolean, default: false, required: true }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteSnapSchema.index({
  siteId: 1,
  layerId: 1
});
SiteSnapSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SiteSnap', SiteSnapSchema);
