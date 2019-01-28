import React from 'react';
import EditPopup from './EditPopup';
import AnnotationInfoPopup from './AnnotationInfoPopup';

export const PopupRenderer = {
  annotationInfo: (props) => <AnnotationInfoPopup {...props} />,
  edit: (props) => <EditPopup {...props} />,
};

export const popupSelector = (action) => {
  if (action && action === ACTION_EDIT) return POPUP_EDIT;
  return ANNOTATION_INFO;
};

export const ACTION_EDIT = 'edit';
export const ACTION_INFO = 'info';

export const ANNOTATION_INFO = 'annotationInfo';
export const POPUP_EDIT = 'edit';
