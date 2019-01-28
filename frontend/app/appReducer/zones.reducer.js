import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_ZONES_REQUEST = 'GET_ZONES_REQUEST';
const GET_ZONES_REQUEST_SUCCESS = 'GET_ZONES_REQUEST_SUCCESS';
const GET_ZONES_REQUEST_FAILED = 'GET_ZONES_REQUEST_FAILED';

const GET_ZONE_OPTIONS_REQUEST = 'GET_ZONE_OPTIONS_REQUEST';
const GET_ZONE_OPTIONS_SUCCESS = 'GET_ZONE_OPTIONS_SUCCESS';
const GET_ZONE_OPTIONS_FAILED = 'GET_ZONE_OPTIONS_FAILED';

export const actionTypes = {
  GET_ZONES_REQUEST,
  GET_ZONES_REQUEST_SUCCESS,
  GET_ZONES_REQUEST_FAILED,

  GET_ZONE_OPTIONS_REQUEST,
  GET_ZONE_OPTIONS_SUCCESS,
  GET_ZONE_OPTIONS_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const getZonesRequest = createAction(GET_ZONES_REQUEST);
const getZonesRequestSuccess = createAction(GET_ZONES_REQUEST_SUCCESS);
const getZonesRequestFailed = createAction(GET_ZONES_REQUEST_FAILED);

const getZoneOptionsRequest = createAction(GET_ZONE_OPTIONS_REQUEST);
const getZoneOptionsRequestSuccess = createAction(GET_ZONE_OPTIONS_SUCCESS);
const getZoneOptionsRequestFailed = createAction(GET_ZONE_OPTIONS_FAILED);

export const actions = {
  getZonesRequest,
  getZonesRequestSuccess,
  getZonesRequestFailed,

  getZoneOptionsRequest,
  getZoneOptionsRequestSuccess,
  getZoneOptionsRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  optionError: null,
  zones: undefined,
  zoneOptions: undefined,
});

// Get zones

const getZonesHandler = (state) =>
  state.set('zones', null);

const getZonesSuccessHandler = (state, action) =>
  state.set('zones', action.payload).set('error', null);

const getZonesFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const getZoneOptionsHandler = (state) =>
  state.set('zoneOptions', []);

const getZoneOptionsSuccessHandler = (state, action) =>
  state.set('zoneOptions', action.payload).set('optionError', null);

const getZoneOptionsFailedHandler = (state = initialState, action) =>
  state.set('optionError', action.payload);

export default typeToReducer({
  [GET_ZONES_REQUEST]: getZonesHandler,
  [GET_ZONES_REQUEST_SUCCESS]: getZonesSuccessHandler,
  [GET_ZONES_REQUEST_FAILED]: getZonesFailedHandler,

  [GET_ZONE_OPTIONS_REQUEST]: getZoneOptionsHandler,
  [GET_ZONE_OPTIONS_SUCCESS]: getZoneOptionsSuccessHandler,
  [GET_ZONE_OPTIONS_FAILED]: getZoneOptionsFailedHandler,
}, initialState);
