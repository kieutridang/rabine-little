export const layerOptions = {
  draggable: false,

  // snapping
  snappable: false,
  snapDistance: 15,

  // self intersection
  allowSelfIntersection: true,

  // the lines between coordinates/markers
  templineStyle: {
    color: 'red',
  },

  // the line from the last marker to the mouse cursor
  hintlineStyle: {
    color: 'red',
    dashArray: [5, 5],
  },
};

const DEFAULT_POLYGON_COLOR = '#FF7077';

export const whenEdited = {
  polygon: {
    showArea: true,
    showLength: true,
    shapeOptions: {
      color: DEFAULT_POLYGON_COLOR,
      fillOpacity: 0.5,
    },
    allowIntersection: false, // Restricts shapes to simple polygons
    drawError: {
      color: 'hsla(60, 100%, 44%, 1.0)', // Color the shape will turn when intersects
      message: '<strong>Oh snap!<strong> you can\'t draw that!', // Message that will show when intersect
    },
  },
  drawMarker: false, // adds button to draw markers
  drawPolyline: true, // adds button to draw a polyline
  drawRectangle: true, // adds button to draw a rectangle
  drawPolygon: true, // adds button to draw a polygon
  drawCircle: false, // adds button to draw a cricle
  cutPolygon: true, // adds button to cut a hole in a polygon
  editMode: true,
  removalMode: false,
};

export const whenShared = {
  drawMarker: false, // adds button to draw markers
  drawPolyline: false, // adds button to draw a polyline
  drawRectangle: false, // adds button to draw a rectangle
  drawPolygon: false, // adds button to draw a polygon
  drawCircle: false, // adds button to draw a cricle
  cutPolygon: false, // adds button to cut a hole in a polygon
  editMode: false, // adds button to toggle edit mode for all layers
  removalMode: false, // adds a button to remove layers
};
