import { Schema } from 'mongoose';

const PropertiesSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },

  id: { type: String },
  title: { type: String },
  index: {
    type: Number
  },
  layerId: { type: String },
  zone: {
    id: {
      type: String
    },
    title: {
      type: String
    }
  },
  pci: { type: String },
  repairType: { type: String },
  surfaceType: { type: String },
  trafficType: { type: String },
  color: { type: String },

  restripeAffectedArea: {
    type: Boolean,
    required: false
  },
  fillAsphaltCrack: {
    type: Boolean,
    required: false
  },
  concreteCrackFill: {
    type: Boolean,
    required: false
  },

  inputArea: {
    type: String,
    required: false
  },
  inputAsphalt: {
    type: String,
    required: false
  },
  inputConcreteCrackFill: {
    type: String,
    required: false
  }
});

export default PropertiesSchema;
