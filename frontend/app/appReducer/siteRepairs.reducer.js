import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_SITE_REPAIRS_REQUEST = 'GET_SITE_REPAIRS_REQUEST';
const GET_SITE_REPAIRS_REQUEST_SUCCESS = 'GET_SITE_REPAIRS_REQUEST_SUCCESS';
const GET_SITE_REPAIRS_REQUEST_FAILED = 'GET_SITE_REPAIRS_REQUEST_FAILED';
const SET_SITE_REPAIRS_UNIT_PRICE = 'SET_SITE_REPAIRS_UNIT_PRICE';
const SET_SITE_REPAIRS_UNIT_PRICE_SUCCESS = 'SET_SITE_REPAIRS_UNIT_PRICE_SUCCESS';
const SET_SITE_REPAIRS_UNIT_PRICE_FAILED = 'SET_SITE_REPAIRS_UNIT_PRICE_FAILED';

const ADD_SITE_REPAIRS_REQUEST = 'ADD_SITE_REPAIRS_REQUEST';
const ADD_SITE_REPAIRS_REQUEST_SUCCESS = 'ADD_SITE_REPAIRS_REQUEST_SUCCESS';
const ADD_SITE_REPAIRS_REQUEST_FAILED = 'ADD_SITE_REPAIRS_REQUEST_FAILED';

const CLEAR_SITE_REPAIRS_ERROR = 'CLEAR_SITE_REPAIRS_ERROR';
const OPEN_ADD_SITE_REPAIR_PANE = 'OPEN_ADD_SITE_REPAIR_PANE';
const CLOSE_ADD_SITE_REPAIR_PANE = 'CLOSE_ADD_SITE_REPAIR_PANE';

const DELETE_SITE_REPAIR = 'DELETE_SITE_REPAIR';
const DELETE_SITE_REPAIR_SUCCESS = 'DELETE_SITE_REPAIR_SUCCESS';
const DELETE_SITE_REPAIR_ERROR = 'DELETE_SITE_REPAIR_ERROR';

const GET_SITE_REPAIR_PHOTOS_REQUEST = 'GET_SITE_REPAIR_PHOTOS_REQUEST';
const GET_SITE_REPAIR_PHOTOS_SUCCESS = 'GET_SITE_REPAIR_PHOTOS_SUCCESS';
const GET_SITE_REPAIR_PHOTOS_FAILED = 'GET_SITE_REPAIR_PHOTOS_FAILED';

