// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Papa from 'papaparse';
import moment from 'moment';

// app
import Box from '../Box';
import ProgressBar from './ProgressBar';
import ProgressStatus from './ProgressStatus';
import ProgressPercentage from './ProgressPercentage';
import ProgressFileName from './ProgressFileName';
import ProgressImage from './ProgressImage';
import DownloadLink from './DownloadLink';

const StyledMessage = styled(Box) `
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  color: #323232;
`;

class Progress extends React.Component {
  renderMessage = () => {
    const {
      finished,
      succeeded,
      importing,
      successNumber,
      failureNumber,
      errorMessage,
      name,
    } = this.props;

    if (importing) {
      return 'Importing...';
    } else if (finished && succeeded) {
      return `${successNumber} ${name} successfully imported`;
    } else if (finished && !succeeded) {
      return errorMessage || `${successNumber} ${name} successfully imported, ${failureNumber} ${name} failed`;
    }

    return '';
  }

  renderDownloadLink = () => {
    const {
      finished,
      succeeded,
      importing,
      resultData,
    } = this.props;

    if (!importing && finished && !succeeded) {
      const data = Papa.unparse(resultData);
      const timeinmillis = moment(new Date()).valueOf();
      return (
        <DownloadLink
          data={data}
          fileName={`error_${timeinmillis}.csv`}
          label="error download"
        />
      );
    }

    return null;
  }

  render() {
    const {
      fileName,
      finished,
      succeeded,
      importing,
      percent,
    } = this.props;

    return (
      <Box fill="horizontal" margin={{ bottom: '1.25rem' }}>
        <Box fill="horizontal" direction="row" height="2.3125rem">
          <ProgressImage />

          <Box fill="all" direction="column">
            <Box direction="row" justifyContent="between" margin={{ bottom: '0.375rem' }}>
              <ProgressFileName fileName={fileName} />
              <ProgressPercentage percent={percent} />
            </Box>

            <Box>
              <ProgressBar percent={percent} />
            </Box>
          </Box>

          <Box width="1.4375rem" height="2.3125rem" margin={{ left: '0.75rem' }} alignItems="center" justifyContent="center">
            <ProgressStatus importing={importing} finished={finished} succeeded={succeeded} />
          </Box>
        </Box>

        <StyledMessage direction="row" fill="horizontal" justifyContent="between" height="1.0625rem" margin={{ top: '0.75rem' }}>
          {
            this.renderMessage()
          }
          {
            this.renderDownloadLink()
          }
        </StyledMessage>
      </Box>
    );
  }
}

Progress.propTypes = {
  fileName: PropTypes.string,
  name: PropTypes.string,
  finished: PropTypes.bool,
  succeeded: PropTypes.bool,
  importing: PropTypes.bool,
  percent: PropTypes.number,
  successNumber: PropTypes.number,
  failureNumber: PropTypes.number,
  errorMessage: PropTypes.string,
  resultData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

Progress.defaultProps = {
  finished: false,
  succeeded: false,
  importing: false,
  percent: 0,
  successNumber: 0,
  failureNumber: 0,
  errorMessage: '',
};

export default Progress;
