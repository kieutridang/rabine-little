import mongoose, { Schema } from 'mongoose';

const AreaPhotoRepairSchema = new Schema({
  photoId: { type: Schema.Types.ObjectId, required: true },
  repairId: { type: String },
  repairName: { type: String, default: '' },
  index: { type: Number }
});

AreaPhotoRepairSchema.index({
  id: 1,
  repairId: 1,
  photoId: 1
});

module.exports = mongoose.model('AreaPhotoRepair', AreaPhotoRepairSchema);
