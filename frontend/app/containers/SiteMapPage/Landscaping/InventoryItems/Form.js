import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import { StyledForm } from '../../SidebarStyledComponents/StyledForm';
import { ErrorMessage, FormSelect, FormInput } from '../../SidebarStyledComponents/FormInput';
import FormRow from '../../SidebarStyledComponents/FormRow';
import { FormButton } from '../../SidebarStyledComponents/FormButton';
import FormColumn from '../../SidebarStyledComponents/FormColumn';
import FormLabel from '../../SidebarStyledComponents/FormLabel';
import FormRowContent from '../../SidebarStyledComponents/FormRowContent';
import { inventoryTypeItems } from './opts';
import { optionalPolygonPayload } from '../../utils';
import { toFeet } from '../../../../utils/number/numberUtils';

class LandscapeInventoryItemsForm extends React.Component {

  state = initialState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.inventoryItemValues) {
      const form = cloneDeep(this.state.form);
      const itemId = nextProps.inventoryItemValues._id; // eslint-disable-line
      const inventoryType = JSON.stringify(nextProps.inventoryItemValues.inventoryType);
      form.inventoryType.value = inventoryType;
      form.inventoryType.valid = true;
      form.qty = nextProps.inventoryItemValues.qty;
      form.zoneId = nextProps.inventoryItemValues.zoneId;
      this.setState({ form, itemId });
    } else if (this.state.itemId) {
      this.setState(initialState);
    }
  }

  getZonePolygons = (layers, features) => {
    const zones = [...features].filter((f) =>
      f.title && f.title.includes('Zone') && !f.title.includes('(duplicated)')
    ).map((feature, index) => ({
      ...feature,
      index: typeof feature.index === 'undefined' ? index : feature.index,
    }));

    const sorted = sortBy(zones, 'index');
    const groupedByLayers = groupBy(sorted, (f) => {
      const layer = find(layers, (one) => one._id === f.layerId);
      const layerName = layer && layer.name ? layer.name : '';
      return layerName;
    });

    const list = Object.keys(groupedByLayers).map((layerName) => {
      const group = groupedByLayers[layerName];
      const groupedByZones = groupBy(group, (f) => f.title);
      const mapped = Object.keys(groupedByZones).map((groupTitle) => {
        const grouped = groupedByZones[groupTitle];
        return {
          groupTitle,
          grouped,
        };
      });

      return {
        layerName,
        list: mapped,
      };
    });

    return list;
  };

  handleChangeValue = (e) => {
    const clonedForm = cloneDeep(this.state.form);
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    if (fieldName !== 'zoneId') {
      clonedForm[fieldName].value = fieldValue;
      clonedForm[fieldName].valid = this.checkFieldValidity(fieldValue);
    } else {
      clonedForm[fieldName] = fieldValue;
    }

    this.setState({ form: clonedForm });
  }

  handleChangeQtyValue = (e) => {
    const clonedForm = cloneDeep(this.state.form);
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    clonedForm.qty[fieldName] = fieldValue;

    this.setState({ form: clonedForm });
  }

  submitValues = (e) => {
    e.preventDefault();
    const { handleSaveInventoryLandscape } = this.props;
    const clonedForm = cloneDeep(this.state.form);
    const isValid = this.checkValidity(clonedForm);

    if (isValid) {
      if (clonedForm.inventoryType.value) {
        const mappedColor = inventoryTypeItems.find((inventory) => inventory.name === JSON.parse(clonedForm.inventoryType.value).name);
        if (mappedColor) {
          clonedForm.color = {
            value: mappedColor.color,
          };
        } else {
          clonedForm.color = {
            value: '#228B22',
          };
        }
      }

      handleSaveInventoryLandscape(clonedForm);
      this.setState(initialState);
    } else {
      this.setState({ formError: 'All fields are required for saving the Inventory' });
    }
  }

  checkValidity = (form) => {
    let isValid = true;
    Object.keys(form).forEach((key) => {
      if (!form[key].valid && (key !== 'qty') && (key !== 'zoneId')) {
        isValid = false;
      }
    });
    return isValid;
  }

  checkFieldValidity = (value) =>
    value.trim() !== ''

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
    const { formError, form, itemId } = this.state;
    const { handleDeleteInventoryLandscape, createdLayer, features, layers } = this.props;
    let areaSqFeet;
    let perimeterFeet;
    let payload;

    if (createdLayer && createdLayer.layerType !== 'marker') {
      payload = optionalPolygonPayload(createdLayer);
      areaSqFeet = toFeet(payload.readableArea.metric).toFixed(2);
      perimeterFeet = toFeet(payload.readableDistance.metric).toFixed(2);
    }

    const zonePolygons = this.getZonePolygons(layers.data, features.data);

    return (
      <StyledForm>
        { createdLayer && createdLayer.layerType === 'polygon' && (
          <FormRow lrMargin>
            <FormColumn>
              <FormLabel>INVENTORY TYPE</FormLabel>
              <FormSelect
                name="inventoryType"
                onChange={this.handleChangeValue}
                value={form.inventoryType.value}
              >
                <option value={''}>Select Inventory Type</option>
                { inventoryTypeItems.map((item) => <option key={item.id} value={JSON.stringify(item)}> {item.name} </option>) }
              </FormSelect>
            </FormColumn>
          </FormRow>
        )}
        { createdLayer && createdLayer.layerType === 'marker' && (
          <React.Fragment>
            { inventoryTypeItems.map((item) => (
              <FormRow lrMargin key={item.id}>
                <FormLabel fontSize="0.835rem">{item.name}</FormLabel>
                <FormRowContent maxWidth={'4.5rem'}>
                  <FormInput
                    placeholder="QTY"
                    type="number"
                    name={item.name}
                    onChange={this.handleChangeQtyValue}
                    value={form.qty[item.name] || ''}
                  />
                </FormRowContent>
              </FormRow>
            ))}
          </React.Fragment>
        )}
        { createdLayer && createdLayer.layerType !== 'marker' && (
          <React.Fragment>
            <FormRow lrMargin>
              <FormLabel fontSize="0.75rem">Area:</FormLabel>
              <FormRowContent noMargin>{areaSqFeet} SF</FormRowContent>
            </FormRow>
            <FormRow lrMargin>
              <FormLabel fontSize="0.75rem">Perimeter:</FormLabel>
              <FormRowContent noMargin>{perimeterFeet} FT</FormRowContent>
            </FormRow>
            <FormRow lrMargin>
              <FormLabel fontSize="0.75rem">Cubic Yards:</FormLabel>
              <FormRowContent noMargin> CF</FormRowContent>
            </FormRow>
          </React.Fragment>
        )}

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
                  value={form.zoneId}
                  onChange={this.handleChangeValue}
                >
                  <option value="">Choose a zone</option>
                  {zonePolygons.map(this.renderZonePolygonOptGroup)}
                </FormSelect>
              </FormColumn>
            )
          }
        </FormRow>
        <ErrorMessage>{ formError }</ErrorMessage>
        <FormRow lrMargin>
          { !itemId && <FormButton fullWidth height="2.5rem" onClick={this.submitValues}> SAVE </FormButton> }
          { itemId && <FormButton fullWidth height="2.5rem" onClick={this.submitValues}> UPDATE </FormButton> }
          { itemId && <FormButton fullWidth height="2.5rem" onClick={handleDeleteInventoryLandscape} className="secondary"> DELETE </FormButton> }
        </FormRow>
      </StyledForm>
    );
  }
}

const initialState = {
  form: {
    inventoryType: {
      value: '{}',
      error: null,
      valid: true,
    },
    qty: {},
    zoneId: '',
  },
  formError: null,
  itemId: null,
};

LandscapeInventoryItemsForm.propTypes = {
  handleSaveInventoryLandscape: PropTypes.func.isRequired,
  createdLayer: PropTypes.object,
  inventoryItemValues: PropTypes.object,
  handleDeleteInventoryLandscape: PropTypes.func,
  layers: PropTypes.array.isRequired,
  features: PropTypes.array.isRequired,
};

export default LandscapeInventoryItemsForm;
