import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';
import _ from 'lodash';

const FETCH_SITE_AREAS = 'FETCH_SITE_AREAS';
const FETCH_SITE_AREAS_SUCCESSFULLY = 'FETCH_SITE_AREAS_SUCCESSFULLY';
const FETCH_SITE_AREAS_FAIL = 'FETCH_SITE_AREAS_FAIL';

const GET_AREA_PHOTOS = 'GET_AREA_PHOTOS';
const GET_AREA_PHOTOS_SUCCESS = 'GET_AREA_PHOTOS_SUCCESS';
const GET_AREA_PHOTOS_FAIL = 'GET_AREA_PHOTOS_FAIL';

const FETCH_SITE_AREA = 'FETCH_SITE_AREA';
const FETCH_SITE_AREA_SUCCESSFULLY = 'FETCH_SITE_AREA_SUCCESSFULLY';
const FETCH_SITE_AREA_FAIL = 'FETCH_SITE_AREA_FAIL';

const CHANGE_AREA = 'CHANGE_AREA';

const TOGGLE_AREA_PHOTO_DEFECTED = 'TOGGLE_AREA_PHOTO_DEFECTED';
const TOGGLE_AREA_PHOTO_DEFECTED_SUCCESSFULLY = 'TOGGLE_AREA_PHOTO_DEFECTED_SUCCESSFULLY';
const TOGGLE_AREA_PHOTO_DEFECTED_FAIL = 'TOGGLE_AREA_PHOTO_DEFECTED_FAIL';

const SET_AREA_PHOTO_DEFECTED_TYPE = 'SET_AREA_PHOTO_DEFECTED_TYPE';
const SET_AREA_PHOTO_DEFECTED_TYPE_SUCCESSFULLY = 'SET_AREA_PHOTO_DEFECTED_TYPE_SUCCESSFULLY';
const SET_AREA_PHOTO_DEFECTED_TYPE_FAIL = 'SET_AREA_PHOTO_DEFECTED_TYPE_FAIL';

const SET_AREA_PHOTO_DEFECTED_SEVERITY = 'SET_AREA_PHOTO_DEFECTED_SEVERITY';
const SET_AREA_PHOTO_DEFECTED_SEVERITY_SUCCESSFULLY = 'SET_AREA_PHOTO_DEFECTED_SEVERITY_SUCCESSFULLY';
const SET_AREA_PHOTO_DEFECTED_SEVERITY_FAIL = 'SET_AREA_PHOTO_DEFECTED_SEVERITY_FAIL';

const TOGGLE_AREA_PHOTO_REPAIR = 'TOGGLE_AREA_PHOTO_REPAIR';
const TOGGLE_AREA_PHOTO_REPAIR_SUCCESSFULLY = 'TOGGLE_AREA_PHOTO_REPAIR_SUCCESSFULLY';
const TOGGLE_AREA_PHOTO_REPAIR_FAIL = 'TOGGLE_AREA_PHOTO_REPAIR_FAIL';

const SET_AREA_PHOTO_REPAIR_NAME = 'SET_AREA_PHOTO_REPAIR_NAME';
const SET_AREA_PHOTO_REPAIR_NAME_FAIL = 'SET_AREA_PHOTO_REPAIR_NAME_FAIL';
const SET_AREA_PHOTO_REPAIR_NAME_SUCCESSFULLY = 'SET_AREA_PHOTO_REPAIR_NAME_SUCCESSFULLY';

// Annotation

const CREATE_ANNOTATION_REQUEST = 'CREATE_ANNOTATION_REQUEST';
const CREATE_ANNOTATION_FAIL = 'CREATE_ANNOTATION_FAIL';
const CREATE_ANNOTATION_SUCCESS = 'CREATE_ANNOTATION_SUCCESS';

const GET_ANNOTATIONS_REQUEST = 'GET_ANNOTATIONS_REQUEST';
const GET_ANNOTATIONS_FAIL = 'GET_ANNOTATIONS_FAIL';
const GET_ANNOTATIONS_SUCCESS = 'GET_ANNOTATIONS_SUCCESS';

const UPDATE_ANNOTATION_REQUEST = 'UPDATE_ANNOTATION_REQUEST';
const UPDATE_ANNOTATION_FAIL = 'UPDATE_ANNOTATION_FAIL';
const UPDATE_ANNOTATION_SUCCESS = 'UPDATE_ANNOTATION_SUCCESS';

