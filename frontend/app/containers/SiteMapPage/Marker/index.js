import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Marker, Popup } from 'react-leaflet';

import Icon from './Icon';
import PopupForm from './Popup';

const StyledPopup = styled(Popup)`
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: hsla(0, 0%, 0%, 0.75);
    -webkit-backdrop-filter: saturate(150%) blur(12px);
  }
`;

const MarkerComponent = (props = {}) => (
  <Marker key={props.featureId} position={props.position} icon={Icon}>
    {props.clickable && (
      <StyledPopup position={props.position}>
        <PopupForm {...props} />
      </StyledPopup>
    )}
  </Marker>
);

MarkerComponent.propTypes = {
  featureId: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
  clickable: PropTypes.bool,
};
MarkerComponent.defaultProps = {
  clickable: true,
};

export default MarkerComponent;
