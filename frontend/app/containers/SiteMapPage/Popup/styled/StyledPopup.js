import styled from 'styled-components';
import { Popup } from 'react-leaflet';

export const StyledPopup = styled(Popup)`
  transition: none !important;

  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: ${(props) => props.info ? 'hsla(0, 0%, 0%, 0.75)' : 'hsla(0, 0%, 100%, 100%)'};
    -webkit-backdrop-filter: saturate(150%) blur(12px);
  }
  .leaflet-popup-content-wrapper {
    width: ${(props) => props.info ? '17rem' : '22rem'};
    padding: 0.3rem;
  }
`;
