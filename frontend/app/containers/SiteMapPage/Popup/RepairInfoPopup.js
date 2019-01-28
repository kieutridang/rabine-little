// vendor
import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import moment from 'moment';

// app
import { StyledPopup } from './styled/StyledPopup';
import { StyledForm, FormTitle } from './styled/StyledForm';
import FormRow from './styled/FormRow';
import FormColumn from './styled/FormColumn';
import FormLabel from './styled/FormLabel';
import FormRowContent from './styled/FormRowContent';
import { FormButton, FormIconButton } from './styled/FormButton';
import { toFeet } from '../../../utils/number/numberUtils';
import DeleteIcon from '../../../images/icons/rubbish.svg';

const RepairInfoPopup = ({
  onClose,
  position,
  data,
  layers,
  features,
  siteRepairs,
  duplicatePolygon,
  deletePolygon,
  readableArea,
  readableDistance,
  openEditPopup,
  readOnly,
}) => {
  const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
  const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);

  const {
    properties: {
      _id,
      createdAt,
      updatedAt,
      zoneId,
      repairType,
      title,
      layerId,
    },
  } = data;

  const createdDate = createdAt ? moment(createdAt).fromNow() : '---';
  const updatedDate = updatedAt ? moment(updatedAt).fromNow() : '---';

  const siteRepair = find(siteRepairs, (s) => s.id === _id);
  const repairLayer = find(layers, (l) => l._id === layerId);
  const zoneLayer = find(features, (f) => f._id === zoneId);

  return (
    <StyledPopup info position={position} onClose={onClose}>
      <StyledForm onSubmit={() => false}>
        <FormTitle>REPAIR INFORMATION</FormTitle>
        <FormRow>
          <FormColumn>
            <FormLabel info labelColumn fontSize="0.75rem">REPAIR NAME</FormLabel>
            <FormRowContent info noMargin>{title}</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">YEAR</FormLabel>
            <FormRowContent info noMargin>{repairLayer ? repairLayer.name : 'Not set'}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">TYPE OF REPAIR</FormLabel>
            <FormRowContent info noMargin>{repairType || 'Not set'}</FormRowContent>
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
            <FormLabel info labelColumn fontSize="0.75rem">TOTAL COST</FormLabel>
            <FormRowContent info noMargin>${siteRepair ? siteRepair.total : '0.00'}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">ZONE</FormLabel>
            <FormRowContent info noMargin>
              {zoneLayer && zoneLayer.title ? zoneLayer.title : 'Not set'}
            </FormRowContent>
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
          <FormButton height="1.625rem" onClick={duplicatePolygon(_id)} className="primary">Duplicate</FormButton>
          <FormButton height="1.625rem" onClick={openEditPopup(_id)} className="secondary">Edit</FormButton>
          <FormIconButton onClick={deletePolygon(_id)}>
            <DeleteIcon width={16} height={16} />
          </FormIconButton>
        </FormRow>
        }
      </StyledForm>
    </StyledPopup>
  );
};

RepairInfoPopup.defaultProps = {
  readOnly: false,
};


RepairInfoPopup.propTypes = {
  onClose: PropTypes.func,
  position: PropTypes.array,
  data: PropTypes.object,
  layers: PropTypes.array,
  features: PropTypes.array,
  siteRepairs: PropTypes.array,
  duplicatePolygon: PropTypes.func,
  deletePolygon: PropTypes.func,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  openEditPopup: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default RepairInfoPopup;