const DELETE_ANNOTATION_REQUEST = 'DELETE_ANNOTATION_REQUEST';
const DELETE_ANNOTATION_FAIL = 'DELETE_ANNOTATION_FAIL';
const DELETE_ANNOTATION_SUCCESS = 'DELETE_ANNOTATION_SUCCESS';

const ADD_AREA_PHOTO_REPAIR = 'Add_AREA_PHOTO_REPAIR';
const ADD_AREA_PHOTO_REPAIR_SUCCESS = 'Add_AREA_PHOTO_REPAIR_SUCCESS';
const ADD_AREA_PHOTO_REPAIR_FAIL = 'Add_AREA_PHOTO_REPAIR_FAIL';

const DELETE_AREA_PHOTO_REPAIR = 'DELETE_AREA_PHOTO_REPAIR';
const DELETE_AREA_PHOTO_REPAIR_SUCCESS = 'DELETE_AREA_PHOTO_REPAIR_SUCCESS';
const DELETE_AREA_PHOTO_REPAIR_FAIL = 'DELETE_AREA_PHOTO_REPAIR_FAIL';

const GET_AREA_PHOTO_REPAIRS = 'GET_AREA_PHOTO_REPAIRS';
const GET_AREA_PHOTO_REPAIRS_SUCCESS = 'GET_AREA_PHOTO_REPAIRS_SUCCESS';
const GET_AREA_PHOTO_REPAIRS_FAIL = 'GET_AREA_PHOTO_REPAIRS_FAIL';

const SET_DELETED_AREA_PHOTO = 'SET_DELETED_AREA_PHOTO';
const SET_DELETED_AREA_PHOTO_REQUESTING = 'SET_DELETED_AREA_PHOTO_REQUESTING';
const SET_DELETED_AREA_PHOTO_SUCCESS = 'SET_DELETED_AREA_PHOTO_SUCCESS';
const SET_DELETED_AREA_PHOTO_FAIL = 'SET_DELETED_AREA_PHOTO_FAIL';

const SET_DELETED_AREA_PHOTOS = 'SET_DELETED_AREA_PHOTOS';
const SET_DELETED_AREA_PHOTOS_REQUESTING = 'SET_DELETED_AREA_PHOTOS_REQUESTING';
const SET_DELETED_AREA_PHOTOS_SUCCESS = 'SET_DELETED_AREA_PHOTOS_SUCCESS';
const SET_DELETED_AREA_PHOTOS_FAIL = 'SET_DELETED_AREA_PHOTOS_FAIL';

export const actionTypes = {
  FETCH_SITE_AREAS,
  FETCH_SITE_AREAS_SUCCESSFULLY,
  FETCH_SITE_AREAS_FAIL,

  FETCH_SITE_AREA,
  FETCH_SITE_AREA_SUCCESSFULLY,
  FETCH_SITE_AREA_FAIL,

  GET_AREA_PHOTOS,
  GET_AREA_PHOTOS_SUCCESS,
  GET_AREA_PHOTOS_FAIL,

  CHANGE_AREA,

  TOGGLE_AREA_PHOTO_DEFECTED,
  TOGGLE_AREA_PHOTO_DEFECTED_SUCCESSFULLY,
  TOGGLE_AREA_PHOTO_DEFECTED_FAIL,

  SET_AREA_PHOTO_DEFECTED_TYPE,
  SET_AREA_PHOTO_DEFECTED_TYPE_SUCCESSFULLY,
  SET_AREA_PHOTO_DEFECTED_TYPE_FAIL,

  SET_AREA_PHOTO_DEFECTED_SEVERITY,
  SET_AREA_PHOTO_DEFECTED_SEVERITY_SUCCESSFULLY,
  SET_AREA_PHOTO_DEFECTED_SEVERITY_FAIL,

  TOGGLE_AREA_PHOTO_REPAIR,
  TOGGLE_AREA_PHOTO_REPAIR_SUCCESSFULLY,
  TOGGLE_AREA_PHOTO_REPAIR_FAIL,

  SET_AREA_PHOTO_REPAIR_NAME,
  SET_AREA_PHOTO_REPAIR_NAME_FAIL,
  SET_AREA_PHOTO_REPAIR_NAME_SUCCESSFULLY,

  // Annotation
  CREATE_ANNOTATION_REQUEST,
  CREATE_ANNOTATION_FAIL,
  CREATE_ANNOTATION_SUCCESS,

  GET_ANNOTATIONS_REQUEST,
  GET_ANNOTATIONS_FAIL,
  GET_ANNOTATIONS_SUCCESS,

  UPDATE_ANNOTATION_REQUEST,
  UPDATE_ANNOTATION_FAIL,
  UPDATE_ANNOTATION_SUCCESS,

  DELETE_ANNOTATION_REQUEST,
  DELETE_ANNOTATION_FAIL,
  DELETE_ANNOTATION_SUCCESS,

  ADD_AREA_PHOTO_REPAIR,
  ADD_AREA_PHOTO_REPAIR_SUCCESS,
  ADD_AREA_PHOTO_REPAIR_FAIL,

  DELETE_AREA_PHOTO_REPAIR,
  DELETE_AREA_PHOTO_REPAIR_SUCCESS,
  DELETE_AREA_PHOTO_REPAIR_FAIL,

  GET_AREA_PHOTO_REPAIRS,
  GET_AREA_PHOTO_REPAIRS_SUCCESS,
  GET_AREA_PHOTO_REPAIRS_FAIL,

  SET_DELETED_AREA_PHOTO,
  SET_DELETED_AREA_PHOTO_REQUESTING,
  SET_DELETED_AREA_PHOTO_SUCCESS,
  SET_DELETED_AREA_PHOTO_FAIL,

  SET_DELETED_AREA_PHOTOS,
  SET_DELETED_AREA_PHOTOS_REQUESTING,
  SET_DELETED_AREA_PHOTOS_SUCCESS,
  SET_DELETED_AREA_PHOTOS_FAIL,
};

