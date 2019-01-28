// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import SlidingPane from '../../components/SlidePane';
import RabineSingleDatePicker from '../../components/Date/SingleDatePicker';

const DashboardAddSite = (props) => {
  const {
    isOpen,
    onRequestClose,
  } = props;

  return (
    <SlidingPane
      isOpen={isOpen}
      title="Add Site"
      onRequestClose={onRequestClose}
    >
      <RabineSingleDatePicker
        block
        showClearDate
        label="DEADLINE"
      />
    </SlidingPane>
  );
};

DashboardAddSite.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default DashboardAddSite;
