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
import { FormControl } from 'react-bootstrap';

import './site.css';

// you will also need the css that comes with bootstrap-daterangepicker


import { makeSelectError, makeSelectSite, makeIsSiteOpen } from './site.selectors';
import messages from './messages';
import LoadingIndicator from '../../components/LoadingIndicator';
import SlidingPane from '../../components/SlidePane';
import { Form, Input, InputWrap, ErrorMessage, AddButton } from './StyledComponents';

import { actions } from './site.reducer';
import { actions as clientActions } from '../ClientPage/client.reducer';
import { makeGetClients } from '../ClientPage/client.selectors';

const typeOptions = [
  {
    value: 'Pavement',
    text: 'Paving',
  },
  {
    value: 'Roof',
    text: 'Roof',
  },
  {
    value: 'Other',
    text: 'Other',
  },
];

const statusOptions = [
  {
    value: 'Order_Created',
    text: 'Order Created',
  },
  {
    value: 'Flight_Instructions_Sent',
    text: 'Flight Instructions Sent',
  },
  {
    value: 'Zone_Map_Created',
    text: 'Zone Map Created',
  },
  {
    value: 'Drone_Confirmed',
    text: 'Drone Confirmed',
  },
  {
    value: 'Flight_Completed',
    text: 'Flight Completed',
  },
  {
    value: 'Defect_Detection',
    text: 'Defect Detection',
  },
  {
    value: 'Ready_For_Review',
    text: 'Ready For Review',
  },
  {
    value: 'In_Process',
    text: 'In Process',
  },
  {
    value: 'Repair_Map_Complete',
    text: 'Repair Map Complete',
  },
];

class SiteAddContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
    };
  }

  componentWillMount() {
    this.props.getClientsRequest();
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.site !== nextProps.site && nextProps.site) {
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
        </label>
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
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />

          <FormControl
            name={`${name}`}
            id={`${name}`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values[name]}
            componentClass="select"
            placeholder={intl.formatMessage(placeHolder)}
          >
            {
              options.map(({ text, value }) => <option key={value} value={value}>{text}</option>)
            }
          </FormControl>

          {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
        </label>
      </InputWrap>
    );
  };

  render() {
    const {
      serverError,
      isLoading,
      handleSubmit,
      isOpen,
      showAddSite,
    } = this.props;
    const clientOptions = (this.props.clients || []).map((i) => ({
      text: i.name,
      value: i._id, // eslint-disable-line no-underscore-dangle
    }));
    return (
      <SlidingPane
        isOpen={isOpen}
        title="Add Site"
        onRequestClose={() => showAddSite(false)}
      >
        <Form onSubmit={handleSubmit}>
          { this.renderInput('name', messages.nameLabel, messages.namePlaceHolder) }
          { this.renderSelect('clientId', messages.clientLabel, messages.clientLabel, clientOptions) }
          { this.renderSelect('dronePlan', messages.dronePlanLabel, messages.dronePlanLabel) }
          { this.renderSelect('status', messages.statusLabel, messages.statusLabel, statusOptions) }
          { this.renderInput('address', messages.addressLabel, messages.addressPlaceHolder) }
          { this.renderInput('deadline', messages.deadlineLabel, messages.deadlineLabel) }
          { this.renderSelect('type', messages.typeLabel, messages.typeLabel, typeOptions) }
          { this.renderInput('cost', messages.costLabel, messages.costPlaceHolder) }
          { this.renderInput('notes', messages.notesLabel, messages.notesPlaceHolder) }

          {serverError &&
          <ErrorMessage align="center"><FormattedMessage {...messages.createSiteError} />: {serverError}
          </ErrorMessage>}
          {isLoading && <LoadingIndicator />}
          <AddButton><FormattedMessage {...messages.createSiteButton} /></AddButton>
        </Form>
      </SlidingPane>
    );
  }
}

SiteAddContainer.propTypes = {
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
  showAddSite: PropTypes.func,
  getClientsRequest: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
};


export const mapDispatchToProps = (dispatch) => ({
  addSiteRequest: (site) => dispatch(actions.addSiteRequest(site)),
  showAddSite: (isOpen) => dispatch(actions.showAddSite(isOpen)),
  getClientsRequest: (filter) => dispatch(clientActions.getClientsRequest(filter)),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  site: makeSelectSite(),
  isOpen: makeIsSiteOpen(),
  clients: makeGetClients(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const createSiteFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      name: props.name || '',
      clientId: props.clientId || '',
      dronePlan: props.dronePlan || '123',
      status: props.status || '',
      address: props.address || '',
      deadline: props.deadline || '',
      notes: props.notes || '',
      type: props.type || '',
      cost: props.cost || '',

      // appRedux, appRedux-saga
      addSiteRequest: props.addSiteRequest,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_SiteName_Required);
    }
    if (!values.clientId || values.clientId.trim() === '') {
      errors.clientId = values.intl.formatMessage(messages.validationMessage_Client_Required);
    }
    if (!values.cost) {
      errors.phone = values.intl.formatMessage(messages.validationMessage_Cost_Required);
    }

    return errors;
  },

  handleSubmit: (values) => {
    const {
      name,
      clientId,
      status,
      address,
      deadline,
      notes,
      type,
      cost,
      addSiteRequest,
    } = values;

    addSiteRequest({
      name,
      clientId,
      status,
      address,
      deadline: new Date(deadline),
      notes,
      type,
      cost,
      droneCost: 20,
      sqFoot: 10,
      dronePartnerId: '5aa657341a8d0566dc31e375',
    });
  },
});

export default compose(
  injectIntl,
  withConnect,
  createSiteFormik,
)(SiteAddContainer);
