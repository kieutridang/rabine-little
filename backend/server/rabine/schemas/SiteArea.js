const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const { AreaPhotoSchema } = require('./AreaPhoto');

const SiteAreaSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    createdDate: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    photos: { type: [AreaPhotoSchema], default: [], required: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  }
);

SiteAreaSchema.index({
  siteId: 1
});

SiteAreaSchema.plugin(uniqueValidator);
module.exports = mongoose.model('SiteArea', SiteAreaSchema);
