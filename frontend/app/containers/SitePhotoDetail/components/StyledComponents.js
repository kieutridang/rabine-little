import Link from 'react-router-dom/Link';
import styled from 'styled-components';

export const BackButton = styled(Link)`
  position: relative;
  z-index: 7;

  display: block;
  margin-right: 1.8rem;

  text-decoration: none;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;

  color: inherit;

  &:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.8;
  }

  i {
    margin-right: 0.5rem;
  }
`;

export const MetadataInfo = styled.div`
  display: flex;
  position: relative;
  margin: 0.8rem 0;
  span {
    flex: 2;
    display: flex;
    align-items: center;
    &:last-child {
      flex: 3;
    }
  }
`;

export const CustomCheckboxInput = styled.input`
  position: relative;
  appearance: none;
  width: 1.1rem;
  height: 1.1rem;
  background: hsla(0, 0%, 100%, 1);
  border-radius: 4px;

  transition: background 100ms ease;
  cursor: pointer;

  outline: none;

  &:checked {
    background: hsla(360, 85%, 53%, 1);
    &:after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:after {
    content: '✔';

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;

    color: white;
    transition: all 180ms ease;
    font-size: 0.8125rem;

    opacity: 0;
    transform: scale(2.4);
  }
`;

export const CustomSelect = styled.select`
  display: block;
  width: 100%;
  padding: 0.5rem 0.8rem;

  border: 1px solid hsla(0, 0%, 33%, 1);
  border-radius: 4px;
  background: transparent;

  appearance: none;
`;

export const MapContainer = styled.div`
  display: flex;
  width: 12rem;
  height: 12rem;
  border: 1px solid hsla(0, 0%, 0%, 0.2);

  > div {
    flex: 1;
  }

  iframe + div,
  .leaflet-control-zoominfo.leaflet-bar.leaflet-control,
  .leaflet-control-attribution.leaflet-control {
    opacity: 0 !important;
  }
`;

export const Toggles = styled.div`
  position: absolute;
  top: 5.5rem;
  right: 1.0rem;
  z-index: 5;
`;

export const Controls = styled.div`
  position: absolute;
  top: 4.4rem;
  left: 1.0rem;
  z-index: 5;
`;

export const DefectControls = styled.div`
  margin-top: 0.8rem;
`;

export const DefectControlsHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.4rem 1.0rem;
  background: hsla(0, 0%, 6%, 0.85);
  border: 1px solid hsla(0, 0%, 50%, 0.1);
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 0.9325rem;

  &.active {
    border-radius: 3px 3px 0 0;
    background: hsla(0, 0%, 12%, 0.85);
  }

  .checkbox {
    font-size: 0.8125rem;
    color: hsla(0, 0%, 100%, 0.8);
    text-transform: uppercase;
  }
`;

export const DefectControlsBody = styled.div`
  padding: 0.8rem 1.0rem 0.2rem;
  width: 16rem;
  background: hsla(0, 0%, 0%, 0.85);
`;

export const RepairControls = styled.div`
  margin-top: 0.8rem;
  width: 16rem;
  border: 3px;
`;

export const RepairControlsSelect = styled.div`
  padding: 0.4rem;
  background: hsla(0, 0%, 6%, 0.85);
  border: 1px solid hsla(0, 0%, 50%, 0.1);
  border: 3px 3px 0 0;
  color: white;
  cursor: pointer;

  &.active {
    border-radius: 3px 3px 0 0;
    background: hsla(0, 0%, 12%, 0.85);
  }
`;

export const RepairControlsList = styled.div`
  padding: 0.4rem 0;
  background: hsla(0, 0%, 0%, 0.85);
  color: hsla(0, 0%, 100%, 0.8);
`;

export const RepairControlsListEmpty = styled.div`
  padding: 0.8rem;
  text-align: center;
