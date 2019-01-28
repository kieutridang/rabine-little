const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const RepairSchema = new Schema(
  {
    title: { type: String, trim: true, unique: true },
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

RepairSchema.plugin(uniqueValidator);

RepairSchema.static('findOneOrCreate', async function findOneOrCreate(condition, doc) {
  const one = await this.findOne(condition); // eslint-disable-line
  return one || this.create(doc); // eslint-disable-line
});

module.exports = mongoose.model('Repair', RepairSchema);