const fetchSiteAreas = createAction(FETCH_SITE_AREAS);
const fetchSiteAreasSuccessfully = createAction(FETCH_SITE_AREAS_SUCCESSFULLY);
const fetchSiteAreasFail = createAction(FETCH_SITE_AREAS_FAIL);

const fetchSiteArea = createAction(FETCH_SITE_AREA);
const fetchSiteAreaSuccessfully = createAction(FETCH_SITE_AREA_SUCCESSFULLY);
const fetchSiteAreaFail = createAction(FETCH_SITE_AREA_FAIL);

const getAreaPhotos = createAction(GET_AREA_PHOTOS);
const getAreaPhotosSuccess = createAction(GET_AREA_PHOTOS_SUCCESS);
const getAreaPhotosFailed = createAction(GET_AREA_PHOTOS_FAIL);

const changeAreaId = createAction(CHANGE_AREA);

const toggleAreaPhotoDefected = createAction(TOGGLE_AREA_PHOTO_DEFECTED);
const toggleAreaPhotoDefectedSuccessfully = createAction(TOGGLE_AREA_PHOTO_DEFECTED_SUCCESSFULLY);
const toggleAreaPhotoDefectedFail = createAction(TOGGLE_AREA_PHOTO_DEFECTED_FAIL);

const setAreaPhotoDefectedType = createAction(SET_AREA_PHOTO_DEFECTED_TYPE);
const setAreaPhotoDefectedTypeSuccessfully = createAction(SET_AREA_PHOTO_DEFECTED_TYPE_SUCCESSFULLY);
const setAreaPhotoDefectedTypeFail = createAction(SET_AREA_PHOTO_DEFECTED_TYPE_FAIL);

const setAreaPhotoDefectedSeverity = createAction(SET_AREA_PHOTO_DEFECTED_SEVERITY);
const setAreaPhotoDefectedSeveritySuccessfully = createAction(SET_AREA_PHOTO_DEFECTED_SEVERITY_SUCCESSFULLY);
const setAreaPhotoDefectedSeverityFail = createAction(SET_AREA_PHOTO_DEFECTED_SEVERITY_FAIL);

const toggleAreaPhotoRepair = createAction(TOGGLE_AREA_PHOTO_REPAIR);
const toggleAreaPhotoRepairSuccessfully = createAction(TOGGLE_AREA_PHOTO_REPAIR_SUCCESSFULLY);
const toggleAreaPhotoRepairFail = createAction(TOGGLE_AREA_PHOTO_REPAIR_FAIL);

const setAreaPhotoRepairName = createAction(SET_AREA_PHOTO_REPAIR_NAME);
const setAreaPhotoRepairNameSuccessfully = createAction(SET_AREA_PHOTO_REPAIR_NAME_SUCCESSFULLY);
const setAreaPhotoRepairNameFail = createAction(SET_AREA_PHOTO_REPAIR_NAME_FAIL);

