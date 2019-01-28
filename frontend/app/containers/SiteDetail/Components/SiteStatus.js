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
import { statusOptions } from '../../Common/Options';
import HorizontalLinearStepper from '../../../components/Stepper/HorizontalLinearStepper';

class SiteStatus extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {
      showSiteStatusMsg,
      updateStatusError,
    } = nextProps;

    if (showSiteStatusMsg) {
      if (updateStatusError) {
        this.onError(updateStatusError.message);
      } else {
        this.onSuccess();
      }
    }
  }

  onSuccess = () => {
    toast.success('Update successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500,
    });
  }

  onError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500,
    });
  }

  getLabel = (key) => {
    const index = statusOptions.findIndex((item) => item.value === key);
    if (index !== -1) {
      return statusOptions[index].text;
    }

    return '';
  }

  createSitePayload = (oldStatus, newStatus) => ({
    title: this.getLabel(oldStatus),
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
  showSiteStatusMsg: PropTypes.bool,
  updateStatusError: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  updateStatusError: select.UpdateStatusError(),
  showSiteStatusMsg: select.ShowSiteStatusMsg(),
  currentStatus: select.siteStatus(),
});

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (siteId, payload) => dispatch(actions.updateSiteStatus(siteId, payload)),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRedux,
)(SiteStatus);
