import PropTypes from 'prop-types';
import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import isEqual from 'lodash/isEqual';

require('./leaflet.canvas-markers');

const getType = (ob) => {
  if (ob instanceof Array) {
    return 'array';
  } else if (typeof (ob) === 'object') {
    return 'object';
  }
  return typeof (ob);
};

export default class CanvasMarkersLayer extends MapLayer {
  static childContextTypes = {
    layerContainer: PropTypes.shape({
      addLayer: PropTypes.func.isRequired,
      removeLayer: PropTypes.func.isRequired,
    }),
  };

  componentWillMount() {
    const { options } = this.props;
    this.leafletElement = L.canvasIconLayer(options || this.props);
    this.leafletElement.addTo(this.context.map);
    this.initEventListeners(this.leafletElement);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      if ((nextProps.children.length === 0) && (this.props.children.length > 0)) {
        this.leafletElement._markers = {};
      }
    }
  }

  componentDidMount() {
    /* eslint-disable no-underscore-dangle */
    this.leafletElement._reset();
  }

  initEventListeners(layer) {
    layer.addOnClickListener((event, marker) => {
      if (marker.options.onClick) {
        marker.options.onClick();
      }

      if (this.props.onMarkerClick) {
        this.props.onMarkerClick(event, marker);
      }

      if (marker._popup) {
        marker._popup.setLatLng(marker._latlng).openOn(this.context.map);
      }
    });
  }

  getLeafletElement() {
    return this.leafletElement;
  }

  getChildContext() {
    return {
      layerContainer: this.leafletElement,
    };
  }

  /* eslint-disable class-methods-use-this */
  createLeafletElement(props) {
    return L.canvasIconLayer(props.options || props);
  }

  updateLeafletElement(fromProps, toProps) {
    if (isEqual(fromProps.children, toProps.children)) {
      return;
    }

    this.leafletElement.redraw();
  }

  checkProsEqual(from, to) {
    const dataKey = this.props.dataKey || 'position';

    if ((getType(from) !== 'array' && getType(to) !== 'object') || (getType(from) !== 'object' && getType(to) !== 'array')) {
      return false;
    }

    if ((getType(from) === 'object' && getType(to) === 'object')) {
      return isEqual(from.props[dataKey], to.props[dataKey]);
    }

    if (from.length !== to.length) {
      return false;
    }

    if ((from[0] && from[0].length === 0) || (to[0] && to[0].length === 0)) {
      return false;
    }

    for (let i = 0; i < from.length; i += 1) {
      if (!isEqual(from[0][i].props[dataKey], to[0][i].props[dataKey])) {
        return false;
      }
    }
    return true;
  }
}
CanvasMarkersLayer.propTypes = {
  children: PropTypes.node,
  options: PropTypes.object,
  onMarkerClick: PropTypes.func,
};
