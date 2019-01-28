const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const SiteMapCommentSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
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

SiteMapCommentSchema.plugin(uniqueValidator);
const SiteMapComment = mongoose.model('SiteMapComment', SiteMapCommentSchema);

export default SiteMapComment;