// Annotation
const createAnnotation = createAction(CREATE_ANNOTATION_REQUEST);
const createAnnotationSuccessfully = createAction(CREATE_ANNOTATION_SUCCESS);
const createAnnotationFail = createAction(CREATE_ANNOTATION_FAIL);

const getAnnotations = createAction(GET_ANNOTATIONS_REQUEST);
const getAnnotationsSuccessfully = createAction(GET_ANNOTATIONS_SUCCESS);
const getAnnotationsFail = createAction(GET_ANNOTATIONS_FAIL);

const updateAnnotation = createAction(UPDATE_ANNOTATION_REQUEST);
const updateAnnotationSuccessfully = createAction(UPDATE_ANNOTATION_SUCCESS);
const updateAnnotationFail = createAction(UPDATE_ANNOTATION_FAIL);

const deleteAnnotation = createAction(DELETE_ANNOTATION_REQUEST);
const deleteAnnotationSuccessfully = createAction(DELETE_ANNOTATION_SUCCESS);
const deleteAnnotationFail = createAction(DELETE_ANNOTATION_FAIL);

const addAreaPhotoRepair = createAction(ADD_AREA_PHOTO_REPAIR);
const addAreaPhotoRepairSuccess = createAction(ADD_AREA_PHOTO_REPAIR_SUCCESS);
const addAreaPhotoRepairFail = createAction(ADD_AREA_PHOTO_REPAIR_FAIL);

const deleteAreaPhotoRepair = createAction(DELETE_AREA_PHOTO_REPAIR);
const deleteAreaPhotoRepairSuccess = createAction(DELETE_AREA_PHOTO_REPAIR_SUCCESS);
const deleteAreaPhotoRepairFail = createAction(DELETE_AREA_PHOTO_REPAIR_FAIL);

const getAreaPhotoRepairs = createAction(GET_AREA_PHOTO_REPAIRS);
const getAreaPhotoRepairsSuccess = createAction(GET_AREA_PHOTO_REPAIRS_SUCCESS);
const getAreaPhotoRepairsFail = createAction(GET_AREA_PHOTO_REPAIRS_FAIL);

const setDeletedAreaPhoto = createAction(SET_DELETED_AREA_PHOTO);
const setDeletedAreaPhotoRequesting = createAction(SET_DELETED_AREA_PHOTO_REQUESTING);
const setDeletedAreaPhotoSuccess = createAction(SET_DELETED_AREA_PHOTO_SUCCESS);
const setDeletedAreaPhotoFail = createAction(SET_DELETED_AREA_PHOTO_FAIL);

const setDeletedAreaPhotos = createAction(SET_DELETED_AREA_PHOTOS);
const setDeletedAreaPhotosRequesting = createAction(SET_DELETED_AREA_PHOTOS_REQUESTING);
const setDeletedAreaPhotosSuccess = createAction(SET_DELETED_AREA_PHOTOS_SUCCESS);
const setDeletedAreaPhotosFail = createAction(SET_DELETED_AREA_PHOTOS_FAIL);


export const actions = {
  fetchSiteAreas,
  fetchSiteAreasSuccessfully,
  fetchSiteAreasFail,

  fetchSiteArea,
  fetchSiteAreaSuccessfully,
  fetchSiteAreaFail,

  changeAreaId,

  getAreaPhotos,
  getAreaPhotosSuccess,
  getAreaPhotosFailed,

  toggleAreaPhotoDefected,
  toggleAreaPhotoDefectedSuccessfully,
  toggleAreaPhotoDefectedFail,

  setAreaPhotoDefectedType,
  setAreaPhotoDefectedTypeSuccessfully,
  setAreaPhotoDefectedTypeFail,

  setAreaPhotoDefectedSeverity,
  setAreaPhotoDefectedSeveritySuccessfully,
  setAreaPhotoDefectedSeverityFail,

  toggleAreaPhotoRepair,
  toggleAreaPhotoRepairFail,
  toggleAreaPhotoRepairSuccessfully,

  setAreaPhotoRepairName,
  setAreaPhotoRepairNameSuccessfully,
  setAreaPhotoRepairNameFail,

  // Annotation
  createAnnotation,
  createAnnotationFail,
  createAnnotationSuccessfully,

  getAnnotations,
  getAnnotationsSuccessfully,
  getAnnotationsFail,

  updateAnnotation,
  updateAnnotationSuccessfully,
  updateAnnotationFail,

  deleteAnnotation,
  deleteAnnotationSuccessfully,
  deleteAnnotationFail,

  addAreaPhotoRepair,
  addAreaPhotoRepairSuccess,
  addAreaPhotoRepairFail,

  deleteAreaPhotoRepair,
  deleteAreaPhotoRepairSuccess,
  deleteAreaPhotoRepairFail,

  getAreaPhotoRepairs,
  getAreaPhotoRepairsSuccess,
  getAreaPhotoRepairsFail,

  setDeletedAreaPhoto,
  setDeletedAreaPhotoRequesting,
  setDeletedAreaPhotoSuccess,
  setDeletedAreaPhotoFail,

  setDeletedAreaPhotos,
  setDeletedAreaPhotosRequesting,
  setDeletedAreaPhotosSuccess,
  setDeletedAreaPhotosFail,
};

