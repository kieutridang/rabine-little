/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
// vendor
import React from 'react';
import Modal from 'react-modal';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';

import RabineDatePicker from 'components/Date/RabineDatePicker';
import SlidingPane from 'components/SlidePane';
import LoadingIndicator from 'components/LoadingIndicator';

import { makeSelectError, makeSelectSite } from '../../../appSelector/site';
import { makeIsLoadingDronePlans } from '../../../appSelector/dronePlan';

import * as select from '../selector';
import * as actions from '../actions';


import './site.css';

// you will also need the css that comes with bootstrap-daterangepicker

import messages from './messages';
import { Form, Input, InputWrap, ErrorMessage, AddButton } from './StyledComponents';

import { statusOptions, typeOptions } from '../../Common/Options';

const cssClasses = {
  input: 'Demo__search-input',
  autocompleteContainer: 'Demo__autocomplete-container',
};

class SiteEditContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
      values: {},
    };
    this.onChange = (address) => {
      this.props.values.address = address;
      this.setState({ address });
    };

    this.onStateChange = (name) => (value) => {
      this.props.values[name] = value;
      const newState = {};
      newState[name] = value;

      this.setState(newState);
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    this.props.clearSiteError();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.site !== nextProps.site && nextProps.site) {
      this.props.resetForm();
    }
    if (!nextProps.isOpen && this.props.isOpen) {
      this.props.handleReset();
    }
  }

  requestCloseHandler = () => {
    const { handleReset, closeEdit } = this.props;
    closeEdit();
    handleReset();
  };

  renderCalendar = (name, messageLabel, placeHolder) => {
    const {
      intl,
      touched,
      errors,
      values,
    } = this.props;
    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>
        <RabineDatePicker
          displayFormat="YYYY-MM-DD"
          placeholder={intl.formatMessage(placeHolder)}
          id={`${name}`}
          date={moment(values[name])}
          onDateChange={this.onStateChange(name)}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderInput = (name, messageLabel, placeHolder, disabled = false) => {
    const {
      values,
      intl,
      touched,
      errors,
      handleBlur,
    } = this.props;
    const { handleChange } = disabled ? () => {} : this.props;
    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>
        <Input
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={intl.formatMessage(placeHolder)}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          disabled={disabled}

        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderGoogleInput = (name, messageLabel, placeHolder) => {
    const {
      intl,
      touched,
      errors,
      values,
    } = this.props;

    const inputProps = {
      type: 'text',
      value: values[name],
      onChange: this.onChange,
      placeholder: intl.formatMessage(placeHolder),
      name,
      id: name,
    };

    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>
        <PlacesAutocomplete
          classNames={cssClasses}
          inputProps={inputProps}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderSelect = (name, messageLabel, placeHolder, options = []) => {
    const {
      values,
      intl,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;
    return (
      <InputWrap>
        <label htmlFor={`${name}`} >
          <FormattedMessage {...messageLabel} />
        </label>

        <select
          name={`${name}`}
          id={`${name}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name] || ''}
          placeholder={intl.formatMessage(placeHolder)}
        >
          {
            options.map(({ text, value }) => <option key={value} value={value}>{text}</option>)
          }
        </select>
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderErrorMessage = () => {
    const { serverError } = this.props;

    if (serverError) {
      return (
        <ErrorMessage align="center">
          <FormattedMessage {...messages.createSiteError} />: {serverError}
        </ErrorMessage>
      );
    }

    return null;
  };

  render() {
    const {
      isLoading,
      handleSubmit,
      isOpen,
      s3Folders,
      clients,
      dronePlans,
      detailData,
      isLoadingDronePlan,
    } = this.props;

    const clientOptions = (clients || []).map((i) => ({
      text: i.name,
      value: i.id,
    }));
    clientOptions.unshift({
      text: '',
      value: null,
    });

    const dronePlanOptions = (dronePlans || []).map((i) => ({
      text: i.name,
      value: i.id,
    }));

    if (dronePlans && detailData && detailData.dronePlanId) {
      dronePlanOptions.unshift({
        text: this.props.detailData.dronePlanName,
        value: this.props.detailData.dronePlanId,
      });
    }
    dronePlanOptions.unshift({
      text: '',
      value: null,
    });

    const s3FolderOptions = (s3Folders || []).map((i) => ({
      text: i.name,
      value: i.id,
    }));

    if (s3FolderOptions && detailData && detailData.rabineS3Folder) {
      s3FolderOptions.unshift({
        text: detailData.rabineS3Folder,
        value: detailData.rabineS3Folder,
      });
    }

    s3FolderOptions.unshift({
      text: '',
      value: null,
    });

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Edit Site"
        onRequestClose={this.requestCloseHandler}
      >
        {
          isLoadingDronePlan ? <LoadingIndicator /> :
          <Form onSubmit={handleSubmit}>
            {this.renderInput('name', messages.nameLabel, messages.namePlaceHolder)}
            {this.renderSelect('clientId', messages.clientLabel, messages.clientLabel, clientOptions)}
            {this.renderSelect('dronePlanId', messages.dronePlanLabel, messages.dronePlanLabel, dronePlanOptions)}
            {this.renderSelect('status', messages.statusLabel, messages.statusLabel, statusOptions)}
            {this.renderSelect('rabineS3Folder', messages.s3FolderLabel, messages.s3FolderLabel, s3FolderOptions)}
            {this.renderGoogleInput('address', messages.addressLabel, messages.addressPlaceHolder)}

            {this.renderCalendar('deadline', messages.deadlineLabel, messages.deadlinePlaceHolder)}
            {this.renderSelect('type', messages.typeLabel, messages.typeLabel, typeOptions)}
            {this.renderInput('cost', messages.costLabel, messages.costPlaceHolder)}
            {this.renderErrorMessage()}
            {isLoading && <LoadingIndicator />}
            <AddButton type="submit"><FormattedMessage {...messages.editDetailButton} /></AddButton>
          </Form>
        }
      </SlidingPane>
    );
  }
}

SiteEditContainer.propTypes = {
  isOpen: PropTypes.bool,
  site: PropTypes.object,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  intl: PropTypes.object,
  serverError: PropTypes.string,
  isLoading: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  resetForm: PropTypes.func,
  closeEdit: PropTypes.func,
  clearSiteError: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
  dronePlans: PropTypes.arrayOf(PropTypes.object),
  s3Folders: PropTypes.arrayOf(PropTypes.object),
  detailData: PropTypes.object,
  handleReset: PropTypes.func,
  isLoadingDronePlan: PropTypes.bool,
};


export const mapDispatchToProps = (dispatch) => ({
  clearSiteError: () => dispatch(actions.clearSiteError()),
  closeEdit: () => dispatch(actions.closeEdit()),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  site: makeSelectSite(),
  isOpen: select.IsOpen(),
  detailData: select.DetailData(),
  isLoadingDronePlan: makeIsLoadingDronePlans(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const createSiteFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const detailData = props.detailData;
    // let clientId;
    // if (props && props.clients && detailData) {
    //   clientId = props.clients.find((client) => client.name === detailData.clientName);
    // }
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      name: detailData.name || '',
      clientId: detailData.clientId,
      dronePlanId: detailData.dronePlanId,
      status: detailData.status || statusOptions[0].value,
      address: detailData.address || '',
      deadline: detailData.deadline,
      type: detailData.type || typeOptions[0].value,
      cost: detailData.cost,
      rabineS3Folder: detailData.rabineS3Folder,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_SiteName_Required);
    }
    if (!values.address || values.address.trim() === '') {
      errors.address = values.intl.formatMessage(messages.validationMessage_Address_Required);
    }

    return errors;
  },

  handleSubmit: (values, { props: { editSiteRequest, dronePlans, detailData } }) => {
    const {
      name,
      clientId,
      status,
      address,
      deadline,
      type,
      cost,
      dronePlanId,
      rabineS3Folder,
    } = values;

    const getDronePlanName = () => {
      if (detailData && detailData.dronePlanId && detailData.dronePlanId === dronePlanId) {
        return detailData.dronePlanName;
      }

      if (dronePlans && dronePlans.length) {
        const index = dronePlans.findIndex((plan) => plan.id === dronePlanId);
        return index === -1 ? null : dronePlans[index].name;
      }

      return null;
    };

    const siteRequest = {
      name,
      clientId,
      status,
      address,
      type,
      cost,
      dronePlanId: dronePlanId || null,
      dronePlanName: getDronePlanName(),
      rabineS3Folder: rabineS3Folder || null,
    };

    if (cost) {
      siteRequest.cost = cost;
    }

    if (deadline) {
      siteRequest.deadline = new Date(deadline);
    }

    editSiteRequest(siteRequest);
  },
});

export default compose(
  injectIntl,
  withConnect,
  createSiteFormik,
)(SiteEditContainer);
