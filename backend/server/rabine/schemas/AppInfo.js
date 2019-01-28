const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const AppInfoSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    data: { type: Schema.Types.Mixed, required: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false,
    _id: false
  }
);

AppInfoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('AppInfo', AppInfoSchema);
