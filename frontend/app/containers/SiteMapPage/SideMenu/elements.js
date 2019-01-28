import styled from 'styled-components';
import MuiCloseIcon from '@material-ui/icons/Close';

export const SideMenuHeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.15);
  padding: 0 1.5rem;
  height: 54px;
`;

export const SideMenuHeader = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SideMenuHeaderLeft = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SideMenuHeaderRight = styled.div`
  width: 1rem;
  height: 100%;
`;

export const SideMenuHeaderItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0;
  height: 100%;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 120ms ease;
  color: hsla(0, 0%, 100%, 0.5);
  cursor: pointer;

  padding-top: 2px;
  border-bottom: solid 2px transparent;
  white-space: nowrap;

  &.active {
    color: hsla(0, 0%, 100%, 1.0);
    border-bottom: solid 2px hsla(3, 70%, 53%, 1.0);;
  }
`;

export const SideMenuHeaderItemIndicator = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 50%;
  height: 2px;
  background: hsla(3, 70%, 53%, 1.0);
  transform: translateX(0);
  transition: all 240ms ease;
  &.comments {
    transform: translateX(100%);
  }
`;

export const CloseIcon = styled(MuiCloseIcon)`
  color: white;
  opacity: 0.5;
`;

export const SideMenuContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
  pointer-events: auto;
`;

export const SideMenuImageContentContainer = styled.div`
  width: 100%;
  min-height: 288px;
  padding: 1rem 1.5rem;
  
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .no-image {
    background: #fff;
    background-image: ${(props) => `url(${props.imgSrc})`};
    background-size: cover;
  }
`;

export const SideMenuInfoContentContainer = styled.div`
  width: 100%;
  padding: 1rem 1.5rem;
`;

export const SideMenuImage = styled.div`
  width: 320px;
  height: 240px;
  position: relative;

  background: #fff;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
`;

export const SideMenuImageZoomButton = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 10px;
  right: 10px;
  background: black;
  cursor: pointer;
  border: solid 1px #ffffff;
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SideMenuZoomImageContainer = styled.div`
  background: #fff;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
`;

export const SideMenuImageSliderIndicator = styled.div`
  min-height: 48px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

export const SideMenuImageSliderItem = styled.div`
  position: relative;
  overflow: hidden;
  display: block;
  margin-bottom: 10px;
  &.hide {
    display: none;
  }
`;

export const SideMenuImageCounter = styled.p`
  color: hsla(0, 0%, 100%, 1.0);
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  width: 100px;
  margin: 0 auto;
  line-height: 48px;
`;
