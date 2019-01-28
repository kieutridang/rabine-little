const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const ClientBidSheetSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    bidSheetData: { type: Schema.Types.Mixed, required: false },
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

ClientBidSheetSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ClientBidSheet', ClientBidSheetSchema);
