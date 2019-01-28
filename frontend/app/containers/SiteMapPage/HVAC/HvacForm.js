import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import { StyledForm } from '../SidebarStyledComponents/StyledForm';
import { ErrorMessage } from '../SidebarStyledComponents/FormInput';
import FormRow from '../SidebarStyledComponents/FormRow';
import { FormButton } from '../SidebarStyledComponents/FormButton';
import { FormSubtitle } from '../SidebarStyledComponents/FormSubtitle';
import InventoryFields from './HvacFormInventoryFields';
import InventoryCostFields from './HvacFormInventoryCostFields';
import CustomIcon from '../../../components/LeafletInventoryItems/plugin/CustomMarkerStyled';

class HvacForm extends React.Component {
  state = initialState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.hvacValues) {
      const hvacValues = cloneDeep(nextProps.hvacValues);
      const hvacId = hvacValues._id;

      delete hvacValues.geojson;
      delete hvacValues._id; // eslint-disable-line
      delete hvacValues.id;
      delete hvacValues.layerType;
      delete hvacValues.siteId;

      const newFormState = cloneDeep(initialState.form);

      Object.keys(hvacValues).forEach((value) => {
        if (value === 'unitType') {
          newFormState[value].value = JSON.stringify(hvacValues[value]);
        } else {
          newFormState[value].value = hvacValues[value];
        }
        newFormState[value].pristine = false;
      });

      this.setState({
        form: newFormState,
        hvacId,
      });
    } else if (this.state.hvacId) {
      this.setState(initialState);
    }
  }

  handleChangeValue = (evt) => {
    const formFieldName = evt.target.name;
    let fieldValue = '';

    if (evt.target.rawValue) {
      fieldValue = evt.target.rawValue.substr(1);
    } else {
      fieldValue = evt.target.value;
    }

    if (formFieldName === 'unitNumber') {
      this.changeLayerContent(fieldValue);
    }

    if (formFieldName === 'unitType' && fieldValue) {
      this.changeLayerColor(fieldValue);
    }

    const clonedForm = cloneDeep(this.state.form);
    clonedForm[formFieldName].pristine = false;
    clonedForm[formFieldName].value = fieldValue;

    this.setState({ form: clonedForm });
  };

  handleTouchValue = (evt) => {
    const fieldName = evt.target.name;
    const clonedForm = cloneDeep(this.state.form);
    clonedForm[fieldName].pristine = false;

    this.setState({ form: clonedForm });
  };

  checkValidity = (form) => {
    let isValid = true;

    Object.keys(form).forEach((key) => {
      if (form[key].error || form[key].pristine || form[key].value === '') {
        isValid = false;
      }
    });

    return isValid;
  };

  handleChangeManufactureDate = (date) => {
    const clonedForm = cloneDeep(this.state.form);
    clonedForm.manufactureDate.value = date;
    clonedForm.manufactureDate.pristine = false;

    this.setState({ form: clonedForm });
  };

  changeLayerContent = (content) => {
    const { createdLayer } = this.props;

    createdLayer.setTooltipContent(content || 'Unit Number');
  };

  changeLayerColor = (value) => {
    const { createdLayer } = this.props;
    const layerType = createdLayer.layerType;
    const color = JSON.parse(value).color;

    if (layerType === 'marker') {
      createdLayer.setIcon(CustomIcon(color));
    } else {
      createdLayer.setStyle({ color });
    }
  };

  submitValues = (e) => {
    e.preventDefault();

    const { handleSaveHVAC } = this.props;
    const clonedForm = cloneDeep(this.state.form);
    const isValid = this.checkValidity(clonedForm);

    if (isValid) {
      handleSaveHVAC(clonedForm);

      this.setState({ formError: null, form: initialState.form });
    } else {
      this.setState({ formError: 'All fields are required for saving the HVAC' });
    }
  };

  render() {
    const { formError, hvacId } = this.state;
    const { handleDeleteHvac } = this.props;
    const clonedForm = cloneDeep(this.state.form);

    return (
      <StyledForm>
        <InventoryFields
          handleChangeValue={this.handleChangeValue}
          handleTouchValue={this.handleTouchValue}
          handleChangeManufactureDate={this.handleChangeManufactureDate}
          formValues={clonedForm}
        />
        <FormRow>
          <FormSubtitle hasMargin>
            <div>Unit Cost</div>
          </FormSubtitle>
        </FormRow>
        <InventoryCostFields
          handleChangeValue={this.handleChangeValue}
          handleTouchValue={this.handleTouchValue}
          formValues={clonedForm}
        />
        <ErrorMessage>{ formError }</ErrorMessage>
        <FormRow lrMargin>
          { !hvacId && <FormButton fullWidth height="2.5rem" onClick={this.submitValues}> SAVE </FormButton> }
          { hvacId && <FormButton fullWidth height="2.5rem" onClick={this.submitValues}> UPDATE </FormButton> }
          { hvacId && <FormButton fullWidth height="2.5rem" onClick={handleDeleteHvac} className="secondary"> DELETE </FormButton> }
        </FormRow>
      </StyledForm>
    );
  }
}

const initialState = {
  form: {
    unitNumber: {
      value: '',
      error: null,
      pristine: true,
    },
    unitType: {
      value: '',
      error: null,
      pristine: true,
    },
    modelNumber: {
      value: '',
      error: null,
      pristine: true,
    },
    serialNumber: {
      value: '',
      error: null,
      pristine: true,
    },
    manufactureDate: {
      value: '',
      error: null,
      pristine: true,
    },
    unitTonnage: {
      value: '',
      error: null,
      pristine: true,
    },
    drigInstallCost: {
      value: '',
      error: null,
      pristine: true,
    },
    currentUnitCost: {
      value: '',
      error: null,
      pristine: true,
    },
    pubScore: {
      value: '',
      error: null,
      pristine: true,
    },
    invoice: {
      value: '',
      error: null,
      pristine: true,
    },
  },
  formError: null,
  hvacId: null,
};

HvacForm.propTypes = {
  createdLayer: PropTypes.object,
  handleSaveHVAC: PropTypes.func.isRequired,
  handleDeleteHvac: PropTypes.func.isRequired,
  hvacValues: PropTypes.object,
};

export default HvacForm;
