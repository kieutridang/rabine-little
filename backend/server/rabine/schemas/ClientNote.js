const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const ClientNoteSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    clientName: {
      type: String, unique: false, required: true, trim: true
    },
    notes: { type: String, required: false, trim: true },
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

ClientNoteSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ClientNote', ClientNoteSchema);