`;

export const RepairControlsItem = styled.div`
  position: relative;
  padding: 0.5rem 1.0rem;
  transition: all 240ms ease;
  border-bottom: 1px solid hsla(0, 0%, 8%, 1.0);
  &:last-of-type {
    border-bottom: 0;
  }
  &:hover {
    background: hsla(0, 0%, 50%, 0.15);
  }
`;

export const RepairControlsItemTitle = styled.div`
  font-size: 0.9325rem;
  font-weight: 500;
`;

export const RepairControlsItemMeta = styled.div`
  display: flex;
`;

export const RepairControlsItemZone = styled.div`
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

export const RepairControlsItemYear = styled.div`
  font-size: 0.875rem;
`;

export const RepairControlsItemRemoveButton = styled.button`
  display: flex;
  align-items: center;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 4;

  margin: 0;
  padding: 0 0.8rem;

  background: none;
  border: 0;
  color: hsla(0, 0%, 66%, 1.0);

  font-size: 1.1rem;
  font-weight: 800;

  cursor: pointer;

  transition: color 150ms ease;

  &:hover {
    color: hsla(0, 0%, 92%, 1.0);
  }
`;

export const PhotoCarouselWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 6;

  height: 5.8rem;
`;

export const PhotoCarousel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;

  padding: 0 2.6rem;

  white-space: nowrap;

  background: hsla(180, 4%, 11%, 0.4);
  color: white;
`;

export const PhotoCarouselControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  width: 100%;
  height: 100%;

  margin: auto;
  margin-bottom: 0;

  a {
    display: flex;
    align-items: center;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    opacity: 0.8;
    z-index: 9;

    padding: 1.0rem;

    cursor: pointer;
    text-decoration: none;

    background-color: rgb(33, 33, 33, 0.7);
    color: white;

    transition: all 120ms ease;

    &:last-child {
      right: 0;
      left: auto;
    }

    i {
      font-size: 2.0rem;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.2);
      color: white;
      text-decoration: none;
    }
  }

  span {
    font-family: Source Sans Pro;
    font-weight: 600;
    font-size: 20px;
    color: white;
  }
`;

export const PhotoCarouselItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0.4rem;
  cursor: pointer;

  background: hsla(0, 0%, 0%, 0.3);
  transition: all 330ms ease;

  z-index: 1;

  &:hover {
    z-index: 2;
    img {
      transform: scale(1.25);
      border-color: hsla(0, 0%, 0%, 0.2);
    }
    & > span {
      opacity: 0;
    }
  }

  &.active {
    img {
      border-color: hsla(3, 81%, 61%, 1.0);
    }
  }

  img {
    min-width: 9.3rem;
    height: 5.4rem;
    border: 2px solid hsla(0, 0%, 50%, 0.1);
    transition: all 330ms ease;
    transform-origin: 50% 100%;
  }
`;

export const PhotoCarouselItemTitle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.4rem;
  z-index: 3;
  font-size: 0.875rem;
  font-weight: 500;

  opacity: 0.8;

  transition: all 180ms ease;
`;

export const PhotoBar = styled.div`
  display: flex;
  flex-direction: column;;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;

  margin: 0 auto;

  padding: 0 3.8rem 0 1.0rem;

  background: hsla(180, 4%, 0%, 0.6);
  border-radius: 3px;
  color: white;
`;

export const PhotoBarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PhotoBarBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 0.6rem;
`;

export const PhotoBarLabel = styled.div`
  color: hsla(0, 0%, 100%, 0.8);
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export const PhotoBarDate = styled.div`
  margin-left: 2.0rem;
  margin-right: 1.5rem;
`;

export const PhotoBarZone = styled.div`
  margin-right: 1.5rem;
