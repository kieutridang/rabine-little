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
  allFilesAccepted,
  getDataTransferItems,
} from '../../utils/files/fileUtils';

const StyledDropZoneInput = styled.input`
  display: none;
`;

class Dropzone extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.isFileDialogActive = false;

    this.state = {
      isDragActive: false,
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

    document.body.onfocus = this.onFileDialogCancel;
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
  }

  onFileDialogCancel = () => {
    // timeout will not recognize context of this method
    const { onFileDialogCancel } = this.props;
    // execute the timeout only if the FileDialog is opened in the browser
    if (this.isFileDialogActive) {
      setTimeout(() => {
        if (this.fileInputElement != null) {
          // Returns an object as FileList
          const { files } = this.fileInputElement;

          if (!files.length) {
            this.isFileDialogActive = false;
          }
        }

        if (onFileDialogCancel && typeof onFileDialogCancel === 'function') {
          onFileDialogCancel();
        }
      }, 300);
    }
  }

  onDocumentDrop = (event) => {
    if (this.node && this.node.contains(event.target)) {
      return;
    }
    event.preventDefault();

    this.dragTargets = [];
  }

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
  }

  onFileInputElementClick = (event) => {
    event.stopPropagation();

    if (this.props.onFileInputElementClick) {
      this.props.onFileInputElementClick();
    }
  }

  onDragStart = (event) => {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, event);
    }
  }

  onDragEnter = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (this.dragTargets.indexOf(event.target) === -1) {
      this.dragTargets.push(event.target);

      this.setState({
        isDragActive: true,
        draggedFiles: getDataTransferItems(event),
      });

      if (this.props.onDragEnter) {
        this.props.onDragEnter.call(this, event);
      }
    }
  }

  onDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      event.dataTransfer.dropEffect = this.isFileDialogActive ? 'none' : 'copy'; // eslint-disable-line no-param-reassign
    } catch (error) {
      // eslint-disable-line no-empty
    }

    if (this.props.onDragOver) {
      this.props.onDragOver.call(this, event);
    }

    return false;
  }

  onDragLeave = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.dragTargets = this.dragTargets.filter((target) => target !== event.target && this.node && this.node.contains(target));
    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({
      isDragActive: false,
      draggedFiles: [],
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, event);
    }
  }

  onDrop = (event) => {
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

    const fileList = getDataTransferItems(event);

    const acceptedFiles = [];
    const rejectedFiles = [];

    event.stopPropagation();
    event.preventDefault();

    this.dragTargets = [];
    this.isFileDialogActive = false;

    fileList.forEach((file) => {
      if (!disablePreview) {
        try {
          file.preview = window.URL.createObjectURL(file); // eslint-disable-line no-param-reassign
        } catch (error) {
          // eslint-disable-line no-empty
        }
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
      isDragActive: false,
      draggedFiles: [],
      acceptedFiles: [],
      rejectedFiles: [],
    });
  }

  setRef = (ref) => { this.node = ref; }

  setRefFileInput = (ref) => { this.fileInputElement = ref; }

  checkDisabled = (func) => {
    if (this.props.disabled) {
      return null;
    }

    return func;
  }

  openFileDialog = () => {
    this.isFileDialogActive = true;
    this.fileInputElement.value = null;
    this.fileInputElement.click();
  }

  renderChildren = (children, isDragActive, isDragAccept, isDragReject) => {
    if (typeof children === 'function') {
      return children({
        ...this.state,
        isDragActive,
        isDragAccept,
        isDragReject,
        onDragEnter: this.onDragEnter,
        onDragLeave: this.onDragLeave,
      });
    }
    return children;
  }

  render() {
    const {
      name,
      acceptedFormat,
      disabled,
      multipleFiles,
      children,
    } = this.props;

    const {
      isDragActive,
      draggedFiles,
    } = this.state;

    const filesCount = draggedFiles.length;
    const isMultipleAllowed = multipleFiles || filesCount < 1;
    const isDragAccept = filesCount > 0 || allFilesAccepted(draggedFiles, acceptedFormat);
    const isDragReject = filesCount > 0 && (!isDragAccept || !isMultipleAllowed);

    return (
      <DropzoneWrapper
        onClick={this.onClick}
        onDragStart={this.checkDisabled(this.onDragStart)}
        onDragEnter={this.checkDisabled(this.onDragEnter)}
        onDragOver={this.checkDisabled(this.onDragOver)}
        onDragLeave={this.checkDisabled(this.onDragLeave)}
        onDrop={this.checkDisabled(this.onDrop)}
        aria-disabled={disabled}
        disabled={disabled}
        isDragActive={isDragActive}
        isDragAccept={isDragAccept}
        isDragReject={isDragReject}
      >
        {children && this.renderChildren(children, isDragActive, isDragAccept, isDragReject)}

        <StyledDropZoneInput
          accept={acceptedFormat}
          disabled={disabled}
          type="file"
          autoComplete="off"
          onChange={this.onDrop}
          innerRef={this.setRefFileInput}
          multiple={supportMultiple && multipleFiles}
          name={name && name.length && name}
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
  /**
   * onDragStart: start to create drag event
   */
  onDragStart: PropTypes.func,
  /**
   * onDragEnter: enter drag event, set state
   */
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
  onFileDialogCancel: PropTypes.func,
  children: PropTypes.node,
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
