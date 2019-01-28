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
import SlidingPane from 'components/SlidePane';
import LoadingIndicator from 'components/LoadingIndicator';

import { makeSelectError, makeSelectClient } from '../../../appSelector/client';
import * as select from '../selector';

import * as actions from '../actions';


import './client.css';

// you will also need the css that comes with bootstrap-daterangepicker

import messages from './messages';
import { Form, Input, InputWrap, ErrorMessage, AddButton } from './StyledComponents';

class ClientEditContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
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

  componentWillMount() {
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.client !== nextProps.client && nextProps.client) {
      this.props.resetForm();
    }
  }

  renderInput = (name, messageLabel, placeHolder) => {
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
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };


  render() {
    const {
      serverError,
      isLoading,
      handleSubmit,
      isOpen,
      closeEdit,
    } = this.props;
    return (
      <SlidingPane
        isOpen={isOpen}
        title="Edit Side"
        onRequestClose={closeEdit}
      >
        <Form onSubmit={handleSubmit}>
          {this.renderInput('name', messages.nameLabel, messages.namePlaceHolder)}
          {this.renderInput('address', messages.addressLabel, messages.addressPlaceHolder)}
          {this.renderInput('contactName', messages.contactLabel, messages.contactPlaceHolder)}
          {this.renderInput('phone', messages.phoneLabel, messages.phonePlaceHolder)}
          {this.renderInput('email', messages.emailLabel, messages.emailPlaceHolder)}
          {this.renderInput('notes', messages.notesLabel, messages.notesPlaceHolder)}

          {serverError &&
            <ErrorMessage align="center"><FormattedMessage {...messages.createClientError} />: {serverError}
            </ErrorMessage>}
          {isLoading && <LoadingIndicator />}
          <AddButton type="submit"><FormattedMessage {...messages.editDetailButton} /></AddButton>
        </Form>
      </SlidingPane>
    );
  }
}

ClientEditContainer.propTypes = {
  isOpen: PropTypes.bool,
  client: PropTypes.object,
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
};


export const mapDispatchToProps = (dispatch) => ({
  // getClientsRequest: (filter) => dispatch(clientActions.getClientsRequest(filter)),
  closeEdit: () => dispatch(actions.closeEdit()),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  client: makeSelectClient(),
  isOpen: select.IsOpen(),
  detailData: select.DetailData(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const createClientFormik = withFormik({
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
      address: detailData.address || '',
      contactName: detailData.contactName || '',
      phone: detailData.phone || '',
      email: detailData.email || '',
      notes: detailData.notes || '',
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_ClientName_Required);
    }
    if (!values.address || values.address.trim() === '') {
      errors.address = values.intl.formatMessage(messages.validationMessage_Address_Required);
    }
    if (!values.contactName || values.contactName.trim() === '') {
      errors.contactName = values.intl.formatMessage(messages.validationMessage_ContactName_Required);
    }
    if (!values.phone || values.phone.trim() === '') {
      errors.phone = values.intl.formatMessage(messages.validationMessage_Phone_Required);
    }
    if (!values.email || values.email.trim() === '') {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_InvalidFormat);
    }
    return errors;
  },

  handleSubmit: (values, config) => {
    const {
      name,
      address,
      contactName,
      phone,
      email,
      notes,
    } = values;

    config.props.editClientRequest({
      name,
      address,
      contactName,
      phone,
      email,
      notes,
    });
  },
});

export default compose(
  injectIntl,
  withConnect,
  createClientFormik,
)(ClientEditContainer);
