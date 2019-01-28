// vendor
import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';

// app
import { StyledForm } from './styled/StyledForm';
import { FormButton } from './styled/FormButton';
import FormRow from './styled/FormRow';
import FormLabel from './styled/FormLabel';
import FormColumn from './styled/FormColumn';
import FormRowContent from './styled/FormRowContent';
import { FormInput, FormSelect, ErrorMessage } from './styled/FormInput';
import { trafficTypeOptions, surfaceTypeOptions, zoneTitleOptions } from '../../Common/Options';
import { options } from './options';

class EditPopupTabZone extends React.Component {
  state = {
    title: (this.props.properties && this.props.properties.title) || 'No Zone',
    color: (this.props.properties && this.props.properties.color) || '#FFFFFF',
    layerId: (this.props.properties && this.props.properties.layerId) || null,
    pci: (this.props.properties && this.props.properties.pci) || '',
    surfaceType: (this.props.properties && this.props.properties.surfaceType) || '',
    trafficType: (this.props.properties && this.props.properties.trafficType) || '',
    showErrorMessage: false,
  }

  setZoneTitle = (value) => this.setState({ title: value });

  getZoneTitleOptions = (title) => {
    const {
      features,
      properties = {},
    } = this.props;

    const tmpVal = properties.title && properties.title === title ? '' : title;
    const existingTitles = features.map((f) => f.title).map((value) => ({ value, text: value }));

    const prepared = [...existingTitles, ...zoneTitleOptions];
    const dupeless = uniqBy(prepared, 'text');

    const filtered = dupeless
      .filter(({ value }) =>
        value
        && tmpVal
        && value.toLowerCase().includes(tmpVal.toLowerCase())
        && value.toLowerCase().includes('zone')
      );

    const sorted = filtered.sort((a, b) => a.value > b.value);
    return sorted;
  }

  getZoneMapOptions = () =>
    this.props.layers.filter((layer) => {
      const layerName = layer && layer.name ? layer.name : '';
      return layerName.toLowerCase().includes('zone');
    });

  handleChangeZoneTitle = (e) => {
    const { value } = e.target;
    options
    .filter((item) => item.value === value)
    .forEach((item) => {
      this.setState({
        title: item.value,
        color: item.color,
      });
    });
  };

  handleChangeZoneMap = (e) => {
    const zoneMaps = this.getZoneMapOptions();
    const { value } = e.target;
    zoneMaps
    .filter((item) => item._id === value)
    .forEach((item) => {
      this.setState({
        layerId: item._id,
      });
    });
  };

  handleChangeColor = ({ color }) => this.setState({ color });
  handleChangePci = (e) => this.setState({ pci: e.target.value });
  handleChangeSurfaceType = (e) => this.setState({ surfaceType: e.target.value });
  handleChangeTrafficType = (e) => this.setState({ trafficType: e.target.value });
  handleSaveEditData = (e) => {
    e.preventDefault();

    const { saveEditData, properties } = this.props;
    const { title, layerId, color, pci, surfaceType, trafficType } = this.state;

    if (this.handleCheckEmpty(surfaceType) && this.handleCheckEmpty(trafficType)) {
      if (saveEditData) {
        saveEditData('zone', properties._id, {
          layerId,
          title,
          color,
          pci,
          surfaceType,
          trafficType,
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      this.setState({ showErrorMessage: true });
    }
  }
  handleCheckEmpty = (text) => {
    if (text === '' || text === 'Select Surface' || text === 'Select Traffic Type') {
      return false;
    }
    return true;
  }

  render() {
    const {
      isShared,
      areaSqFeet,
      perimeterFeet,
      deletePolygon,
      subtractPolygon,
      editPolygon,
      scalePolygon,
      properties,
    } = this.props;

    const {
      pci,
      surfaceType,
      trafficType,
      layerId,
      showErrorMessage,
    } = this.state;

    const zoneMaps = this.getZoneMapOptions();

    return (
      <StyledForm>
        <FormRow lrMargin>
          {
            zoneMaps.length === 0 && <span>No zone maps found…</span>
          }
          {
            zoneMaps.length > 0 &&
            (
              <FormColumn>
                <FormLabel labelColumn>ZONE MAP</FormLabel>
                <FormSelect
                  name="layerId"
                  value={layerId}
                  onChange={this.handleChangeZoneMap}
                  disabled={isShared}
                >
                  <option>Choose a zone map</option>
                  {zoneMaps.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
                </FormSelect>
              </FormColumn>
            )
          }
        </FormRow>

        <FormRow lrMargin>
          <FormColumn hasMargin>
            <FormLabel labelColumn>ZONE NAME</FormLabel>
            <FormSelect onChange={this.handleChangeZoneTitle} value={this.state.title}>
              {options && options.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}
            </FormSelect>
          </FormColumn>
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
          <FormColumn hasMargin>
            <FormLabel labelColumn>PCI</FormLabel>
            <FormInput
              type={isShared ? 'text' : 'number'}
              name="selectPCI"
              id="selectPCI"
              placeholder="Enter PCI"
              onChange={this.handleChangePci}
              onBlur={this.handleChangePci}
              value={pci}
              disabled={isShared}
            />
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel labelColumn>SURFACE TYPE</FormLabel>
            <FormSelect
              name="surfaceType"
              disabled={isShared}
              value={surfaceType}
              onChange={this.handleChangeSurfaceType}
            >
              <option>Select Surface</option>
              {
                surfaceTypeOptions.map((l) => <option key={l.value} value={l.value}>{l.text}</option>)
              }
            </FormSelect>
            { showErrorMessage && (surfaceType === '' || surfaceType === 'Select Surface') && <ErrorMessage surfaceType> Surface Type is required</ErrorMessage> }
          </FormColumn>
        </FormRow>

        <FormRow lrMargin>
          <FormColumn hasMargin>
            <FormLabel labelColumn>TRAFFIC TYPE</FormLabel>
            <FormSelect
              name="trafficType"
              disabled={isShared}
              value={trafficType}
              onChange={this.handleChangeTrafficType}
            >
              <option>Select Traffic Type</option>
              {
                trafficTypeOptions.map((l) => <option key={l.value} value={l.value}>{l.text}</option>)
              }
            </FormSelect>
            { showErrorMessage && (trafficType === '' || trafficType === 'Select Traffic Type') && <ErrorMessage> Traffic Type is required</ErrorMessage> }
          </FormColumn>
        </FormRow>

        <FormRow justifyContent="flex-end" lrMargin>
          <FormButton onClick={subtractPolygon(properties._id)} className="secondary">Subtract</FormButton>
          <FormButton onClick={editPolygon(properties._id)} className="secondary">Edit</FormButton>
          <FormButton onClick={scalePolygon(properties._id)} className="secondary">Scale</FormButton>
          <FormButton onClick={deletePolygon(properties._id)} className="secondary">Delete</FormButton>
          <FormButton onClick={this.handleSaveEditData} className="primary">Save</FormButton>
        </FormRow>
      </StyledForm>
    );
  }
}

EditPopupTabZone.propTypes = {
  deletePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  saveEditData: PropTypes.func,
  isShared: PropTypes.bool,

  areaSqFeet: PropTypes.any,
  perimeterFeet: PropTypes.any,

  layers: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  features: PropTypes.array.isRequired,
};

export default EditPopupTabZone;
