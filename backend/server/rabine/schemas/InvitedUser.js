const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const InvitedUserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    fullName: { type: String, unique: false, required: true },
    role: { type: String, default: 'normal', required: false },
    userType: { type: String, default: 'User', required: false },
    company: { type: String, required: false },
    clientTitle: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
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

InvitedUserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('InvitedUserS', InvitedUserSchema);