const initialState = fromJS({
  isLoading: false,
  isAreaLoading: false,
  isAnnotationLoading: false,
  annotations: [],
  annotationError: null,
  areas: [],
  areasError: null,
  currentAreaId: null,
  areaDetail: {},
  syncedPhotosCount: 0,
  remainingPhotosCount: 0,
  isSyncing: false,
  syncError: false,
  showSuccessMessage: false,
  showErrorMessage: false,
});

const fetchSiteAreasHandler = (state) =>
  state
    .set('isLoading', true)
    .set('areaDetail', {})
    .set('areas', []);

const fetchSiteAreasSuccessfullyHandler = (state, action) =>
  state.set('isLoading', false).set('areas', action.payload);

const fetchSiteAreasFailHandler = (state, action) =>
  state.set('isLoading', false).set('areasError', action.payload.error);

const fetchSiteAreaHandler = (state) => state.set('isAreaLoading', true);

const fetchSiteAreaSuccessfullyHandler = (state, action) =>
  state.set('isAreaLoading', false).set('areaDetail', action.payload);

const fetchSiteAreaFailHandler = (state, action) =>
  state
    .set('isAreaLoading', false)
    .set('areaDetail', {})
    .set('areasError', action.payload.error);

const changeAreaIdHandler = (state, action) =>
  state
    .set('currentAreaId', action.payload.areaId)
    .set('isAreaLoading', true);

// Get area photos
const getAreaPhotosHandler = (state) => state.set('isLoading', true);

const getAreaPhotosErrorHandler = (state, action) =>
  state.set('error', action.payload).set('isLoading', false);

const getAreaPhotosSuccessHandler = (state, action) => {
  const { siteId, areaId, photos } = action.payload;
  const areaPhotos = state.get('areaPhotos') || {};
  areaPhotos[areaId] = { siteId, areaId, photos };
  return state
    .set('areaPhotos', areaPhotos)
    .set('error', null)
    .set('isLoading', false);
};

const toggleAreaPhotoDefectedHandler = (state, action) => {
  const {
    payload: { photos = [] },
    params: { areaId, siteId, photoId, defected },
  } = action.payload;

  const updatedPhotos = photos.map((photo) => {
    if (photo.id !== photoId) return photo;

    return {
      ...photo,
      defected,
    };
  });

  const areaPhotos = { ...state.areaPhotos };
  areaPhotos[areaId] = { siteId, areaId, photos: updatedPhotos };

  const areaDetail = { ...state.areaDetail, photos: updatedPhotos };

  return state.set('areaDetail', areaDetail).set('areaPhotos', areaPhotos);
};

const toggleAreaPhotoDefectedSuccessHandler = (state) => state;

const toggleAreaPhotoDefectedFailHandler = (state) => state;

const setAreaPhotoDefectedTypeHandler = (state, action) => {
  const {
    payload: { photos = [] },
    params: { photoId, repairId },
  } = action.payload;

  const updatedPhotos = photos.map((photo) => {
    if (photo.id !== photoId) return photo;

    return {
      ...photo,
      repairId,
    };
  });

  return state.set('areaDetail', { ...state.areaDetail, photos: updatedPhotos });
};

const setAreaPhotoDefectedTypeSuccessHandler = (state) => state;

const setAreaPhotoDefectedTypeFailHandler = (state) => state;

