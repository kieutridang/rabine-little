import React from 'react';
import PropTypes from 'prop-types';
import Box from '../Box';

const ProgressBar = (props) => {
  const {
    percent = 0,
  } = props;

  return (
    <Box>
      <Box
        fill="horizontal"
        height="7px"
        borderRadius="7.5px"
        background={{
          color: '#ededed',
        }}
      >
        <Box
          fill="all"
          borderRadius="7.5px"
          width={`${percent}%`}
          background={{
            color: '#ed2324',
          }}
        />
      </Box>
    </Box>
  );
};

ProgressBar.propTypes = {
  percent: PropTypes.number,
};

export default ProgressBar;
