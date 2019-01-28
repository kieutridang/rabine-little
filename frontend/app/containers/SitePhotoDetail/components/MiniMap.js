import React from 'react';
import PropTypes from 'prop-types';
import Map from '../../SiteMapPage/Map';
import Marker from '../../SiteMapPage/Marker';

const MiniMap = (props) => {
  const { center, zoom, marker, onMiniMapZoom, children } = props;
  return (
    <Map center={center} zoom={zoom} onZoom={onMiniMapZoom}>
      { marker && <Marker {...marker} featureId={marker.id} clickable={false} /> }
      { children }
    </Map>
  );
};

MiniMap.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number,
  marker: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  onMiniMapZoom: PropTypes.func,
  children: PropTypes.any,
};

MiniMap.defaultProps = {
  zoom: 20,
};

export default MiniMap;
