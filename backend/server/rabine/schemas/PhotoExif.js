const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const PhotoExifSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    relativePath: { type: String, trim: true, unique: true },
    imageUrl: { type: String, trim: true },
    exif: { type: Schema.Types.Mixed },
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

PhotoExifSchema.plugin(uniqueValidator);

module.exports = mongoose.model('PhotoExif', PhotoExifSchema);