const toggleAreaPhotoRepairHandler = (state, action) => {
  const { payload: { photos = [] }, params: { areaId, siteId, photoId, repair } } = action.payload;

  const updatedPhotos = photos.map((photo, index) => {
    if (photo.id !== photoId) return photo;

    const photoUpdated = state.get('areaDetail').photos[index];

    return {
      ...photo,
      repair,
      repairName: photoUpdated && photoUpdated.repairName,
    };
  });

  const areaPhotos = { ...state.areaPhotos };
  areaPhotos[areaId] = { siteId, areaId, photos: updatedPhotos };

  const areaDetail = { ...state.areaDetail, photos: updatedPhotos };

  return state.set('areaDetail', areaDetail).set('areaPhotos', areaPhotos);
};

const toggleAreaPhotoRepairSuccessHandler = (state) => state;

const toggleAreaPhotoRepairFailHandler = (state) => state;

const setAreaPhotoRepairNameHandler = (state, action) => {
  const { payload: { photos = [] }, params: { areaId, siteId, photoId, repairName } } = action.payload;

  const updatedPhotos = photos.map((photo) => {
    if (photo.id !== photoId) return photo;

    return {
      ...photo,
      repairName,
    };
  });

  const areaPhotos = { ...state.areaPhotos };
  areaPhotos[areaId] = { siteId, areaId, photos: updatedPhotos };

  const areaDetail = { ...state.areaDetail, photos: updatedPhotos };

  return state.set('areaDetail', areaDetail).set('areaPhotos', areaPhotos);
};

const setAreaPhotoRepairNameSuccessHandler = (state) => state;

const setAreaPhotoRepairNameFailHandler = (state) => state;

const setAreaPhotoDefectedSeverityHandler = (state, action) => {
  const {
    payload: { photos = [] },
    params: { photoId, severity },
  } = action.payload;

  const updatedPhotos = photos.map((photo) => {
    if (photo.id !== photoId) return photo;

    return {
      ...photo,
      severity,
    };
  });

  return state.set('areaDetail', { ...state.areaDetail, photos: updatedPhotos });
};

const setAreaPhotoDefectedSeveritySuccessfullyHandler = (state) => state;

const setAreaPhotoDefectedSeverityFailHandler = (state) => state;

const addAreaPhotoRepairHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', true);
const addAreaPhotoRepairSuccessHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', false);
const addAreaPhotoRepairErrorHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', false);

const deleteAreaPhotoRepairHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', true);
const deleteAreaPhotoRepairSuccessHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', false);
const deleteAreaPhotoRepairFailHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', false);

const getAreaPhotoRepairsHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', true);
const getAreaPhotoRepairsSuccessHandler = (state, action) =>
  state.set('isAreaPhotoRepairLoading', false)
    .set('repairs', action.payload);
const getAreaPhotoRepairsFailHandler = (state) =>
  state.set('isAreaPhotoRepairLoading', false);

// Anotaion
const createAnnotationHandler = (state) => state.set('isAnnotationLoading', true);

const createAnnotationFailHandler = (state, action) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotationError', action.payload);

const createAnnotationSuccessfullyHandler = (state) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotationError', null);

const getAnnotationsHandler = (state) => state.set('isAnnotationLoading', true);

const getAnnotationsFailHandler = (state, action) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotationError', action.payload);

const getAnnotationsSuccessfullyHandler = (state, action) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotations', action.payload)
    .set('annotationError', null);

const updateAnnotationHandler = (state) => state.set('isAnnotationLoading', true);

const updateAnnotationFailHandler = (state, action) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotationError', action.payload);

const updateAnnotationSuccessfullyHandler = (state, action) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotations', action.payload)
    .set('annotationError', null);

const deleteAnnotationHandler = (state, action) => {
  const { annotationId, annotations } = action.payload;
  const updatedAnnotations = annotations.filter((annotation) => annotation._id !== annotationId);
  return state
    .set('isAnnotationLoading', true)
    .set('annotations', updatedAnnotations);
};

const deleteAnnotationFailHandler = (state, action) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotationError', action.payload);

const deleteAnnotationSuccessfullyHandler = (state) =>
  state
    .set('isAnnotationLoading', false)
    .set('annotationError', null);


/** set requesting flag to show loading and  deny user click lot of times */
const setDeletedPhotoRequestingHandler = (state, action) => {
  const photoId = _.get(action, 'payload.photoId');
  const areaDetail = state.get('areaDetail');
  let photos = _.get(areaDetail, 'photos', []) || [];
  photos = _.map(photos, (el) => {
    if (!!el && el.id === photoId) {
      el.requesting = true;// eslint-disable-line no-param-reassign
    }
    return el;
  });
  return state.set('areaDetail', { ...areaDetail, photos });
};

