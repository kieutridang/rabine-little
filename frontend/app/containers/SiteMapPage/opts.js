import { LANDSCAPING_NAME, HVAC_NAME, PAVEMENT_NAME, ROOFING_NAME } from './constants';

const DEFAULT_POLYGON_COLOR = '#FF7077';

export const layerOptions = {
  transform: true,
  draggable: true,
  scaling: true,
};

export const draw = {
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

export const readOnlyDraw = {
  drawMarker: false, // adds button to draw markers
  drawPolyline: false, // adds button to draw a polyline
  drawRectangle: false, // adds button to draw a rectangle
  drawPolygon: false, // adds button to draw a polygon
  drawCircle: false, // adds button to draw a cricle
  cutPolygon: false, // adds button to cut a hole in a polygon
  editMode: false, // adds button to toggle edit mode for all layers
  removalMode: false, // adds a button to remove layers
};

export const subNavBarItems = [
  {
    key: 'all',
    label: 'ALL',
  },
  {
    key: 'mapPavement',
    label: PAVEMENT_NAME,
  },
  {
    key: 'mapHvac',
    label: HVAC_NAME,
  },
  {
    key: 'mapLandscaping',
    label: LANDSCAPING_NAME,
  },
  {
    key: 'mapRoofing',
    label: ROOFING_NAME,
  },
];
