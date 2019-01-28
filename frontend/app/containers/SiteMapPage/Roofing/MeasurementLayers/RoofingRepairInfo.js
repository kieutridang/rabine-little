// vendor
import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import moment from 'moment';

// app
import { StyledPopup } from '../../Popup/styled/StyledPopup';
import { StyledForm, FormTitle } from '../../Popup/styled/StyledForm';
import FormRow from '../../Popup/styled/FormRow';
import FormColumn from '../../Popup/styled/FormColumn';
import FormLabel from '../../Popup/styled/FormLabel';
import FormRowContent from '../../Popup/styled/FormRowContent';
import { FormButton, FormIconButton } from '../../Popup/styled/FormButton';
import { toFeet } from '../../../../utils/number/numberUtils';
import DeleteIcon from '../../../../images/icons/rubbish.svg';

const RoofingRepairInfo = ({
  onClose,
  position,
  data,
  layers,
  deletePolygon,
  readableArea,
  readableDistance,
  openEditPopup,
  readOnly,
  duplicatePolygon,
}) => {
  const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
  const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);

  const {
    properties: {
      _id,
      createdAt,
      updatedAt,
      repairType,
      title,
      layerId,
      defectType,
      repairCost,
      typeOfRepair,
      layerType,
    },
  } = data;

  const createdDate = createdAt ? moment(createdAt).fromNow() : '---';
  const updatedDate = updatedAt ? moment(updatedAt).fromNow() : '---';

  const repairLayer = find(layers, (l) => l._id === layerId);

  return (
    <StyledPopup info position={position} onClose={onClose}>
      <StyledForm onSubmit={() => false}>
        <FormTitle>REPAIR INFORMATION</FormTitle>
        <FormRow>
          <FormColumn>
            <FormLabel info labelColumn fontSize="0.75rem">REPAIR TYPE</FormLabel>
            <FormRowContent info noMargin>{ title || repairType }</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">YEAR</FormLabel>
            <FormRowContent info noMargin>{repairLayer ? repairLayer.name : 'Not set'}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">TYPE OF REPAIR</FormLabel>
            <FormRowContent info noMargin>{typeOfRepair || 'Not set'}</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">DEFECT TYPE</FormLabel>
            <FormRowContent info noMargin>{defectType || 'Not set'}</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">AREA</FormLabel>
            <FormRowContent info noMargin>{areaSqFeet} SF</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">PERIMETER</FormLabel>
            <FormRowContent info noMargin>{perimeterFeet} FT</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">COST</FormLabel>
            <FormRowContent info noMargin>${repairCost || '0.00'}</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">CREATED</FormLabel>
            <FormRowContent info noMargin>{createdDate}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">LAST UPDATED</FormLabel>
            <FormRowContent info noMargin>{updatedDate}</FormRowContent>
          </FormColumn>
        </FormRow>

        {!readOnly &&
        <FormRow>
          <FormButton height="1.625rem" onClick={duplicatePolygon(_id, layerType)} className="primary">Duplicate</FormButton>
          <FormButton height="1.625rem" onClick={openEditPopup(_id)} className="secondary">Edit</FormButton>
          <FormIconButton onClick={deletePolygon(_id, layerType)}>
            <DeleteIcon width={16} height={16} />
          </FormIconButton>
        </FormRow>
        }
      </StyledForm>
    </StyledPopup>
  );
};

RoofingRepairInfo.defaultProps = {
  readOnly: false,
};


RoofingRepairInfo.propTypes = {
  onClose: PropTypes.func,
  position: PropTypes.array,
  data: PropTypes.object,
  layers: PropTypes.array,
  deletePolygon: PropTypes.func,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  openEditPopup: PropTypes.func,
  readOnly: PropTypes.bool,
  duplicatePolygon: PropTypes.func.isRequired,
};

export default RoofingRepairInfo;
