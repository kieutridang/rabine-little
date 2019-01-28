import styled from 'styled-components';
import Dropzone from 'react-dropzone';

export const StyledIconWrapper = styled.div`
  color: #ed2324;
  fill: #ed2324;
  width: 60px;
  height: 60px;
  vertical-align: middle;
`;

export const StyledTextWrapper = styled.div`
  font-size: 13px;
  text-align: center;
  color: #323232;
  width: 177px;
  height: 46px;
`;

export const StyledBrowseFile = styled.span`
  font-weight: 600;
  color: #ed2324;
  cursor: pointer;
`;

export const ImageWrapper = styled.img`
  object-fit: cover;
  width: 175px;
  height: 175px;
  border-radius: 10px;
  border: 2px #dfdfdf dashed;
  border-radius: 10px;
`;

export const ImageContainer = styled.div`
  text-align: left;
`;

export const StyledDropzone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.width || '175px'};
  height: ${(p) => p.height || '175px'};
  border: 2px #dfdfdf dashed;
  border-radius: 10px;
`;

export const StyledIcon = styled.img`
  width: 15px;
  height: 15px;
  position: relative;
  top: -90px;
  right: 5px;
  cursor: pointer;
`;