`;

export const PhotoBarDrone = styled.div`
`;

export const TogglesActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.8rem;

  a {
    padding: 0.2rem 0.7rem;
    appearance: none;
    box-shadow: none;
    border: 0;
    color: white;
    transition: all 150ms ease;
    background: hsla(0, 0%, 18%, 1.0);
    border: 1px solid hsl(0, 0%, 0%, 0);
    border-radius: 3px;
    cursor: pointer;

    width: 48%;

    text-transform: uppercase;
    text-decoration: none;
    text-align: center;

    font-size: 0.8125rem;

    letter-spacing: 0.5px;

    &:hover {
      color: white;
      background: hsla(354, 80%, 26%, 0.8);
      border: 1px solid hsl(354, 100%, 56%);
      text-decoration: none;
    }

    &:focus,
    &:active {
      background: hsla(354, 80%, 26%, 0.8);
      border: 1px solid hsl(354, 100%, 56%);
    }
  }
`;

export const PhotoBarTitle = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  pointer-events: none;
`;

export const PhotoBarCaption = styled.div`
  margin-top: 0.2rem;
  font-size: 1.0rem;
  opacity: 0.8;
  span {
    margin: 0 0.4rem;
  }
`;

export const PhotosContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  height: 100%;
  min-height: calc(100vh - 3.5rem);
`;

export const PhotoContainer = styled.div`
  flex: 1;
  display: flex;
  padding: 0;
  height: 100%;
  min-height: calc(100vh - 3.5rem);
`;

export const PhotoView = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  background-color: hsla(0, 0%, 10%, 1.0);
  min-height: calc(100vh - 3.5rem);
`;

export const Input = styled.input`
  display: block;
  width: 100%;

  padding: 0.6rem 0.9rem;
  background: hsla(0, 0%, 0%, 0.0);
  border: 1px solid hsla(0, 0%, 100%, 0.29);
  border-radius: 4px;
  color: hsla(0, 0%, 100%, 0.75);

  &:focus {
    outline: none;
    color: hsla(0, 0%, 100%, 1.0);
    border-color: hsla(0, 0%, 100%, 0.58);
  }

  &:focus {
    & + div {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scaleY(1);
    }
  }
`;

export const StyledSelect = styled.div`
  width: 100%;

  .Select.is-focused > .Select-control {
    background: hsla(0, 0%, 10%, 1.0);
    border: 1px solid hsla(0, 0%, 10%, 0.5);
  }

  .Select-control {
    height: 100%;
    background: hsla(0, 0%, 0%, 1.0);
    border: 1px solid hsla(0, 0%, 100%, 0.15);
    border-radius: 3px;
  }

  .Select-placeholder {
    font-size: 13px;
    letter-spacing: 0.8px;
    color: hsla(0, 0%, 100%, 0.8);
    font-weight: 400;
  }

  .Select-value-label {
    font-size: 13px;
    letter-spacing: 0.8px;
    color: hsla(0, 0%, 100%, 0.8);
  }

  .Select.has-value.Select--single > .Select-control .Select-value .Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label {
    color: hsla(0, 0%, 100%, 0.8);
  }

  .Select-value {
    line-height: 32px !important;
  }

  .Select-menu-outer {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: hsla(0, 0%, 0%, 1.0);
    border: 1px solid hsla(0, 0%, 100%, 0.15);
    border-top-color: hsla(0, 0%, 10%, 0.5);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    margin-top: -1px;
    max-height: 200px;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
  }

  .Select-menu {
    max-height: 198px;
    overflow-y: auto;
  }

  .Select-option {
    box-sizing: border-box;
    background-color: hsla(0, 0%, 0%, 1.0);
    color: hsla(0, 0%, 100%, 0.9);
    cursor: pointer;
    display: block;
    padding: 8px 10px;
  }

  .Select-option:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .Select-option.is-selected {
    background-color: hsla(0, 0%, 10%, 1.0);
    color: hsla(0, 0%, 100%, 0.8);
  }

  .Select-option.is-focused {
    background-color: hsla(0, 0%, 18%, 1.0);
    color: hsla(0, 0%, 100%, 0.8);
  }

  .Select-option.is-disabled {
    color: hsla(0, 0%, 100%, 0.15);
    cursor: default;
  }
`;
