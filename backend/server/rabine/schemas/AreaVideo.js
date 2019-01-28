const mongoose = require('mongoose');

const { Schema } = mongoose;

const AreaVideoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    isUplift: { type: Boolean, default: true },
    defected: { type: Boolean, default: false },
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

module.exports = {
  AreaVideoSchema
};

const UniqAreaVideoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, unique: true },
    isUplift: { type: Boolean, default: false },
    defected: { type: Boolean, default: false },
    createdDate: { type: Date, required: true, default: Date.now },
    deleted: { type: Boolean, default: false, required: true }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('AreaVideo', UniqAreaVideoSchema);