/** set flag deleted and requesting with new value */
const setDeletedPhotoSuccessHandler = (state, action) => {
  const photoId = _.get(action, 'payload.photoId');
  const isDeleted = _.get(action, 'payload.isDeleted');
  const areaDetail = state.get('areaDetail');
  let photos = _.get(areaDetail, 'photos', []) || [];
  photos = _.map(photos, (el) => {
    if (!!el && el.id === photoId) {
      el.deleted = isDeleted;// eslint-disable-line no-param-reassign
      el.requesting = false;// eslint-disable-line no-param-reassign
    }
    return el;
  });
  return state.set('areaDetail', { ...areaDetail, photos });
};

/** restore requesting flag */
const setDeletedPhotoFailHandler = (state, action) => {
  const photoId = _.get(action, 'payload.photoId');
  const areaDetail = state.get('areaDetail');
  let photos = _.get(areaDetail, 'photos', []) || [];
  photos = _.map(photos, (el) => {
    if (!!el && el.id === photoId) {
      el.requesting = false;// eslint-disable-line no-param-reassign
    }
    return el;
  });
  return state.set('areaDetail', { ...areaDetail, photos });
};

/** set requesting flag to show loading and  deny user click lot of times */
const setDeletedAreaPhotosRequestingHandler = (state, action) => {
  const areaId = _.get(action, 'payload.areaId');
  const areas = state.get('areas');
  let photoAreas = _.get(areas, 'photoAreas', []) || [];
  photoAreas = _.map(photoAreas, (el) => {
    if (!!el && el.id === areaId) {
      el.requesting = true;// eslint-disable-line no-param-reassign
    }
    return el;
  });
  return state.set('areas', { ...areas, photoAreas });
};

/** set flag deleted and requesting with new value */
const setDeletedAreaPhotosSuccessHandler = (state, action) => {
  const areaId = _.get(action, 'payload.areaId');
  const areas = state.get('areas');
  let photoAreas = _.get(areas, 'photoAreas', []) || [];
  photoAreas = _.map(photoAreas, (el) => {
    if (!!el && el.id === areaId) {
      el.requesting = false;// eslint-disable-line no-param-reassign
      el.deleted = true;// eslint-disable-line no-param-reassign
    }
    return el;
  });
  return state.set('areas', { ...areas, photoAreas });
};

/** restore requesting flag */
const setDeletedAreaPhotosFailHandler = (state, action) => {
  const areaId = _.get(action, 'payload.areaId');
  const areas = state.get('areas');
  let photoAreas = _.get(areas, 'photoAreas', []) || [];
  photoAreas = _.map(photoAreas, (el) => {
    if (!!el && el.id === areaId) {
      el.requesting = false;// eslint-disable-line no-param-reassign
    }
    return el;
  });
  return state.set('areas', { ...areas, photoAreas });
};

