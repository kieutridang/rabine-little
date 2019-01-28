// vendor
import React from 'react';
import styled from 'styled-components';

// app
import Box from '../Box';
import UploadIcon from '../../images/icons/upload.svg';


const StyledIconWrapper = styled.div`
  color: #ed2324;
  fill: #ed2324;
  width: 60px;
  height: 60px;
  vertical-align: middle;
`;

const StyledTextWrapper = styled.div`
  font-size: 18px;
  text-align: center;
  color: #323232;
  width: 177px;
  height: 46px;
`;

const StyledBrowseFile = styled.span`
  font-weight: 600;
  color: #ed2324;
`;

const DropzoneContent = () => (
  <Box
    direction="column"
    alignItems="center"
    justifyContent="center"
    onDragLeave={(event) => { event.preventDefault(); event.stopPropagation(); }}
  >
    <StyledIconWrapper>
      <UploadIcon width="60px" height="60px" />
    </StyledIconWrapper>

    <StyledTextWrapper>
      Drag file here to upload or <StyledBrowseFile>Browse file</StyledBrowseFile>
    </StyledTextWrapper>
  </Box>
);

export default DropzoneContent;
