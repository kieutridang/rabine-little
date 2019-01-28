// vendor
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import uniqBy from 'lodash/uniqBy';

// app
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { StyledForm } from './styled/StyledForm';
import { FormButton } from './styled/FormButton';
import FormRow from './styled/FormRow';
import FormLabel from './styled/FormLabel';
import FormColumn from './styled/FormColumn';
import FormRowContent from './styled/FormRowContent';
import { FormInput, FormSelect, ErrorMessage } from './styled/FormInput';
import Options from '../../../components/Options';
import { typeOfRepairOptions, repairNameOptions } from '../../Common/Options';
import { StyledColorPicker } from './styled/StyledColorPicker';
import { createColorCircles } from './styled/StyledColorCircle';

import CheckboxIcon from '../../../images/icons/checkbox.svg';
import { autoRepairData } from './options';

const Checkbox = styled(MuiCheckbox)`
  svg {
    color: ${(props) => props.checked ? '#FF4242' : 'hsla(220, 2%, 72%, 1.0)'};
  }
`;

const Label = styled(FormControlLabel)`
  margin-bottom: 0;

  span {
    color: hsla(220, 2%, 52%, 1.0);
  }

  &.disabled,
  &[disabled] {
    span {
      color: hsla(0, 0%, 75%, 1.0);
    }
  }
`;


class EditPopupTabRepair extends React.Component {
  state = {
    title: this.props.properties.title || '',
    color: this.props.properties.color || '',
    layerId: this.props.properties.layerId || '',
    repairType: this.props.properties.repairType || '',
    zoneId: this.props.properties.zoneId || '',

    restripeAffectedArea: this.props.properties.restripeAffectedArea || false,
    fillAsphaltCrack: this.props.properties.fillAsphaltCrack || false,
    concreteCrackFill: this.props.properties.concreteCrackFill || false,
    overrideSF: this.props.properties.overrideSF || false,

    inputAsphalt: this.props.properties.inputAsphalt || '',
    inputConcreteCrackFill: this.props.properties.inputConcreteCrackFill || '',
    inputOverrideSF: this.props.properties.inputOverrideSF || '',

    patchNumber: this.props.properties.patchNumber || '',

    showErrorMessage: false,
  };

  setRepairTitle = (value) => this.setState({ title: value });

  getRepairTitleOptions = (title) => {
    const {
      features,
      properties = {},
    } = this.props;

    const tmpVal = properties.title && properties.title === title ? '' : title;
    const existingTitles = features.map((f) => f.title).map((value) => ({ value, text: value }));

    const prepared = [...existingTitles, ...repairNameOptions];
    const dupeless = uniqBy(prepared, 'text');

    const filtered = dupeless
      .filter(({ value }) =>
        value
        && tmpVal
        && value.toLowerCase().includes(tmpVal.toLowerCase())
        && !value.toLowerCase().includes('zone')
      );

    const sorted = filtered.sort((a, b) => a.value > b.value);
    return sorted;
  };

  handleChangeRepairTitle = (e) => this.setState({ title: e.target.value });

  handleChangeColor = ({ color }) => this.setState({ color });
  handleChangeYear = (e) => this.setState({ year: e.target.value });
  handleChangeRepairType = (e) => this.setState({ repairType: e.target.value });
  handleChangeZone = (e) => this.setState({ zoneId: e.target.value });
  handleChangeLayer = (e) => this.setState({ layerId: e.target.value });
  handleChangeRestripeAffectedAreaCheckbox = () =>
    this.setState((prevState) => ({ restripeAffectedArea: !prevState.restripeAffectedArea }));
  handleChangeFillAsphaltCrackCheckbox = () =>
    this.setState((prevState) => ({ fillAsphaltCrack: !prevState.fillAsphaltCrack }));
  handleChangeConcreteCrackFillCheckbox = () =>
    this.setState((prevState) => ({ concreteCrackFill: !prevState.concreteCrackFill }));
  handleChangeOverrideSFCheckbox = () =>
    this.setState((prevState) => ({ overrideSF: !prevState.overrideSF }));

  handleChangeFillAsphaltCrackInput = (e) => this.setState({ inputAsphalt: e.target.value });
  handleChangeConcreteCrackFillInput = (e) => this.setState({ inputConcreteCrackFill: e.target.value });
  handleChangeOverrideSFInput = (e) => this.setState({ inputOverrideSF: e.target.value });
  handleChangePatchNumber = (e) => this.setState({ patchNumber: e.target.value });

