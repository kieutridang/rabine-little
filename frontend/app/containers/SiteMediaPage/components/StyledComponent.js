/* eslint-disable no-mixed-operators */
import styled from 'styled-components';

export const PhotosContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const AreaName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0;
  color: white;
`;

export const AreaImagesCount = styled.p`
  font-size: 12px;
  color: #838383;
  margin-bottom: 0;
`;

export const Areas = styled.div`
  position: fixed;
  top: 3.5rem;
  left: 0;
  bottom: 0;
  z-index: 3;

  width: 300px;

  background-color: #3d3d3d;
  color: white;

  overflow-y: auto;
`;

export const Photos = styled.div`
  flex: 4;
  min-height: calc(100vh - 3.5rem);
  position: relative;
  padding: 1.625rem 4.0rem 1.625rem calc(4.0rem + 300px);
`;

export const AreasHeader = styled.h3`
  font-size: 20px;
  text-align: center;
  letter-spacing: 0.7px;
  padding: 25px;
  font-weight: bold;
  margin-bottom: 0;
`;

export const MediaGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px -18px;
  min-height: 100vh;
  a {
    color: #3d3d3d;
  }
`;

export const MediaItem = styled.div`
  margin: 8px 16px;
  width: 170px;
  .thumbnail {
    width: 100%;
    height: 110px;
    background: #fff;
    background-image: ${(props) => `url(${props.backgroundImage})`};
    background-size: cover;
  }
  .thumbnailVideo {
    width: 100%;
    height: 110px;
    background: #000;
    background-image: ${(props) => `url(${props.backgroundImage})`};
    background-size: cover;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
  p {
    font-weight: bold;
    margin: 10px 0;
    text-align: center;
    word-break: break-all;
  }
`;

export const SyncPhotoStatus = styled.div`
  flex: 1;
  padding: 10px;
  button {
    background: ${(props) => props.total === props.synced && '#28a745'};
  }
  .progress {
    background-color: #e5e9eb;
    height: 4px;
    position: relative;
    width: 100%;
  }
  .progress-bar {
    width: ${(props) => `${props.synced * 100 / props.total}%`};
    background: #28a745;
    background-size: 100% 4px;
    height: 100%;
    position: relative;
  }
`;

export const Header = styled.header`
  display: flex;
`;

export const RepairsToggleButton = styled.button`
  background: hsla(3, 70%, 53%, 1.0);
  padding: 0.3rem 0.6rem;

  text-align: center;

  border: 1px solid hsla(0, 0%, 100%, 0.3);
  border-radius: 4px;
  color: white;

  cursor: pointer;

  &:focus {
    outline: none;
  }
`;
