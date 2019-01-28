import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { compose } from 'redux';
import moment from 'moment';

import RabineDatePicker from 'components/Date/RabineDatePicker';
import LoadingIndicator from 'components/LoadingIndicator';
import { InputWrap, ErrorMessage, Input, Form, AddButton, FormRow, FormColumn, TextArea, MapContainer, Label, Checkbox } from '.';
import Attachment from './Attachment';
import Map from '../../SiteMapPage/Map';
import CheckboxIcon from '../../../images/icons/fill_checkbox.svg';
import SquareFeet from './SquareFeet';

class FlightInstructionsForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.onDateChange = (name) => (value) => {
      this.props.values[name] = value;
      const newState = {};
      newState[name] = value;

      this.setState(newState);
    };
  }

  renderCalendar = (name, messageLabel, placeHolder) => {
    const {
      touched,
      errors,
      values,
    } = this.props;
    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          {messageLabel}
        </label>
        <RabineDatePicker
          displayFormat="YYYY-MM-DD"
          placeholder={placeHolder}
          id={`${name}`}
          date={moment(values[name])}
          onDateChange={this.onDateChange(name)}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderInput = (name, messageLabel, placeHolder, disabled = false) => {
    const {
      values,
      touched,
      errors,
      handleBlur,
    } = this.props;
    const { handleChange } = disabled ? () => {} : this.props;
    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          {messageLabel}
        </label>
        <Input
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={placeHolder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          disabled={disabled}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderTextArea = (name, messageLabel, placeHolder, disabled = false) => {
    const {
      values,
      touched,
      errors,
      handleBlur,
    } = this.props;
    const { handleChange } = disabled ? () => {} : this.props;
    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          {messageLabel}
        </label>
        <TextArea
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={placeHolder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          disabled={disabled}
          rows={10}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderErrorMessage = () => {
    const { serverError } = this.props;

    if (serverError) {
      return (
        <ErrorMessage align="center">
          Error: {serverError}
        </ErrorMessage>
      );
    }

    return null;
  };

  render() {
    const {
      handleSubmit,
      isLoading,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormColumn hasMargin>
            {this.renderInput('email', 'RECIPIENT EMAIL', 'Enter Email')}
          </FormColumn>
          <FormColumn hasMargin>
            {this.renderCalendar('deadline', 'DEADLINE', 'Select Date')}
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn>
            {this.renderTextArea('notes', 'NOTES/FLIGHT INSTRUCTION', 'Enter Notes')}
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn>
            <Attachment />
          </FormColumn>
        </FormRow>

        <FormRow margin="1rem 2rem 0 2rem">
          <Label
            control={
              <Checkbox
                name="checkType"
                id="checkType"
                checkedIcon={<CheckboxIcon />}
              />
            }
            label="Boundaries need approval"
          />

          <SquareFeet />
        </FormRow>

        <FormRow margin="0.5rem 2rem 1rem 2rem">
          <FormColumn>
            <MapContainer>
              <Map zoom={20} center={[36.778259, -119.417931]} />
            </MapContainer>
          </FormColumn>
        </FormRow>

        <FormRow>
          {this.renderErrorMessage()}
          {isLoading && <LoadingIndicator />}
          <AddButton type="submit">SEND</AddButton>
        </FormRow>
      </Form>
    );
  }
}


const createFlightInstructionFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const initialState = {
      // form
      email: props.email || '',
      deadline: props.deadline,
      notes: props.notes,
    };
    return initialState;
  },

  validate: () => { // values
    const errors = {};

    return errors;
  },

  handleSubmit: (values, { props: { editFlightRequest } }) => {
    const {
      email,
      deadline,
      notes,
    } = values;

    const flightRequest = {
      email,
      deadline,
      notes,
    };

    editFlightRequest(flightRequest);
  },
});

FlightInstructionsForm.propTypes = {
  handleSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  serverError: PropTypes.string,
};

export default compose(
  createFlightInstructionFormik,
)(FlightInstructionsForm);
