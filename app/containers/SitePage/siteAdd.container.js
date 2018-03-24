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
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { makeSelectError, makeSelectSite, makeIsSiteOpen } from '../../appSelector/site';
import { makeGetDronePlans } from '../../appSelector/dronePlan';

import { actions } from '../../appReducer/site.reducer';
import { actions as dronePlanActions } from '../../appReducer/dronePlan.reducer';

import RabineDatePicker from '../../components/Date/RabineDatePicker';

import './site.css';

// you will also need the css that comes with bootstrap-daterangepicker

import messages from './messages';
import LoadingIndicator from '../../components/LoadingIndicator';
import SlidingPane from '../../components/SlidePane';
import { Form, Input, InputWrap, ErrorMessage, AddButton } from './StyledComponents';

import { actions as clientActions } from '../../appReducer/client.reducer';
import { makeGetClients } from '../../appSelector/client';

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

const cssClasses = {
  input: 'Demo__search-input',
  autocompleteContainer: 'Demo__autocomplete-container',
};

class SiteAddContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
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
    this.props.getClientsRequest();
    this.props.getDronePlansRequest();
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.site !== nextProps.site && nextProps.site) {
      this.props.resetForm();
    }
  }

  renderCalendar = (name, messageLabel, placeHolder) => {
    const {
      intl,
      touched,
      errors,
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
          onDateChange={this.onStateChange(name)}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

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

  renderGoogleInput = (name, messageLabel, placeHolder) => {
    const {
      intl,
      touched,
      errors,
    } = this.props;

    const inputProps = {
      type: 'text',
      value: this.state.address,
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
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>

        <select
          name={`${name}`}
          id={`${name}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
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
      value: i.id,
    }));
    clientOptions.unshift({
      text: '',
      value: null,
    });

    const dronePlanOptions = (this.props.dronePlans || []).map((i) => ({
      text: i.name,
      value: i.id,
    }));
    dronePlanOptions.unshift({
      text: '',
      value: null,
    });

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Add Site"
        onRequestClose={() => showAddSite(false)}
      >
        <Form onSubmit={handleSubmit}>
          {this.renderInput('name', messages.nameLabel, messages.namePlaceHolder)}
          {this.renderSelect('clientId', messages.clientLabel, messages.clientLabel, clientOptions)}
          {this.renderSelect('dronePlanId', messages.dronePlanLabel, messages.dronePlanLabel, dronePlanOptions)}
          {this.renderSelect('status', messages.statusLabel, messages.statusLabel, statusOptions)}
          {this.renderGoogleInput('address', messages.addressLabel, messages.addressPlaceHolder)}

          {this.renderCalendar('deadline', messages.deadlineLabel, messages.deadlinePlaceHolder)}
          {this.renderSelect('type', messages.typeLabel, messages.typeLabel, typeOptions)}
          {this.renderInput('cost', messages.costLabel, messages.costPlaceHolder)}
          {this.renderInput('notes', messages.notesLabel, messages.notesPlaceHolder)}

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
  getDronePlansRequest: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
  dronePlans: PropTypes.arrayOf(PropTypes.object),
};


export const mapDispatchToProps = (dispatch) => ({
  addSiteRequest: (site) => dispatch(actions.addSiteRequest(site)),
  showAddSite: (isOpen) => dispatch(actions.showAddSite(isOpen)),
  getClientsRequest: (filter) => dispatch(clientActions.getClientsRequest(filter)),
  getDronePlansRequest: () => dispatch(dronePlanActions.getDronePlansRequest()),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  site: makeSelectSite(),
  isOpen: makeIsSiteOpen(),
  clients: makeGetClients(),
  dronePlans: makeGetDronePlans(),
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
      dronePlanId: props.dronePlan || '123',
      status: props.status || statusOptions[0].value,
      address: props.address || '',
      deadline: props.deadline || '',
      notes: props.notes || '',
      type: props.type || typeOptions[0].value,
      cost: props.cost || '',
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

  handleSubmit: (values, { props: { addSiteRequest } }) => {
    geocodeByAddress(values.address)
      .then((results) => getLatLng(results[0]))
      .then((location) => {
        const { lat, lng } = location;

        const {
          name,
          clientId,
          status,
          address,
          deadline,
          notes,
          type,
          cost,
          dronePlanId,
        } = values;

        addSiteRequest({
          name,
          clientId,
          status,
          address,
          location: {
            lat,
            lng,
          },
          deadline: new Date(deadline),
          notes,
          type,
          cost,
          dronePlanId,
        });
      })
      .catch((error) => console.error('Error', error));
  },
});

export default compose(
  injectIntl,
  withConnect,
  createSiteFormik,
)(SiteAddContainer);
