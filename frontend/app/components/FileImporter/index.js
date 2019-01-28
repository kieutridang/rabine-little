// vendor
import React from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import PropTypes from 'prop-types';

// app
import Box from '../Box';
import DropzoneMessage from './DropzoneMessage';
import Dropzone from './Dropzone';
import DropzoneContent from './DropzoneContent';
import Progress from './Progress';
import DownloadLink from './DownloadLink';
import objectUtils from '../../utils/object/objectUtils';

export const ImportButton = styled.button`
  background: #EA272E;
  width: 100%;
  color: #FFFFFF;
  font-size: 16px;
  border-radius: 3px;
  padding: 10px 0;
  cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
  text-transform: uppercase;
  ${(props) => props.disabled && `
    opacity: 0.5;
  `}
`;

// TODO: validate available data: clients, drone deploy plan, s3 folders
class FileImporter extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      progress: [],
      errorMessages: [],
      dropzoneDisabled: false,
      buttonDisabled: false,
    };

    this.clearProperties();
  }

  componentWillUnmount() {
    this.clearProperties();
  }

  handleDrop = (acceptedFiles, rejectedFiles) => {
    this.clearStates();
    this.clearProperties();

    if (rejectedFiles && rejectedFiles.length > 0) {
      this.handleRejectedFiles(rejectedFiles);
    } else if (acceptedFiles && acceptedFiles.length > 0) {
      this.handleAcceptedFiles(acceptedFiles);
    }
  }

  handleAcceptedFiles = (acceptedFiles) => {
    this.clearStates();

    acceptedFiles.forEach((file) => {
      Papa.parse(file, {
        error: (error, errorFile) => this.handleParsingError(error, errorFile),
        complete: (results) => this.handlePrepareData(file, results),
        header: true,
        skipEmptyLines: true,
      });
    });
  }

  handlePrepareData = (file, results) => {
    const data = results.data;
    const errors = results.errors;
    const fileName = file.name;
    const progressAttrs = {
      finished: false,
      succeeded: false,
      importing: false,
      percent: 0,
      successNumber: 0,
      failureNumber: 0,
      errorMessage: '',
      key: fileName,
      fileName,
    };

    if (data && data.length === 0) {
      this.handleParsingError({ message: 'no data' }, fileName);
    } else if (errors && errors.length > 0) {
      // TODO: export error CSV file
      this.handleParsingError({ message: 'there was (an) error(s) in CSV data' }, fileName);
    } else if (!this.isValidHeaders(data)) {
      // TODO: export error CSV file
      this.handleParsingError({ message: 'Invalid headers' }, fileName);
    } else {
      this.handleConvertData(fileName, data);
      this.handleAddProgress(progressAttrs);
    }
  }

  handleConvertData = (fileName, data) => {
    const { templates } = this.props;

    const availableData = objectUtils.getAvailableData(templates);
    const convertedData = data
      .map((obj) => {
        const replaceObj = objectUtils.replaceByTemplateData(obj, availableData);
        return objectUtils.replaceKeysByTemplates({ ...obj, ...replaceObj }, templates);
      });
    this.parsedData.push({ [fileName]: convertedData });
  }

  handleAddProgress = (progressAttrs) => {
    this.setState(
      (prevState) => ({ progress: [...prevState.progress, progressAttrs] }));
  }

  handleParsingError = (error, fileName) => {
    this.setState(
      (prevState) => ({ errorMessages: [...prevState.errorMessages, `${fileName} has error(s): ${error.message}`] }));
  }

  isValidHeaders = (data) => {
    const { templates } = this.props;

    const firstRow = data[0];
    const headers = Object.keys(firstRow);
    const templateHeaders = Object.keys(templates);
    const checkedHeaders = headers.filter((header) => templateHeaders.indexOf(header) !== -1);
    return checkedHeaders.length === headers.length;
  }

  clearStates = () => this.setState(() => ({ progress: [], errorMessages: [] }));
  clearProperties = () => { this.nodes = []; this.parsedData = []; };

  handleRejectedFiles = (rejectedFiles) => {
    const errorMessages = [];
    rejectedFiles.forEach((file) => errorMessages.push(`${file.name} must be CSV file and not over 10MB`));
    this.setState(() => ({ errorMessages }));
  }

  handleImport = () => {
    const {
      dropzoneDisabled,
      buttonDisabled,
    } = this.state;

    if (!dropzoneDisabled) this.handleDisableDropzone();
    if (!buttonDisabled) this.handleDisableButton();

    const importData = [...this.parsedData];
    this.handleParsedDataImport(importData);
  }

  handleParsedDataImport = (data) => {
    const {
      onFinish,
    } = this.props;

    const fileData = data.shift();
    const key = Object.keys(fileData)[0];
    const values = fileData[key];

    this.handleBatchingImport(key, values)
      .then((results) => this.handleFinishOneFile(key, true, results))
      .catch((errors) => this.handleFinishOneFile(key, false, errors))
      .finally(() => {
        if (data.length) {
          this.handleParsedDataImport(data);
        } else {
          this.handleEnableButton();
          this.handleEnableDropzone();
          if (onFinish) onFinish();
        }
      });
  }

  handleBatchingImport = (fileName, data) => {
    const {
      batchSize,
      action,
    } = this.props;

    const importData = [...data];
    const total = importData.length;
    const that = this;
    let completedNo = 0;

    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];

      function handleData() {
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
            completedNo += batchData.length;
            const percent = parseFloat(Math.round((completedNo / total) * 100).toFixed(0));
            const successNumber = results.length * batchSize;
            const failureNumber = errors.length * batchSize;
            const importing = true;

            that.updateProgress(fileName, { importing, percent, successNumber, failureNumber, fileName });

            handleData();
          });
      }
      handleData();
    });
  }

  updateProgress = (key, data) => {
    const {
      progress,
    } = this.state;

    const newState = [...progress];
    const index = progress.findIndex((item) => item.fileName === key);
    const replacedData = { ...newState[index], ...data };
    newState.splice(index, 1, replacedData);

    this.setState((prevState) => ({ progress: [...prevState, ...newState] }));
  }

  handleFinishOneFile = (key, succeeded, resultData) => {
    this.updateProgress(key, { succeeded, importing: false, finished: true, resultData });
  }

  handleEnableDropzone = () => {
    this.setState(() => ({ dropzoneDisabled: false }));
  }

  handleDisableDropzone = () => {
    this.setState(() => ({ dropzoneDisabled: true }));
  }

  handleEnableButton = () => {
    this.setState(() => ({ buttonDisabled: false }));
  }

  handleDisableButton = () => {
    this.setState(() => ({ buttonDisabled: true }));
  }

  handleAddRefNode = (node) => { this.nodes.push(node); };

  renderTemplateLink = () => {
    const { templateFile } = this.props;
    const data = Papa.unparse(templateFile);
    return (
      <DownloadLink
        data={data}
        fileName="template.csv"
        label="Download Template"
      />
    );
  }

  render() {
    const {
      progress,
      dropzoneDisabled,
      buttonDisabled,
      errorMessages,
    } = this.state;

    const {
      acceptedFormat,
      name,
    } = this.props;

    return (
      <Box fill="all" direction="column">
        <Dropzone acceptedFormat={acceptedFormat} onDrop={this.handleDrop} disabled={dropzoneDisabled}>
          <DropzoneContent />
        </Dropzone>

        {
          this.renderTemplateLink()
        }

        {
          errorMessages.length > 0
          && errorMessages.map(
            (message, index) => <DropzoneMessage key={`message_${index}`} message={message} /> // eslint-disable-line react/no-array-index-key
          )
        }

        <Box fill="horizontal" direction="column" margin={{ top: '2.625rem' }} >
          {
            progress && !!progress.length
            && progress.map((item) => <Progress {...item} name={name} />)
          }

          <ImportButton onClick={this.handleImport} disabled={!this.parsedData.length || buttonDisabled}>
            {`ADD ${name}`}
          </ImportButton>
        </Box>
      </Box>
    );
  }
}

FileImporter.propTypes = {
  name: PropTypes.string.isRequired,
  acceptedFormat: PropTypes.string,
  templates: PropTypes.object.isRequired,
  templateFile: PropTypes.array,
  batchSize: PropTypes.number,
  action: PropTypes.func,
  onFinish: PropTypes.func,
};

FileImporter.defaultProps = {
  name: 'records',
  acceptedFormat: '.csv',
  batchSize: 1,
  templateFile: [],
};

export default FileImporter;
