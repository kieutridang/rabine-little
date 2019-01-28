// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';

// app
import * as actions from '../actions';
import * as select from '../selector';
import HorizontalLinearStepper from '../../../components/Stepper/HorizontalLinearStepper';
import { statusOptions } from '../../Common/Options';

class SiteStatus extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      currentStatus: props.currentStatus,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentStatus,
      isUpdatingStatus,
      updateStatusError,
      isUpdateStatusSuccessfully,
    } = nextProps;

    if (!isUpdatingStatus) {
      if (!updateStatusError && isUpdateStatusSuccessfully && currentStatus !== this.props.currentStatus) {
        this.onSuccess();
      } else if (updateStatusError) {
        this.onError(updateStatusError.error.message);
      }
    }
  }

  onSuccess = () => {
    toast.success('Update successfully!', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  onError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  getLabel = (key) => {
    const index = statusOptions.findIndex((item) => item.value === key);
    if (index !== -1) {
      return statusOptions[index].label;
    }

    return '';
  };

  createSitePayload = (oldStatus, newStatus) => ({
    title: this.getLabel(oldStatus),
    creator: 'Jim Cook',
    notes: `Change status from ${this.getLabel(oldStatus)} to ${this.getLabel(newStatus)}`,
    oldStatus,
    newStatus,
    type: 'status_changed',
  });

  handleUpdateStatus = (payload) => {
    const {
      updateStatus,
    } = this.props;

    if (updateStatus) {
      updateStatus(this.props.siteId, payload);
    }
  }

  render() {
    const {
      currentStatus,
    } = this.props;

    const activeStepIndex = statusOptions.findIndex((item) => item.value === currentStatus);

    return (
      <div>
        <HorizontalLinearStepper
          steps={statusOptions}
          activeStep={activeStepIndex}
          api={this.handleUpdateStatus}
          createPayload={this.createSitePayload}
        />
      </div>
    );
  }
}

SiteStatus.propTypes = {
  siteId: PropTypes.string,
  currentStatus: PropTypes.string,
  updateStatus: PropTypes.func,
  isUpdatingStatus: PropTypes.bool,
  updateStatusError: PropTypes.object,
  isUpdateStatusSuccessfully: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isUpdatingStatus: select.IsUpdatingStatus(),
  updateStatusError: select.UpdateStatusError(),
  isUpdateStatusSuccessfully: select.IsUpdateStatusSuccessfully(),
});

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (siteId, payload) => dispatch(actions.updateSiteStatus(siteId, payload)),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRedux,
)(SiteStatus);
