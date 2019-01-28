import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { GoogleLayer } from '../../components/react-leaflet-google';


const key = 'AIzaSyD87n8n4JOtijIIgBDsmyeS94F4nBEGQpg';
const satellite = 'SATELLITE';

const GoogleLayerComponent = (props) => {
  const { children, center, zoom, zoomControl, zoomInfoControl, maxZoom, onZoom } = props;

  const handleZoom = (viewport) => {
    if (onZoom) {
      onZoom(viewport.zoom);
    }
  };

  return (
    <Map
      center={center}
      zoom={zoom}
      zoomInfoControl={zoomInfoControl}
      zoomControl={zoomControl}
      maxZoom={maxZoom}
      onViewportChanged={handleZoom}
      preferCanvas
    >
      <GoogleLayer googlekey={key} maptype={satellite} maxZoom={maxZoom} libraries={['places']} />
      {children}
    </Map>
  );
};

GoogleLayerComponent.defaultProps = {
  zoom: 18,
  zoomInfoControl: true,
  zoomControl: false,
  maxZoom: 25,
  zoomDelta: 2,
  zoomSnap: 2,
};

GoogleLayerComponent.propTypes = {
  children: PropTypes.any.isRequired,
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  zoomControl: PropTypes.bool.isRequired,
  maxZoom: PropTypes.number.isRequired,
  zoomInfoControl: PropTypes.bool.isRequired,
  onZoom: PropTypes.func,
};

export default GoogleLayerComponent;
