import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const CREATE_FEATURE_REQUEST = 'CREATE_FEATURE_REQUEST';
const CREATE_FEATURE_REQUEST_SUCCESS = 'CREATE_FEATURE_REQUEST_SUCCESS';
const CREATE_FEATURE_REQUEST_FAILED = 'CREATE_FEATURE_REQUEST_FAILED';

const PUT_FEATURE_REQUEST = 'PUT_FEATURE_REQUEST';
const PUT_FEATURE_REQUEST_SUCCESS = 'PUT_FEATURE_REQUEST_SUCCESS';
const PUT_FEATURE_REQUEST_FAILED = 'PUT_FEATURE_REQUEST_FAILED';

const DELETE_FEATURE_REQUEST = 'DELETE_FEATURE_REQUEST';
const DELETE_FEATURE_REQUEST_SUCCESS = 'DELETE_FEATURE_REQUEST_SUCCESS';
const DELETE_FEATURE_REQUEST_FAILED = 'DELETE_FEATURE_REQUEST_FAILED';

const CUT_FEATURE_REQUEST = 'CUT_FEATURE_REQUEST';
const CUT_FEATURE_REQUEST_SUCCESS = 'CUT_FEATURE_REQUEST_SUCCESS';
const CUT_FEATURE_REQUEST_FAILED = 'CUT_FEATURE_REQUEST_FAILED';


export const actionTypes = {
  CREATE_FEATURE_REQUEST,
  CREATE_FEATURE_REQUEST_SUCCESS,
  CREATE_FEATURE_REQUEST_FAILED,

  PUT_FEATURE_REQUEST,
  PUT_FEATURE_REQUEST_SUCCESS,
  PUT_FEATURE_REQUEST_FAILED,

  DELETE_FEATURE_REQUEST,
  DELETE_FEATURE_REQUEST_SUCCESS,
  DELETE_FEATURE_REQUEST_FAILED,

  CUT_FEATURE_REQUEST,
  CUT_FEATURE_REQUEST_SUCCESS,
  CUT_FEATURE_REQUEST_FAILED,
};


// ------------------------------------
// Actions
// ------------------------------------

const createFeatureRequest = createAction(CREATE_FEATURE_REQUEST);
const createFeatureRequestSuccess = createAction(CREATE_FEATURE_REQUEST_SUCCESS);
const createFeatureRequestFailed = createAction(CREATE_FEATURE_REQUEST_FAILED);

const putFeatureRequest = createAction(PUT_FEATURE_REQUEST);
const putFeatureRequestSuccess = createAction(PUT_FEATURE_REQUEST_SUCCESS);
const putFeatureRequestFailed = createAction(PUT_FEATURE_REQUEST_FAILED);

const deleteFeatureRequest = createAction(DELETE_FEATURE_REQUEST);
const deleteFeatureRequestSuccess = createAction(DELETE_FEATURE_REQUEST_SUCCESS);
const deleteFeatureRequestFailed = createAction(DELETE_FEATURE_REQUEST_FAILED);

const cutFeatureRequest = createAction(CUT_FEATURE_REQUEST);
const cutFeatureRequestSuccess = createAction(CUT_FEATURE_REQUEST_SUCCESS);
const cutFeatureRequestFailed = createAction(CUT_FEATURE_REQUEST_FAILED);

export const actions = {
  createFeatureRequest,
  createFeatureRequestSuccess,
  createFeatureRequestFailed,

  putFeatureRequest,
  putFeatureRequestSuccess,
  putFeatureRequestFailed,

  deleteFeatureRequest,
  deleteFeatureRequestSuccess,
  deleteFeatureRequestFailed,

  cutFeatureRequest,
  cutFeatureRequestSuccess,
  cutFeatureRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  isUpdatingFeature: false,
});

const createFeatureRequestHandler = (state) => state.set('isUpdatingFeature', true);
const createFeatureRequestSuccessHandler = (state) => state.set('isUpdatingFeature', false);
const createFeatureRequestFailedHandler = (state) => state.set('isUpdatingFeature', false);

const putFeatureRequestHandler = (state) => state.set('isUpdatingFeature', true);
const putFeatureRequestSuccessHandler = (state) => state.set('isUpdatingFeature', false);
const putFeatureRequestFailedHandler = (state) => state.set('isUpdatingFeature', false);

const deleteFeatureRequestHandler = (state) => state.set('isUpdatingFeature', true);
const deleteFeatureRequestSuccessHandler = (state) => state.set('isUpdatingFeature', false);
const deleteFeatureRequestFailedHandler = (state) => state.set('isUpdatingFeature', false);

const cutFeatureRequestHandler = (state) => state.set('isUpdatingFeature', true);
const cutFeatureRequestSuccessHandler = (state) => state.set('isUpdatingFeature', false);
const cutFeatureRequestFailedHandler = (state) => state.set('isUpdatingFeature', false);

export default typeToReducer({
  [CREATE_FEATURE_REQUEST]: createFeatureRequestHandler,
  [CREATE_FEATURE_REQUEST_SUCCESS]: createFeatureRequestSuccessHandler,
  [CREATE_FEATURE_REQUEST_FAILED]: createFeatureRequestFailedHandler,

  [PUT_FEATURE_REQUEST]: putFeatureRequestHandler,
  [PUT_FEATURE_REQUEST_SUCCESS]: putFeatureRequestSuccessHandler,
  [PUT_FEATURE_REQUEST_FAILED]: putFeatureRequestFailedHandler,

  [DELETE_FEATURE_REQUEST]: deleteFeatureRequestHandler,
  [DELETE_FEATURE_REQUEST_SUCCESS]: deleteFeatureRequestSuccessHandler,
  [DELETE_FEATURE_REQUEST_FAILED]: deleteFeatureRequestFailedHandler,

  [CUT_FEATURE_REQUEST]: cutFeatureRequestHandler,
  [CUT_FEATURE_REQUEST_SUCCESS]: cutFeatureRequestSuccessHandler,
  [CUT_FEATURE_REQUEST_FAILED]: cutFeatureRequestFailedHandler,
}, initialState);
