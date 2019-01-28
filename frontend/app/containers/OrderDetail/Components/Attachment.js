import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';

import AttachmentIcon from '../../../images/icons/attachment.svg';
import { getDataTransferItems, fileAccepted } from '../../../utils/files/fileUtils';

const StyledAttachmentWrapper = styled.div`
  color: #56b7e2;
  cursor: pointer;
  svg {
    fill: #56b7e2;
    color: #56b7e2;
    margin-right: 0.5rem;
  }
`;

const StyledAttachmentInput = styled.input`
  display: none;
`;

class Attachment extends Component {
  state = {
    selectedFile: '',
  }

  setRefFileInput = (ref) => { this.fileInputElement = ref; }

  handleClickAttachment = () => {
    this.fileInputElement.value = null;
    this.fileInputElement.click();
  }

  handleAttachFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = getDataTransferItems(event);
    const { acceptedFormat } = this.props;

    if (fileList && fileList.length) {
      const file = _.head(fileList);
      try {
        file.preview = window.URL.createObjectURL(file); // eslint-disable-line no-param-reassign
      } catch (error) {
        // eslint-disable-line no-empty
      }
      if (fileAccepted(file, acceptedFormat)) {
        this.setState({ selectedFile: file.name });
      }
    }
  }

  render() {
    const { selectedFile } = this.state;

    return (
      <StyledAttachmentWrapper onClick={this.handleClickAttachment}>
        <AttachmentIcon width={16} height={16} />
        { selectedFile || 'Attach file' }
        <StyledAttachmentInput
          accept="image/jpeg,image/gif,image/png,application/pdf"
          type="file"
          autoComplete="off"
          onChange={this.handleAttachFile}
          innerRef={this.setRefFileInput}
          multiple={false}
          name={name}
        />
      </StyledAttachmentWrapper>
    );
  }
}

Attachment.propTypes = {
  acceptedFormat: PropTypes.string,
};

Attachment.defaultProps = {
  acceptedFormat: '.jpeg,.gif,.png,.pdf,.jpg',
};

export default Attachment;
