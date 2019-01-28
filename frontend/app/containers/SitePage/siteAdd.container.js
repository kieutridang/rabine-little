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

import { makeSelectError, makeSelectSite, makeIsSiteOpen } from '../../appSelector/site';
import { makeGetDronePlans, makeIsLoadingDronePlans } from '../../appSelector/dronePlan';

import { actions } from '../../appReducer/site.reducer';
import RabineDatePicker from '../../components/Date/RabineDatePicker';
import './site.css';

import messages from './messages';
import LoadingIndicator from '../../components/LoadingIndicator';
import SlidingPane from '../../components/SlidePane';
import { Form, Input, InputWrap, ErrorMessage, AddButton, AutosuggestionInput } from './StyledComponents';

import { makeGetClients } from '../../appSelector/client';
import { statusOptions, typeOptions } from '../Common/Options';

import { makeSelectS3Folders } from '../../appSelector/s3';


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
      dronePlansSuggestions: [],
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

    this.onChangeSuggestionValue = (name) => (e, { newValue }) => {
      this.setState({ [name]: newValue });
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
  }

  onRequestClose = () => {
    this.props.showAddSite(false);
  };


  onSuggestionsFetchRequested = (options) => (value) => {
    const suggestions = this.getDronePlansSuggestions(options, value.value);
    this.setState({
      dronePlansSuggestions: suggestions,
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      dronePlansSuggestions: [],
    });
  }

  getDronePlansSuggestions = (options, value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : options.filter((plan) =>
      plan.text.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  getSuggestionValue = (name) => (suggestion) => {
    const { handleChange } = this.props;
    handleChange({ target: { id: name, name, value: suggestion.value }, persist: () => null }); // simulates onchange event to support formik

    return suggestion.text;
  };

  renderSuggestion = (suggestion) => (
    <div id={suggestion.value}>
      { suggestion.text }
    </div>
  );

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
      value: this.state.address || '',
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
        {
          window.google && window.google.maps &&
          <PlacesAutocomplete
            classNames={cssClasses}
            inputProps={inputProps}
          />
        }
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

  renderAutocompleteInput = (name, messageLabel, placeHolder, options) => {
    const {
      values,
      touched,
      errors,
      handleBlur,
      handleChange,
    } = this.props;
    const { dronePlansSuggestions } = this.state;

    const value = values[name];
    const inputProps = {
      value: this.state[name] || '',
      onChange: this.onChangeSuggestionValue(name),
      name,
      id: name,
      onBlur: handleBlur,
      placeholder: placeHolder,
    };

    if (value) {
      const optionSelected = options.find((option) => option.value === value);
      if (optionSelected.text !== this.state[name]) {
        handleChange({ target: { id: name, name, value: null }, persist: () => null }); // simulates onchange event to support formik
      }
    }

    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>
        <AutosuggestionInput
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested(options)}
          inputProps={inputProps}
          renderSuggestion={this.renderSuggestion}
          suggestions={dronePlansSuggestions}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue(name)}
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
      s3Folders,
      clients,
      dronePlans,
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
    dronePlanOptions.unshift({
      text: '',
      value: null,
    });

    const s3FolderOptions = (s3Folders || []).map((i) => ({
      text: i.name,
      value: i.id,
    }));
    s3FolderOptions.unshift({
      text: '',
      value: null,
    });

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Add Site"
        onRequestClose={this.onRequestClose}
      >
        {isLoadingDronePlan ?
          <LoadingIndicator /> : <Form onSubmit={handleSubmit}>
            {this.renderInput('name', messages.nameLabel, messages.namePlaceHolder)}
            {this.renderSelect('clientId', messages.clientLabel, messages.clientLabel, clientOptions)}
            {this.renderAutocompleteInput('dronePlanId', messages.dronePlanLabel, messages.dronePlan, dronePlanOptions)}
            {this.renderSelect('status', messages.statusLabel, messages.statusLabel, statusOptions)}
            {this.renderSelect('rabineS3Folder', messages.s3FolderLabel, messages.s3FolderLabel, s3FolderOptions)}
            {this.renderGoogleInput('address', messages.addressLabel, messages.addressPlaceHolder)}

            {this.renderCalendar('deadline', messages.deadlineLabel, messages.deadlinePlaceHolder)}
            {this.renderSelect('type', messages.typeLabel, messages.typeLabel, typeOptions)}
            {this.renderInput('cost', messages.costLabel, messages.costPlaceHolder)}

            {serverError &&
            <ErrorMessage align="center"><FormattedMessage {...messages.createSiteError} />: {serverError}
            </ErrorMessage>}
            {isLoading && <LoadingIndicator />}
            <AddButton><FormattedMessage {...messages.createSiteButton} /></AddButton>
          </Form>
        }
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
  clearSiteError: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
  dronePlans: PropTypes.arrayOf(PropTypes.object),
  s3Folders: PropTypes.arrayOf(PropTypes.object),
  isLoadingDronePlan: PropTypes.bool,
};


export const mapDispatchToProps = (dispatch) => ({
  addSiteRequest: (site) => dispatch(actions.addSiteRequest(site)),
  showAddSite: (isOpen) => dispatch(actions.showAddSite(isOpen)),
  clearSiteError: () => dispatch(actions.clearSiteError()),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  site: makeSelectSite(),
  isOpen: makeIsSiteOpen(),
  clients: makeGetClients(),
  dronePlans: makeGetDronePlans(),
  s3Folders: makeSelectS3Folders(),
  isLoadingDronePlan: makeIsLoadingDronePlans(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const createSiteFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      name: props.name || '',
      clientId: props.clientId,
      dronePlanId: props.dronePlan,
      status: props.status || statusOptions[0].value,
      address: props.address || '',
      deadline: props.deadline,
      type: props.type || typeOptions[0].value,
      cost: props.cost || '',
      rabineS3Folder: props.rabineS3Folder,
    };

    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_SiteName_Required);
    }

    if (!values.address) {
      errors.address = values.intl.formatMessage(messages.validationMessage_Address_Required);
    }

    return errors;
  },

  handleSubmit: (values, { props: { addSiteRequest } }) => {
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

    const siteRequest = {
      name,
      clientId,
      status,
      address,
      type,
      cost: cost || null,
      dronePlanId: dronePlanId || null,
      rabineS3Folder: rabineS3Folder || null,
    };

    if (deadline) {
      siteRequest.deadline = new Date(deadline);
    }

    addSiteRequest(siteRequest);
  },
});

export default compose(
  injectIntl,
  withConnect,
  createSiteFormik,
)(SiteAddContainer);
