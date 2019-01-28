// vendor
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// app
import { StyledPopup } from './styled/StyledPopup';
import { StyledForm, FormTitle } from './styled/StyledForm';
import FormRow from './styled/FormRow';
import FormColumn from './styled/FormColumn';
import FormLabel from './styled/FormLabel';
import FormRowContent from './styled/FormRowContent';
import { toFeet } from '../../../utils/number/numberUtils';
import { FormButton, FormIconButton } from './styled/FormButton';
import DeleteIcon from '../../../images/icons/rubbish.svg';

const ZoneInfoPopup = ({
  onClose,
  position,
  data,
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
      title,
      surfaceType,
      trafficType,
      pci,
    },
  } = data;

  const createdDate = createdAt ? moment(createdAt).fromNow() : '---';
  const updatedDate = updatedAt ? moment(updatedAt).fromNow() : '---';

  return (
    <StyledPopup info position={position} onClose={onClose}>
      <StyledForm onSubmit={() => false}>
        <FormTitle>ZONE INFORMATION</FormTitle>
        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">ZONE NAME</FormLabel>
            <FormRowContent info noMargin>{title || 'Not set'}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">SURFACE TYPE</FormLabel>
            <FormRowContent info noMargin>{surfaceType || 'Not set'}</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">PCI</FormLabel>
            <FormRowContent info noMargin>{pci || 'Not set'}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">TRAFFIC TYPE</FormLabel>
            <FormRowContent info noMargin>{trafficType || 'Not set'}</FormRowContent>
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

ZoneInfoPopup.defaultProps = {
  readOnly: false,
};

ZoneInfoPopup.propTypes = {
  onClose: PropTypes.func,
  position: PropTypes.array,
  data: PropTypes.object,
  duplicatePolygon: PropTypes.func,
  deletePolygon: PropTypes.func,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  openEditPopup: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default ZoneInfoPopup;
