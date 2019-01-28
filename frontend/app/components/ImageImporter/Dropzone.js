// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// app
import DropzoneWrapper from './DropzoneWrapper';
import {
  fileAccepted,
  fileMatchSize,
  supportMultiple,
  getDataTransferItems,
  dragChecking,
} from '../../utils/files/fileUtils';

const StyledDropZoneInput = styled.input`
  display: none;
`;

class Dropzone extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.isFileDialogActive = false;

    this.state = {
      isDraggingFile: false,
      draggedFiles: [],
      acceptedFiles: [],
      rejectedFiles: [],
    };
  }

  componentDidMount() {
    this.dragTargets = [];

    const { preventDropFileOnDocument } = this.props;

    if (preventDropFileOnDocument) {
      document.addEventListener('dragover', this.onDocumentDragOver, false);
      document.addEventListener('drop', this.onDocumentDrop, false);
    }

    if (this.fileInputElement != null) {
      this.fileInputElement.addEventListener('click', this.onFileInputElementClick, false);
    }
  }

  componentWillUnmount() {
    const { preventDropFileOnDocument } = this.props;
    if (preventDropFileOnDocument) {
      document.removeEventListener('dragover', this.onDocumentDragOver);
      document.removeEventListener('drop', this.onDocumentDrop);
    }

    if (this.fileInputElement != null) {
      this.fileInputElement.removeEventListener('click', this.onFileInputElementClick);
    }

    if (document != null) {
      document.body.onfocus = null;
    }
  }

  onDocumentDragOver = (event) => {
    event.preventDefault();
  };

  onDocumentDrop = (event) => {
    event.preventDefault();

    this.dragTargets = [];
  };

  onClick = (event) => {
    const { onClick, disableClick } = this.props;

    if (disableClick) {
      return;
    }

    event.stopPropagation();
    if (onClick) {
      onClick.call(this, event);
    }

    this.openFileDialog();
  };

  onFileInputElementClick = (event) => {
    event.stopPropagation();

    if (this.props.onFileInputElementClick) {
      this.props.onFileInputElementClick();
    }
  };

  onDragStart = (event) => {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, event);
    }
  };

  onDragEnter = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (this.dragTargets.indexOf(event.target) === -1) {
      this.dragTargets.push(event.target);

      this.setState({
        isDraggingFile: true,
        draggedFiles: getDataTransferItems(event),
      });

      if (this.props.onDragEnter) {
        this.props.onDragEnter.call(this, event);
      }
    }
  };

  onDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (this.props.onDragOver) {
      this.props.onDragOver.call(this, event);
    }

    return false;
  };

  onDragLeave = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.dragTargets = this.dragTargets.filter((target) => target !== event.target);

    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({
      isDraggingFile: false,
      draggedFiles: [],
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, event);
    }
  };

  onFilesDrop = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const {
      onDrop,
      onDropAccepted,
      onDropRejected,
      multipleFiles,
      disablePreview,
      acceptedFormat,
      minSize,
      maxSize,
    } = this.props;

    const acceptedFiles = [];
    const rejectedFiles = [];
    const fileList = getDataTransferItems(event);

    this.dragTargets = [];
    this.isFileDialogActive = false;

    fileList.forEach((file, index) => {
      if (!disablePreview) {
        fileList[index].preview = window.URL.createObjectURL(file);
      }

      if (fileAccepted(file, acceptedFormat) && fileMatchSize(file, minSize, maxSize)) {
        acceptedFiles.push(file);
      } else {
        rejectedFiles.push(file);
      }
    });

    if (!multipleFiles) {
      rejectedFiles.push(...acceptedFiles.slice(1));
    }

    if (onDrop) {
      onDrop.call(this, acceptedFiles, rejectedFiles, event);
    }

    if (onDropAccepted) {
      onDropAccepted.call(this, acceptedFiles, event);
    }

    if (onDropRejected) {
      onDropRejected.call(this, rejectedFiles, event);
    }

    this.draggedFiles = null;

    this.setState({
      isDraggingFile: false,
      draggedFiles: [],
      acceptedFiles: [],
      rejectedFiles: [],
    });
  };

  setRefFileInput = (ref) => { this.fileInputElement = ref; }

  checkDisabled = (func) => {
    if (this.props.disabled) {
      return null;
    }

    return func;
  };

  openFileDialog = () => {
    this.isFileDialogActive = true;
    this.fileInputElement.value = null;
    this.fileInputElement.click();
  };

  renderChildren = (children, isDraggingFile, isDragAccept, isDragReject) => {
    if (typeof children === 'function') {
      return children({
        isDraggingFile,
        isDragAccept,
        isDragReject,
        onDragEnter: this.onDragEnter,
        onDragLeave: this.onDragLeave,
      });
    }
    return children;
  };

  render() {
    const {
      name,
      acceptedFormat,
      disabled,
      multipleFiles,
      children,
      containerWidth,
      containerHeight,
    } = this.props;

    const {
      isDraggingFile,
      draggedFiles,
    } = this.state;

    const { isDragAccept, isDragReject } = dragChecking(draggedFiles, acceptedFormat, multipleFiles);

    return (
      <DropzoneWrapper
        onClick={this.onClick}
        onDragStart={this.checkDisabled(this.onDragStart)}
        onDragEnter={this.checkDisabled(this.onDragEnter)}
        onDragOver={this.checkDisabled(this.onDragOver)}
        onDragLeave={this.checkDisabled(this.onDragLeave)}
        onDrop={this.checkDisabled(this.onFilesDrop)}
        aria-disabled={disabled}
        disabled={disabled}
        isDraggingFile={isDraggingFile}
        isDragAccept={isDragAccept}
        isDragReject={isDragReject}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      >
        {children && this.renderChildren(children, isDraggingFile, isDragAccept, isDragReject)}

        <StyledDropZoneInput
          accept={acceptedFormat}
          disabled={disabled}
          type="file"
          autoComplete="off"
          onChange={this.onFilesDrop}
          innerRef={this.setRefFileInput}
          multiple={supportMultiple && multipleFiles}
          name={name && name.length}
        />
      </DropzoneWrapper>
    );
  }
}

Dropzone.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  disableClick: PropTypes.bool,
  onFileInputElementClick: PropTypes.func,
  preventDropFileOnDocument: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  multipleFiles: PropTypes.bool,
  disablePreview: PropTypes.bool,
  acceptedFormat: PropTypes.string,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  children: PropTypes.node,
  containerHeight: PropTypes.number,
  containerWidth: PropTypes.number,
};

Dropzone.defaultProps = {
  preventDropFileOnDocument: true,
  disabled: false,
  disablePreview: false,
  disableClick: false,
  multipleFiles: true,
  maxSize: Infinity,
  minSize: 0,
};

export default Dropzone;
