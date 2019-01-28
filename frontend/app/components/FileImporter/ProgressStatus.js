import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

import OkIcon from '../../images/icons/ok.svg';
import CancelIcon from '../../images/icons/cancel.svg';

const ProgressStatus = ({ importing = false, finished = false, succeeded = false }) => {
  if (importing) {
    return <Spinner name="circle" />;
  } else if (finished && succeeded) {
    return <OkIcon width="16px" height="16px" />;
  } else if (finished && !succeeded) {
    return <CancelIcon width="16px" height="16px" />;
  }

  return <div></div>;
};

ProgressStatus.propTypes = {
  importing: PropTypes.bool,
  finished: PropTypes.bool,
  succeeded: PropTypes.bool,
};

export default ProgressStatus;
