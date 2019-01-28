import { Schema } from 'mongoose';

const GeometrySchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Polygon',
      'MultiPolygon',
      'GeometryCollection',
      'LineString',
      'MultiLineString',
      'Point'
    ],
    default: 'Polygon'
  },
  coordinates: {
    type: [[[Number]]],
    default: [[[0, 0]]]
  }
});

export default GeometrySchema;