export const actionTypes = {
  GET_SITE_REPAIRS_REQUEST,
  GET_SITE_REPAIRS_REQUEST_SUCCESS,
  GET_SITE_REPAIRS_REQUEST_FAILED,
  SET_SITE_REPAIRS_UNIT_PRICE,
  SET_SITE_REPAIRS_UNIT_PRICE_SUCCESS,
  SET_SITE_REPAIRS_UNIT_PRICE_FAILED,
  ADD_SITE_REPAIRS_REQUEST,
  ADD_SITE_REPAIRS_REQUEST_SUCCESS,
  ADD_SITE_REPAIRS_REQUEST_FAILED,
  CLEAR_SITE_REPAIRS_ERROR,
  OPEN_ADD_SITE_REPAIR_PANE,
  CLOSE_ADD_SITE_REPAIR_PANE,

  DELETE_SITE_REPAIR,
  DELETE_SITE_REPAIR_SUCCESS,
  DELETE_SITE_REPAIR_ERROR,

  GET_SITE_REPAIR_PHOTOS_REQUEST,
  GET_SITE_REPAIR_PHOTOS_SUCCESS,
  GET_SITE_REPAIR_PHOTOS_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const getSiteRepairsRequest = createAction(GET_SITE_REPAIRS_REQUEST);
const getSiteRepairsRequestSuccess = createAction(GET_SITE_REPAIRS_REQUEST_SUCCESS);
const getSiteRepairsRequestFailed = createAction(GET_SITE_REPAIRS_REQUEST_FAILED);
const setSiteRepairsUnitPrice = createAction(SET_SITE_REPAIRS_UNIT_PRICE);
const setSiteRepairsUnitPriceSuccess = createAction(SET_SITE_REPAIRS_UNIT_PRICE_SUCCESS);
const setSiteRepairsUnitPriceFailed = createAction(SET_SITE_REPAIRS_UNIT_PRICE_FAILED);
const addSiteRepairsRequest = createAction(ADD_SITE_REPAIRS_REQUEST);
const addSiteRepairsRequestSuccess = createAction(ADD_SITE_REPAIRS_REQUEST_SUCCESS);
const addSiteRepairsRequestFailed = createAction(ADD_SITE_REPAIRS_REQUEST_FAILED);
const clearSiteRepairError = createAction(CLEAR_SITE_REPAIRS_ERROR);
const openAddSiteRepairPane = createAction(OPEN_ADD_SITE_REPAIR_PANE);
const closeAddSiteRepairPane = createAction(CLOSE_ADD_SITE_REPAIR_PANE);
const deleteSiteRepair = createAction(DELETE_SITE_REPAIR);
const deleteSiteRepairSuccess = createAction(DELETE_SITE_REPAIR_SUCCESS);
const deleteSiteRepairError = createAction(DELETE_SITE_REPAIR_ERROR);

const getSiteRepairPhotosRequest = createAction(GET_SITE_REPAIR_PHOTOS_REQUEST);
const getSiteRepairPhotosSuccess = createAction(GET_SITE_REPAIR_PHOTOS_SUCCESS);
const getSiteRepairPhotosFailed = createAction(GET_SITE_REPAIR_PHOTOS_FAILED);

export const actions = {
  getSiteRepairsRequest,
  getSiteRepairsRequestSuccess,
  getSiteRepairsRequestFailed,
  setSiteRepairsUnitPrice,
  setSiteRepairsUnitPriceSuccess,
  setSiteRepairsUnitPriceFailed,
  addSiteRepairsRequest,
  addSiteRepairsRequestSuccess,
  addSiteRepairsRequestFailed,
  clearSiteRepairError,
  openAddSiteRepairPane,
  closeAddSiteRepairPane,

  deleteSiteRepair,
  deleteSiteRepairError,
  deleteSiteRepairSuccess,

  getSiteRepairPhotosRequest,
  getSiteRepairPhotosSuccess,
  getSiteRepairPhotosFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  siteRepairs: undefined,
  siteRepairPhotos: undefined,
  isLoading: false,
  isLoadingPhotos: false,
  isAddingSiteRepair: false,
  edittingRepairId: null,
  isOpenAddSiteRepair: false,
});

// Get siteRepairs
const getSiteRepairsHandler = (state, action) =>
  state.set('siteRepairs', null).set('featureType', action.payload.featureType);

const getSiteRepairsSuccessHandler = (state, action) =>
  state.set('siteRepairs', action.payload).set('error', null);

const getSiteRepairsFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

// Get siteRepairPhotos
const getSiteRepairPhotosHandler = (state) =>
  state.set('siteRepairPhotos', null).set('isLoadingPhotos', true);

const getSiteRepairPhotosSuccessHandler = (state, action) =>
  state.set('siteRepairPhotos', action.payload).set('error', null).set('isLoadingPhotos', false);

const getSiteRepairPhotosFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload).set('isLoadingPhotos', false);

// Add siteRepairs
const addSiteRepairsHandler = (state) =>
  state.set('error', null).set('isAddingSiteRepair', true);

const addSiteRepairsSuccessHandler = (state) =>
  state.set('isAddingSiteRepair', false).set('error', null);

const addSiteRepairsFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload).set('isAddingSiteRepair', false);

const clearSiteRepairErrorHandler = (state) =>
  state.set('error', null).set('isAddingSiteRepair', false);

const openAddSiteRepairHandler = (state) =>
  state.set('isOpenAddSiteRepair', true);

