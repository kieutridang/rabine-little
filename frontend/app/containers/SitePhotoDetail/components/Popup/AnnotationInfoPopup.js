// vendor
import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

// app
import { StyledPopup } from './styled/StyledPopup';
import { StyledForm, FormTitle } from './styled/StyledForm';
import FormRow from './styled/FormRow';
import FormColumn from './styled/FormColumn';
import FormLabel from './styled/FormLabel';
import FormRowContent from './styled/FormRowContent';
import { FormButton, FormIconButton } from './styled/FormButton';
import DeleteIcon from '../../../../images/icons/rubbish.svg';

const ZoneInfoPopup = ({
  onClose,
  position,
  data,
  deletePolygon,
  openEditPopup,
}) => {
  const {
    properties: {
      _id,
      // createdAt,
      // updatedAt,
      title,
      description,
    },
  } = data;

  // const createdDate = createdAt ? moment(createdAt).fromNow() : '---';
  // const updatedDate = updatedAt ? moment(updatedAt).fromNow() : '---';

  return (
    <StyledPopup info position={position} onClose={onClose}>
      <StyledForm onSubmit={() => false}>
        <FormTitle>ANNOTATION INFORMATION</FormTitle>
        <FormRow>
          <FormColumn>
            <FormLabel info labelColumn fontSize="0.75rem">ANNOTATION NAME</FormLabel>
            <FormRowContent info noMargin>{title || 'Not set'}</FormRowContent>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">ANNOTATION DESCRIPTION</FormLabel>
            <FormRowContent info noMargin>{description || 'Not set'}</FormRowContent>
          </FormColumn>
        </FormRow>

        {/* <FormRow>
          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">CREATED</FormLabel>
            <FormRowContent info noMargin>{createdDate}</FormRowContent>
          </FormColumn>

          <FormColumn hasMargin>
            <FormLabel info labelColumn fontSize="0.75rem">LAST UPDATED</FormLabel>
            <FormRowContent info noMargin>{updatedDate}</FormRowContent>
          </FormColumn>
        </FormRow>*/}

        <FormRow>
          <FormButton height="1.625rem" onClick={openEditPopup(_id)} className="secondary">Edit</FormButton>
          <FormIconButton onClick={deletePolygon(_id)}>
            <DeleteIcon width={16} height={16} />
          </FormIconButton>
        </FormRow>
      </StyledForm>
    </StyledPopup>
  );
};

ZoneInfoPopup.propTypes = {
  onClose: PropTypes.func,
  position: PropTypes.array,
  data: PropTypes.object,
  deletePolygon: PropTypes.func,
  openEditPopup: PropTypes.func,
};

export default ZoneInfoPopup;