  handleSaveEditData = (e) => {
    e.preventDefault();

    const { saveEditData, properties } = this.props;
    const {
      title,
      color,
      repairType,
      layerId,
      zoneId,
      restripeAffectedArea,
      fillAsphaltCrack,
      concreteCrackFill,
      overrideSF,

      inputAsphalt,
      inputConcreteCrackFill,
      inputOverrideSF,

      patchNumber,
    } = this.state;

    const defaultData = autoRepairData.find((repair) => repair.title === title);
    const defaultRepairType = defaultData ? defaultData.repairType : '';
    const defaultColor = defaultData ? defaultData.color : '#FF7077';

    if (this.handleCheckEmpty(repairType || defaultRepairType)) {
      if (saveEditData) {
        saveEditData('repair', properties._id, {
          title,
          color: (color && color !== '#FF7077') ? color : defaultColor,
          repairType: repairType || defaultRepairType,
          layerId,

          restripeAffectedArea,
          fillAsphaltCrack,
          concreteCrackFill,
          overrideSF,

          inputArea: restripeAffectedArea ? '1' : null,
          inputAsphalt,
          inputConcreteCrackFill,
          inputOverrideSF,
          zoneId,
          updatedAt: new Date().toISOString(),
          patchNumber,
        });
      }
    } else {
      this.setState({ showErrorMessage: true });
    }
  };

  handleCheckEmpty = (text) => {
    if (text === '' || text === 'Select Repair Type') {
      return false;
    }
    return true;
  };