export default typeToReducer(
  {
    [FETCH_SITE_AREAS]: fetchSiteAreasHandler,
    [FETCH_SITE_AREAS_SUCCESSFULLY]: fetchSiteAreasSuccessfullyHandler,
    [FETCH_SITE_AREAS_FAIL]: fetchSiteAreasFailHandler,

    [FETCH_SITE_AREA]: fetchSiteAreaHandler,
    [FETCH_SITE_AREA_SUCCESSFULLY]: fetchSiteAreaSuccessfullyHandler,
    [FETCH_SITE_AREA_FAIL]: fetchSiteAreaFailHandler,

    [CHANGE_AREA]: changeAreaIdHandler,

    [GET_AREA_PHOTOS]: getAreaPhotosHandler,
    [GET_AREA_PHOTOS_SUCCESS]: getAreaPhotosSuccessHandler,
    [GET_AREA_PHOTOS_FAIL]: getAreaPhotosErrorHandler,

    [TOGGLE_AREA_PHOTO_DEFECTED]: toggleAreaPhotoDefectedHandler,
    [TOGGLE_AREA_PHOTO_DEFECTED_SUCCESSFULLY]: toggleAreaPhotoDefectedSuccessHandler,
    [TOGGLE_AREA_PHOTO_DEFECTED_FAIL]: toggleAreaPhotoDefectedFailHandler,

    [SET_AREA_PHOTO_DEFECTED_TYPE]: setAreaPhotoDefectedTypeHandler,
    [SET_AREA_PHOTO_DEFECTED_TYPE_SUCCESSFULLY]: setAreaPhotoDefectedTypeSuccessHandler,
    [SET_AREA_PHOTO_DEFECTED_TYPE_FAIL]: setAreaPhotoDefectedTypeFailHandler,

    [SET_AREA_PHOTO_DEFECTED_SEVERITY]: setAreaPhotoDefectedSeverityHandler,
    [SET_AREA_PHOTO_DEFECTED_SEVERITY_FAIL]: setAreaPhotoDefectedSeveritySuccessfullyHandler,

    [SET_AREA_PHOTO_DEFECTED_SEVERITY_SUCCESSFULLY]: setAreaPhotoDefectedSeverityFailHandler,
    [TOGGLE_AREA_PHOTO_REPAIR]: toggleAreaPhotoRepairHandler,
    [TOGGLE_AREA_PHOTO_REPAIR_SUCCESSFULLY]: toggleAreaPhotoRepairSuccessHandler,
    [TOGGLE_AREA_PHOTO_REPAIR_FAIL]: toggleAreaPhotoRepairFailHandler,

    [SET_AREA_PHOTO_REPAIR_NAME]: setAreaPhotoRepairNameHandler,
    [SET_AREA_PHOTO_REPAIR_NAME_SUCCESSFULLY]: setAreaPhotoRepairNameSuccessHandler,
    [SET_AREA_PHOTO_REPAIR_NAME_FAIL]: setAreaPhotoRepairNameFailHandler,

    [ADD_AREA_PHOTO_REPAIR]: addAreaPhotoRepairHandler,
    [ADD_AREA_PHOTO_REPAIR_SUCCESS]: addAreaPhotoRepairSuccessHandler,
    [ADD_AREA_PHOTO_REPAIR_FAIL]: addAreaPhotoRepairErrorHandler,

    [DELETE_AREA_PHOTO_REPAIR]: deleteAreaPhotoRepairHandler,
    [DELETE_AREA_PHOTO_REPAIR_SUCCESS]: deleteAreaPhotoRepairSuccessHandler,
    [DELETE_AREA_PHOTO_REPAIR_FAIL]: deleteAreaPhotoRepairFailHandler,

    [GET_AREA_PHOTO_REPAIRS]: getAreaPhotoRepairsHandler,
    [GET_AREA_PHOTO_REPAIRS_SUCCESS]: getAreaPhotoRepairsSuccessHandler,
    [GET_AREA_PHOTO_REPAIRS_FAIL]: getAreaPhotoRepairsFailHandler,

    // Anotation
    [CREATE_ANNOTATION_REQUEST]: createAnnotationHandler,
    [CREATE_ANNOTATION_FAIL]: createAnnotationFailHandler,
    [CREATE_ANNOTATION_SUCCESS]: createAnnotationSuccessfullyHandler,

    [GET_ANNOTATIONS_REQUEST]: getAnnotationsHandler,
    [GET_ANNOTATIONS_FAIL]: getAnnotationsFailHandler,
    [GET_ANNOTATIONS_SUCCESS]: getAnnotationsSuccessfullyHandler,

    [UPDATE_ANNOTATION_REQUEST]: updateAnnotationHandler,
    [UPDATE_ANNOTATION_FAIL]: updateAnnotationFailHandler,
    [UPDATE_ANNOTATION_SUCCESS]: updateAnnotationSuccessfullyHandler,

    [DELETE_ANNOTATION_REQUEST]: deleteAnnotationHandler,
    [DELETE_ANNOTATION_FAIL]: deleteAnnotationFailHandler,
    [DELETE_ANNOTATION_SUCCESS]: deleteAnnotationSuccessfullyHandler,


    [SET_DELETED_AREA_PHOTO_REQUESTING]: setDeletedPhotoRequestingHandler,
    [SET_DELETED_AREA_PHOTO_SUCCESS]: setDeletedPhotoSuccessHandler,
    [SET_DELETED_AREA_PHOTO_FAIL]: setDeletedPhotoFailHandler,

    [SET_DELETED_AREA_PHOTOS_REQUESTING]: setDeletedAreaPhotosRequestingHandler,
    [SET_DELETED_AREA_PHOTOS_SUCCESS]: setDeletedAreaPhotosSuccessHandler,
    [SET_DELETED_AREA_PHOTOS_FAIL]: setDeletedAreaPhotosFailHandler,
  },
  initialState
);