const closeAddSiteRepairHandler = (state) =>
  state.set('isOpenAddSiteRepair', false);

const deleteSiteRepairHandler = (state) =>
    state.set('error', null).set('isDeletingSiteRepair', true);

const deleteSiteRepairSuccessHandler = (state) =>
    state.set('error', null).set('isDeletingSiteRepair', false);

const deleteSiteRepairFailedHandler = (state, action) =>
    state.set('error', action.payload).set('isDeletingSiteRepair', false);                                                                          // Set SiteRepairs unitPrice

const setSiteRepairsUnitPriceHandler = (state, action) => {
  const { payload } = action;
  const { featureId, unitPrice, qty } = payload;
  const siteRepairs = [...state.get('siteRepairs')];

  const foundIndex = siteRepairs.findIndex((repair) => repair.id === featureId);
  if (foundIndex !== -1) {
    siteRepairs[foundIndex] = {
      ...siteRepairs[foundIndex],
      unitPrice,
      total: (unitPrice * qty).toFixed(2),
    };
  }

  return state
    .set('siteRepairs', [...siteRepairs])
    .set('edittingRepairId', featureId)
    .set('error', null);
};

const setSiteRepairsUnitPriceSuccessHandler = (state, action) => {
  const { payload } = action;
  const { featureId, total } = payload;
  const siteRepairs = [...state.get('siteRepairs')];

  const foundIndex = siteRepairs.findIndex((repair) => repair.id === featureId);
  if (foundIndex !== -1) {
    const { total: oldTotal } = siteRepairs[foundIndex];
    if (oldTotal !== total) {
      siteRepairs[foundIndex] = { ...siteRepairs[foundIndex], total };
    }
  }

  return state
    .set('siteRepairs', [...siteRepairs])
    .set('edittingRepairId', null)
    .set('error', null);
};

const setSiteRepairsUnitPriceFailedHandler = (state, action) =>
  state.set('edittingRepairId', null).set('error', action.payload);

export default typeToReducer({
  [GET_SITE_REPAIRS_REQUEST]: getSiteRepairsHandler,
  [GET_SITE_REPAIRS_REQUEST_SUCCESS]: getSiteRepairsSuccessHandler,
  [GET_SITE_REPAIRS_REQUEST_FAILED]: getSiteRepairsFailedHandler,
  [SET_SITE_REPAIRS_UNIT_PRICE]: setSiteRepairsUnitPriceHandler,
  [SET_SITE_REPAIRS_UNIT_PRICE_SUCCESS]: setSiteRepairsUnitPriceSuccessHandler,
  [SET_SITE_REPAIRS_UNIT_PRICE_FAILED]: setSiteRepairsUnitPriceFailedHandler,
  [ADD_SITE_REPAIRS_REQUEST]: addSiteRepairsHandler,
  [ADD_SITE_REPAIRS_REQUEST_SUCCESS]: addSiteRepairsSuccessHandler,
  [ADD_SITE_REPAIRS_REQUEST_FAILED]: addSiteRepairsFailedHandler,
  [CLEAR_SITE_REPAIRS_ERROR]: clearSiteRepairErrorHandler,
  [OPEN_ADD_SITE_REPAIR_PANE]: openAddSiteRepairHandler,
  [CLOSE_ADD_SITE_REPAIR_PANE]: closeAddSiteRepairHandler,

  [DELETE_SITE_REPAIR]: deleteSiteRepairHandler,
  [DELETE_SITE_REPAIR_ERROR]: deleteSiteRepairFailedHandler,
  [DELETE_SITE_REPAIR_SUCCESS]: deleteSiteRepairSuccessHandler,

  [GET_SITE_REPAIR_PHOTOS_REQUEST]: getSiteRepairPhotosHandler,
  [GET_SITE_REPAIR_PHOTOS_SUCCESS]: getSiteRepairPhotosSuccessHandler,
  [GET_SITE_REPAIR_PHOTOS_FAILED]: getSiteRepairPhotosFailedHandler,
}, initialState);