  renderCheckboxs = () => {
    const { isShared } = this.props;

    const {
      restripeAffectedArea,
      fillAsphaltCrack,
      concreteCrackFill,

      inputAsphalt,
      inputConcreteCrackFill,

      overrideSF,
      inputOverrideSF,
    } = this.state;

    const showOverrideSF = overrideSF || !(fillAsphaltCrack || concreteCrackFill);

    if (showOverrideSF) {
      return (
        <Fragment>
          <Label
            className={isShared && 'disabled'}
            control={
              <Checkbox
                name="checkOverrideSF"
                id="checkAsphaltCrack"
                onChange={this.handleChangeOverrideSFCheckbox}
                checked={overrideSF}
                checkedIcon={<CheckboxIcon />}
                disabled={isShared}
              />
            }
            label="Override SF"
          />
          {
            overrideSF &&
            <FormRow>
              <FormInput
                type="number"
                name="inputOverrideSF"
                id="inputOverrideSF"
                placeholder="%"
                onChange={this.handleChangeOverrideSFInput}
                value={inputOverrideSF}
                disabled={isShared}
              />
            </FormRow>
          }

          <Label
            className={isShared && 'disabled'}
            control={
              <Checkbox
                name="checkRestripe"
                id="checkRestripe"
                onChange={this.handleChangeRestripeAffectedAreaCheckbox}
                checked={restripeAffectedArea}
                checkedIcon={<CheckboxIcon />}
                disabled={isShared}
              />
            }
            label="Restripe Affected Areas"
          />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Label
          className={isShared && 'disabled'}
          control={
            <Checkbox
              name="checkAsphaltCrack"
              id="checkAsphaltCrack"
              onChange={this.handleChangeFillAsphaltCrackCheckbox}
              checked={fillAsphaltCrack}
              checkedIcon={<CheckboxIcon />}
              disabled={isShared}
            />
          }
          label="Asphalt Crack Fill"
        />
        {
          fillAsphaltCrack &&
          <FormRow>
            <FormInput
              type="number"
              name="inputAsphalt"
              id="inputAsphalt"
              placeholder="Qty"
              onChange={this.handleChangeFillAsphaltCrackInput}
              value={inputAsphalt}
              disabled={isShared}
            />
          </FormRow>
        }
        <Label
          className={isShared && 'disabled'}
          control={
            <Checkbox
              name="checkCrackFill"
              id="checkCrackFill"
              onChange={this.handleChangeConcreteCrackFillCheckbox}
              checked={concreteCrackFill}
              checkedIcon={<CheckboxIcon />}
              disabled={isShared}
            />
          }
          label="Concrete Crack Fill"
        />
        {
          concreteCrackFill &&
          <FormRow>
            <FormInput
              type="number"
              name="inputConcreteCrackFill"
              id="inputConcreteCrackFill"
              placeholder="LF"
              onChange={this.handleChangeConcreteCrackFillInput}
              value={inputConcreteCrackFill}
              disabled={isShared}
            />
          </FormRow>
        }
      </Fragment>
    );
  };

  renderZonePolygonOptGroup = ({ layerName, list }) =>
    list.map((item) => {
      const options = item.grouped.map((zone, index) =>
        <option key={zone._id} value={zone._id}>{zone.title}.0{index + 1}</option>
      );
      const label = `${layerName} - ${item.groupTitle}`;
      return (
        <optgroup label={label}>
          {options}
        </optgroup>
      );
    });

  render() {
    const {
      isShared,
      featureId,
      areaSqFeet,
      perimeterFeet,
      deletePolygon,
      editPolygon,
      subtractPolygon,
      scalePolygon,
      zonePolygons,
      repairLayers,
    } = this.props;

    const {
      title,
      color,
      layerId,
      repairType,
      zoneId,
      patchNumber,

      showErrorMessage,
    } = this.state;

    const colorCircles = createColorCircles(this.handleChangeColor, color, isShared);
    return (
      <StyledForm>
        <FormRow lrMargin>
          <FormColumn>
            <FormLabel labelColumn>REPAIR NAME</FormLabel>
            <FormInput
              type="text"
              name="title"
              placeholder="Enter Repair Name"
              onChange={this.handleChangeRepairTitle}
              value={title}
              disabled={isShared}
            />
            <Options
              value={title}
              getOptions={this.getRepairTitleOptions}
              onSelectOption={this.setRepairTitle}
            />
          </FormColumn>
        </FormRow>

        <FormRow lrMargin>
          <FormLabel fontSize="0.75rem">Color:</FormLabel>
          <FormRowContent>
            { colorCircles }
            {
              !isShared &&
              <StyledColorPicker
                color={color}
                onChange={this.handleChangeColor}
                enableAlpha={false}
              />
            }
          </FormRowContent>
        </FormRow>

        <FormRow lrMargin>
          <FormLabel fontSize="0.75rem">Area:</FormLabel>
          <FormRowContent noMargin>{areaSqFeet} SF</FormRowContent>
        </FormRow>

        <FormRow lrMargin>
          <FormLabel fontSize="0.75rem">Perimeter:</FormLabel>
          <FormRowContent>{perimeterFeet} FT</FormRowContent>
        </FormRow>

        <FormRow lrMargin>
          {
            repairLayers.length === 0 && <FormColumn hasMargin>No years found…</FormColumn>
          }
          {
            repairLayers.length > 0 &&
            (
              <FormColumn hasMargin>
                <FormLabel labelColumn>YEAR</FormLabel>
                <FormSelect
                  name="layerId"
                  value={layerId}
                  onChange={this.handleChangeLayer}
                  disabled={isShared}
                >
                  <option>Choose a year</option>
                  {repairLayers.map((l) => <option key={l._id} value={l._id}>{l.name || 'Untitled'}</option>)}
                </FormSelect>
              </FormColumn>
            )
          }

          <FormColumn hasMargin>
            <FormLabel labelColumn>TYPE OF REPAIR</FormLabel>
            <FormSelect
              name="repairType"
              disabled={isShared}
              value={repairType}
              onChange={this.handleChangeRepairType}
            >
              <option>Select Repair Type</option>
              {
                typeOfRepairOptions.map((l) => <option key={l.value} value={l.value}>{l.text}</option>)
              }
            </FormSelect>
            { showErrorMessage && (repairType === '' || repairType === 'Select Repair Type') && <ErrorMessage repairType> Repair Type is required</ErrorMessage> }
          </FormColumn>
        </FormRow>

        <FormRow lrMargin>
          {
            zonePolygons.length === 0 && <span>No zones found…</span>
          }
          {
            zonePolygons.length > 0 &&
            (
              <FormColumn>
                <FormLabel labelColumn>ZONE</FormLabel>
                <FormSelect
                  name="zoneId"
                  value={zoneId}
                  onChange={this.handleChangeZone}
                  disabled={isShared}
                >
                  <option>Choose a zone</option>
                  {zonePolygons.map(this.renderZonePolygonOptGroup)}
                </FormSelect>
              </FormColumn>
            )
          }
        </FormRow>

        <FormRow lrMargin>
          <FormColumn hasMargin>
            <FormLabel>PATCH NUMBER</FormLabel>
            <FormInput
              type="number"
              name="patchNumber"
              onChange={this.handleChangePatchNumber}
              value={patchNumber}
            />
          </FormColumn>
        </FormRow>

        { this.renderCheckboxs() }

        <FormRow justifyContent="flex-end" lrMargin>
          <FormButton onClick={subtractPolygon(featureId)} className="secondary">Subtract</FormButton>
          <FormButton onClick={editPolygon(featureId)} className="secondary">Edit</FormButton>
          <FormButton onClick={scalePolygon(featureId)} className="secondary">Scale</FormButton>
          <FormButton onClick={deletePolygon(featureId)} className="secondary">Delete</FormButton>
          <FormButton onClick={this.handleSaveEditData} className="primary">Save</FormButton>
        </FormRow>
      </StyledForm>
    );
  }
}

EditPopupTabRepair.propTypes = {
  featureId: PropTypes.string,
  deletePolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  saveEditData: PropTypes.func,
  isShared: PropTypes.bool,

  areaSqFeet: PropTypes.any,
  perimeterFeet: PropTypes.any,

  properties: PropTypes.object.isRequired,
  features: PropTypes.array.isRequired,
  zonePolygons: PropTypes.array.isRequired,
  repairLayers: PropTypes.array.isRequired,
  layerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default EditPopupTabRepair;
