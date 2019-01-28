import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  ImageContainer,
  ImageWrapper,
  StyledIcon,
  StyledDropzone,
  StyledIconWrapper,
  StyledTextWrapper,
  StyledBrowseFile,
} from './StyledComponents';
import LoadingIndicator from '../../components/LoadingIndicator';
import UploadIcon from '../../images/icons/upload.svg';
import CloseIcon from '../../images/close.png';

class ImageUploader extends Component {
  state = {
  }
  onDrop = (acceptedFiles) => {
    const { onChange } = this.props;
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  };
  onRemove = () => {
    this.props.onDelete();
  }
  render() {
    const { imageFile, isUploading, width, height, hasIcon } = this.props;
    const imgSrc = imageFile;
    if (isUploading) {
      return <LoadingIndicator />;
    }
    return (
      <div>
        {imgSrc ?
          (
            <ImageContainer>
              <ImageWrapper src={imgSrc} alt="empty" />
              <StyledIcon src={CloseIcon} alt="close" onClick={this.onRemove} />
            </ImageContainer>
          )
          : (<StyledDropzone
            accept="image/*"
            onDrop={this.onDrop}
            maxSize={1024 * 1024 * 10}
            multiple={false}
            disablePreview
            width={width}
            height={height}
          >
            { hasIcon && (
              <StyledIconWrapper>
                <UploadIcon width="50px" height="50px" />
              </StyledIconWrapper>
            )}

            <StyledTextWrapper>
              Drag file here to upload or <StyledBrowseFile>Browse file</StyledBrowseFile>
            </StyledTextWrapper>
          </StyledDropzone>
          )
        }
      </div>
    );
  }
}

ImageUploader.propTypes = {
  imageFile: PropTypes.string,
  isUploading: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string,
  hasIcon: PropTypes.bool,
};

ImageUploader.defaultProps = {
  hasIcon: true,
};

const ImageUploaderWrapper = styled(ImageUploader)`
  cursor: pointer;
`;

export default ImageUploaderWrapper;

