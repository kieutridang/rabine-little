import React from 'react';
import PropTypes from 'prop-types';

import Box from '../Box';
import Dropzone from './Dropzone';
import DropzoneContent from './DropzoneContent';
import DropzoneMessage from './DropzoneMessage';


class ImageImporter extends React.Component {

  state = {
    errorMessages: [],
  };

  componentWillUnmount() {
    this.clearProperties();
  }

  clearStates = () => {
    this.setState(() => ({ progress: [], errorMessages: [] }));
  };

  clearProperties = () => {
    this.nodes = [];
    this.parsedData = [];
  };

  handleDrop = (acceptedFiles, rejectedFiles) => {
    this.clearStates();
    this.clearProperties();

    if (rejectedFiles && rejectedFiles.length > 0) {
      this.handleRejectedFiles(rejectedFiles);
    } else if (acceptedFiles && acceptedFiles.length > 0) {
      this.handleAcceptedFiles(acceptedFiles);
    }
  };

  handleRejectedFiles = (rejectedFiles) => {
    const errorMessages = rejectedFiles.map((file) =>
      errorMessages.push(`${file.name} must be PNG, JPG or SVG file and not over 10MB`)
    );

    this.setState(() => ({ errorMessages }));
  };

  handleAcceptedFiles = (acceptedFiles) => {
    this.clearStates();
    this.props.handleFile(acceptedFiles);
  };

  handleImport = () => {
    const { dropzoneDisabled, buttonDisabled } = this.state;

    if (!dropzoneDisabled) this.handleDisableDropzone();
    if (!buttonDisabled) this.handleDisableButton();

    const importData = [...this.parsedData];

    this.handleParsedDataImport(importData);
  };

  handleParsedDataImport = (data) => {
    const { onFinish } = this.props;
    const fileData = data.shift();
    const key = Object.keys(fileData)[0];
    const values = fileData[key];

    this.handleBatchingImport(key, values)
      .then((results) => this.handleFinishOneFile(key, true, results))
      .catch((errors) => this.handleFinishOneFile(key, false, errors))
      .finally(() => {
        if (data.length) {
          this.handleParsedDataImport(data);
          return;
        }

        this.handleEnableButton();
        this.handleEnableDropzone();

        if (onFinish) onFinish();
      });
  };

  handleBatchingImport = (fileName, data) => {
    const { batchSize, action } = this.props;
    const importData = [...data];
    const total = importData.length;

    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];

      const handleData = (completedNo) => {
        if (importData.length === 0) {
          if (errors.length > 0) reject(errors);
          resolve(results);
          return;
        }

        const batchData = importData.length > batchSize
          ? importData.splice(0, batchSize)
          : importData.splice(0, importData.length);

        action(batchData)
          .then((result) => results.push({ ...result }))
          .catch((error) => batchData.forEach((dt) => errors.push({ ...dt, error: error.error.message })))
          .finally(() => {
            const currentNo = completedNo + batchData.length;
            const percent = parseFloat(Math.round((completedNo / total) * 100).toFixed(0));
            const successNumber = results.length * batchSize;
            const failureNumber = errors.length * batchSize;
            const importing = true;

            this.updateProgress(fileName, { importing, percent, successNumber, failureNumber, fileName });

            handleData(currentNo);
          });
      };

      handleData(0);
    });
  };

  handleFinishOneFile = (key, succeeded, resultData) => {
    this.updateProgress(key, { succeeded, importing: false, finished: true, resultData });
  };

  handleEnableDropzone = () => {
    this.setState(() => ({ dropzoneDisabled: false }));
  };

  handleDisableDropzone = () => {
    this.setState(() => ({ dropzoneDisabled: true }));
  };

  handleEnableButton = () => {
    this.setState(() => ({ buttonDisabled: false }));
  };

  handleDisableButton = () => {
    this.setState(() => ({ buttonDisabled: true }));
  };

  render() {
    const { errorMessages } = this.state;
    const { acceptedFormat, containerHeight, containerWidth } = this.props;

    return (
      <Box direction="column">
        <Dropzone
          acceptedFormat={acceptedFormat}
          onDrop={this.handleDrop}
          containerHeight={containerHeight}
          containerWidth={containerWidth}
        >
          <DropzoneContent />
        </Dropzone>
        {
          errorMessages.length > 0 &&
          errorMessages.map((message, index) => <DropzoneMessage key={`message_${index}`} message={message} />) // eslint-disable-line react/no-array-index-key
        }
      </Box>
    );
  }
}

ImageImporter.propTypes = {
  containerHeight: PropTypes.number,
  containerWidth: PropTypes.number,
  acceptedFormat: PropTypes.string.isRequired,
  handleFile: PropTypes.func.isRequired,
  batchSize: PropTypes.number,
  action: PropTypes.func,
  onFinish: PropTypes.func,
};

ImageImporter.defaultProps = {
  name: 'records',
  acceptedFormat: '.jpg, .png, .svg',
  batchSize: 1,
  templateFile: [],
  containerHeight: 200,
  containerWidth: 200,
};

export default ImageImporter;
