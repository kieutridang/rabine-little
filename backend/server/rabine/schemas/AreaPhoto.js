const mongoose = require('mongoose');

const { Schema } = mongoose;
const { LocationSchema } = require('./Common');

const AreaPhotoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    taken: { type: Date, default: Date.now },
    droneMake: { type: String, required: true },
    droneModel: { type: String, required: true },
    url: { type: String, required: true },
    location: LocationSchema,
    isUplift: { type: Boolean, default: false },
    defected: { type: Boolean, default: false },
    repairId: { type: Schema.Types.ObjectId, ref: 'Repair' },
    severity: { type: String, default: null },
    croppedUrl: { type: String },
    isCropUploaded: { type: Boolean },
    repair: { type: Boolean, default: false },
    repairName: { type: String, default: '' },
    createdDate: { type: Date, required: true, default: Date.now },
    zoneId: { type: Schema.Types.ObjectId, ref: 'SiteMapFeature' },
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


AreaPhotoSchema.index({
  id: 1,
  isUplift: 1,
  defected: 1,
  repairId: 1,
  croppedUrl: 1,
  isCropUploaded: 1,
  createdAt: 1,
  updatedAt: 1,
  deleted: 1
});

module.exports = {
  AreaPhotoSchema
};

const UniqAreaPhotoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    taken: { type: Date, default: Date.now },
    droneMake: { type: String, required: true },
    droneModel: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    location: LocationSchema,
    isUplift: { type: Boolean, default: false },
    defected: { type: Boolean, default: false },
    repairId: { type: Schema.Types.ObjectId, ref: 'Repair' },
    severity: { type: String, default: null },
    croppedUrl: { type: String },
    isCropUploaded: { type: Boolean, default: false },
    repair: { type: Boolean, default: false },
    repairName: { type: String, default: '' },
    createdDate: { type: Date, required: true, default: Date.now },
    zoneId: { type: Schema.Types.ObjectId, ref: 'SiteMapFeature' },
    deleted: { type: Boolean, default: false, required: true }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('AreaPhoto', UniqAreaPhotoSchema);
