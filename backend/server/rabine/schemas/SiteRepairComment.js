const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const SiteRepairCommentSchema = new Schema(
  {
    repairInstanceId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    authorName: { type: String, required: false, trim: true },
    comment: { type: String, required: true, trim: true },
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

SiteRepairCommentSchema.plugin(uniqueValidator);
const SiteRepairComment = mongoose.model('SiteRepairComment', SiteRepairCommentSchema);

export default SiteRepairComment;
