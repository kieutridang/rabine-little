import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';

// app
import EditPopupAnnotation from './EditPopupAnnotation';
import { StyledPopup } from './styled/StyledPopup';


const EditPopup = (props) => {
  const {
    closeEditPopup,

    position,
    annotations = [],
    annotationId,

    deletePolygon,
    scalePolygon,
    editPolygon,

    isShared = false,

    saveEditData,
    onChangeData,
  } = props;

  const annotation = annotationId && find(props.annotations, (f) => f._id === annotationId);
  const properties = annotation || {};

  const handleCloseEditPopup = () => {
    closeEditPopup(annotationId);
  };

  return (
    <StyledPopup position={position} onClose={handleCloseEditPopup}>
      <EditPopupAnnotation
        features={annotations}
        featureId={annotationId}
        properties={properties}
        isShared={isShared}
        deletePolygon={deletePolygon}
        scalePolygon={scalePolygon}
        editPolygon={editPolygon}
        saveEditData={saveEditData}
        onChangeData={onChangeData}
      />
    </StyledPopup>
  );
};

EditPopup.propTypes = {
  position: PropTypes.array,
  closeEditPopup: PropTypes.func.isRequired,
  annotations: PropTypes.array.isRequired,
  annotationId: PropTypes.string,
  deletePolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  saveEditData: PropTypes.func.isRequired,
  isShared: PropTypes.bool,
  onChangeData: PropTypes.func,
};

export default EditPopup;
