// vendor
import React from 'react';
import Modal from 'react-modal';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectError, makeSelectClient, makeIsClientOpen } from './client.selectors';
import messages from './messages';
import LoadingIndicator from '../../components/LoadingIndicator';
import SlidingPane from '../../components/SlidePane';
import { Form, Input, InputWrap, ErrorMessage, AddButton } from './StyledComponents';

import { actions } from './client.reducer';

class ClientAddContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.client !== nextProps.client && nextProps.client) {
      this.props.resetForm();
    }
  }

  render() {
    const {
      serverError,
      isLoading,
      values,
      intl,
      touched,
      errors,
      handleSubmit,
      handleChange,
      handleBlur,
      isOpen,
      showAddClient,
    } = this.props;

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Add Client"
        onRequestClose={() => showAddClient(false)}
      >
        <Form onSubmit={handleSubmit}>
          <InputWrap>
            <label htmlFor="name">
              <FormattedMessage {...messages.clientNameLabel} />
              <Input
                name="name"
                id="name"
                type="text"
                placeholder={intl.formatMessage(messages.clientNamePlaceHolder)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {touched.name && errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </label>
          </InputWrap>

          <InputWrap>
            <label htmlFor="address">
              <FormattedMessage {...messages.addressLabel} />
              <Input
                name="address"
                id="address"
                type="text"
                placeholder={intl.formatMessage(messages.addressPlaceHolder)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
              />
              {touched.address && errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </label>
          </InputWrap>

          <InputWrap>
            <label htmlFor="contactName">
              <FormattedMessage {...messages.contactNameLabel} />
              <Input
                name="contactName"
                id="contactName"
                type="text"
                placeholder={intl.formatMessage(messages.contactNamePlaceHolder)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contactName}
              />
              {touched.contactName && errors.contactName && <ErrorMessage>{errors.contactName}</ErrorMessage>}
            </label>
          </InputWrap>

          <InputWrap>
            <label htmlFor="phone">
              <FormattedMessage {...messages.phoneLabel} />
              <Input
                name="phone"
                id="phone"
                type="text"
                placeholder={intl.formatMessage(messages.phonePlaceHolder)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
              />
              {touched.phone && errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </label>
          </InputWrap>

          <InputWrap>
            <label htmlFor="email">
              <FormattedMessage {...messages.emailLabel} />
              <Input
                name="email"
                id="email"
                type="text"
                placeholder={intl.formatMessage(messages.emailPlaceHolder)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </label>
          </InputWrap>

          <InputWrap>
            <label htmlFor="notes">
              <FormattedMessage {...messages.notesLabel} />
              <Input
                name="notes"
                id="notes"
                placeholder={intl.formatMessage(messages.notesPlaceHolder)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.notes}
              />
              {touched.notes && errors.notes && <ErrorMessage>{errors.notes}</ErrorMessage>}
            </label>
          </InputWrap>

          {serverError &&
          <ErrorMessage align="center"><FormattedMessage {...messages.createClientError} />: {serverError}
          </ErrorMessage>}
          {isLoading && <LoadingIndicator />}
          <AddButton><FormattedMessage {...messages.createClientButton} /></AddButton>
        </Form>
      </SlidingPane>
    );
  }
}

ClientAddContainer.propTypes = {
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
  showAddClient: PropTypes.func,
};


export const mapDispatchToProps = (dispatch) => ({
  addClientRequest: (client) => dispatch(actions.addClientRequest(client)),
  showAddClient: (isOpen) => dispatch(actions.showAddClient(isOpen)),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  client: makeSelectClient(),
  isOpen: makeIsClientOpen(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const createClientFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      name: props.name || '',
      address: props.address || '',
      contactName: props.contactName || '',
      phone: props.phone || '',
      email: props.email || '',
      notes: props.notes || '',

      // appRedux, appRedux-saga
      addClientRequest: props.addClientRequest,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_ClientName_Required);
    }
    if (!values.email || values.email.trim() === '') {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_Required);
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_InvalidFormat);
    }
    if (!values.phone) {
      errors.phone = values.intl.formatMessage(messages.validationMessage_Phone_Required);
    }

    return errors;
  },

  handleSubmit: (values) => {
    const {
      name,
      address,
      contactName,
      phone,
      email,
      notes,
      addClientRequest,
    } = values;

    addClientRequest({
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
)(ClientAddContainer);
