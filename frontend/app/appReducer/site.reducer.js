import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_SITE_REQUEST = 'ADD_SITE_REQUEST';
const ADD_SITE_REQUEST_FAILED = 'ADD_SITE_REQUEST_FAILED';
const ADD_SITE_REQUEST_SUCCESS = 'ADD_SITE_REQUEST_SUCCESS';

const EDIT_SITE_REQUEST = 'EDIT_SITE_REQUEST';
const EDIT_SITE_REQUEST_FAILED = 'EDIT_SITE_REQUEST_FAILED';
const EDIT_SITE_REQUEST_SUCCESS = 'EDIT_SITE_REQUEST_SUCCESS';

const DELETE_SITE_REQUEST = 'DELETE_SITE_REQUEST';
const DELETE_SITE_REQUEST_FAILED = 'DELETE_REQUEST_FAILED';
const DELETE_SITE_REQUEST_SUCCESS = 'DELETE_REQUEST_SUCCESS';

const SHOW_ADD_SITE = 'SHOW_ADD_SITE';

const GET_SITES_REQUEST = 'GET_SITES_REQUEST';
const GET_SITES_ERROR = 'GET_SITES_ERROR';
const GET_SITES_SUCCESS = 'GET_SITES_SUCCESS';

const GET_SITE_ORTHO_REQUEST = 'GET_SITE_ORTHO_REQUEST';
const GET_SITE_ORTHO_SUCCESS = 'GET_SITE_ORTHO_SUCCESS';
const GET_SITE_ORTHO_ERROR = 'GET_SITE_ORTHO_ERROR';

const CLEAR_SITE_ERROR = 'CLEAR_SITE_ERROR';

export const actionTypes = {
  ADD_SITE_REQUEST,
  ADD_SITE_REQUEST_FAILED,
  ADD_SITE_REQUEST_SUCCESS,

  EDIT_SITE_REQUEST,
  EDIT_SITE_REQUEST_FAILED,
  EDIT_SITE_REQUEST_SUCCESS,

  DELETE_SITE_REQUEST,
  DELETE_SITE_REQUEST_FAILED,
  DELETE_SITE_REQUEST_SUCCESS,

  GET_SITES_REQUEST,
  GET_SITES_ERROR,
  GET_SITES_SUCCESS,

  GET_SITE_ORTHO_SUCCESS,
  GET_SITE_ORTHO_REQUEST,
  GET_SITE_ORTHO_ERROR,

  CLEAR_SITE_ERROR,
};

// ------------------------------------
// Actions
// ------------------------------------

const showAddSite = createAction(SHOW_ADD_SITE);

const addSiteRequest = createAction(ADD_SITE_REQUEST);
const addSiteRequestFailed = createAction(ADD_SITE_REQUEST_FAILED);
const addSiteRequestSuccess = createAction(ADD_SITE_REQUEST_SUCCESS);

const editSiteRequest = createAction(EDIT_SITE_REQUEST);
const editSiteRequestFailed = createAction(EDIT_SITE_REQUEST_FAILED);
const editSiteRequestSuccess = createAction(EDIT_SITE_REQUEST_SUCCESS);

const deleteSiteRequest = createAction(DELETE_SITE_REQUEST);
const deleteSiteRequestFailed = createAction(DELETE_SITE_REQUEST_FAILED);
const deleteSiteRequestSuccess = createAction(DELETE_SITE_REQUEST_SUCCESS);

const getSitesRequest = createAction(GET_SITES_REQUEST);
const getSitesError = createAction(GET_SITES_ERROR);
const getSitesSuccess = createAction(GET_SITES_SUCCESS);

const getSiteOrthoRequest = createAction(GET_SITE_ORTHO_REQUEST);
const getSiteOrthoSuccess = createAction(GET_SITE_ORTHO_SUCCESS);
const getSiteOrthoError = createAction(GET_SITE_ORTHO_ERROR);

const clearSiteError = createAction(CLEAR_SITE_ERROR);

export const actions = {
  showAddSite,

  addSiteRequest,
  addSiteRequestFailed,
  addSiteRequestSuccess,

  editSiteRequest,
  editSiteRequestFailed,
  editSiteRequestSuccess,

  deleteSiteRequest,
  deleteSiteRequestFailed,
  deleteSiteRequestSuccess,

  getSitesRequest,
  getSitesError,
  getSitesSuccess,

  getSiteOrthoRequest,
  getSiteOrthoSuccess,
  getSiteOrthoError,

  clearSiteError,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  site: undefined,
  error: null,
  isLoading: false,
  isOpen: false,
  isEditting: false,
  sites: undefined,
  siteOrtho: undefined,
});

// Get orthos

const getSiteOrthoHandler = (state) => state.set('siteOrtho', null).set('isLoading', true);

const getSiteOrthoErrorHandler = (state, action) =>
  state
    .set('siteOrtho', undefined)
    .set('error', action.payload)
    .set('isLoading', false);

const getSiteOrthoSuccessHandler = (state, action) =>
  state
    .set('siteOrtho', action.payload)
    .set('error', null)
    .set('isLoading', false);

// Get sites

const getSitesHandler = (state) => state.set('error', null).set('isLoading', true);

const getSitesErrorHandler = (state, action) =>
  state
    .set('sites', undefined)
    .set('error', action.payload)
    .set('isLoading', false);

const getSitesSuccessHandler = (state, action) =>
  state
    .set('sites', action.payload)
    .set('error', null)
    .set('isLoading', false);

// Add site

const addSiteRequestHandler = (state) => state.set('error', null);

const addSiteRequestFailedHandler = (state = initialState, action) => state.set('error', action.payload);

const addSiteRequestSuccessHandler = (state, action) => state.set('error', null).set('site', action.payload);

// Edit site
const editSiteRequestHandler = (state) => state.set('isEditting', true).set('error', null);

const editSiteRequestFailedHandler = (state = initialState, action) => state.set('isEditting', false).set('error', action.payload);

const editSiteRequestSuccessHandler = (state) => state.set('isEditting', false).set('error', null);

// show
const showAddSiteHandler = (state, action) => state.set('isOpen', action.payload || !state.get('isOpen'));

const clearSiteErrorHandler = (state) => state.set('error', null);

const deleteSiteRequestHandler = (state) => state.set('error', null);
const deleteSiteRequestSuccessHandler = (state) => state.set('error', null);
const deleteSiteRequestFailedHandler = (state = initialState, action) => state.set('error', action.payload);

export default typeToReducer(
  {
    [ADD_SITE_REQUEST]: addSiteRequestHandler,
    [ADD_SITE_REQUEST_SUCCESS]: addSiteRequestSuccessHandler,
    [ADD_SITE_REQUEST_FAILED]: addSiteRequestFailedHandler,

    [EDIT_SITE_REQUEST]: editSiteRequestHandler,
    [EDIT_SITE_REQUEST_SUCCESS]: editSiteRequestSuccessHandler,
    [EDIT_SITE_REQUEST_FAILED]: editSiteRequestFailedHandler,

    [DELETE_SITE_REQUEST]: deleteSiteRequestHandler,
    [DELETE_SITE_REQUEST_SUCCESS]: deleteSiteRequestSuccessHandler,
    [DELETE_SITE_REQUEST_FAILED]: deleteSiteRequestFailedHandler,

    [SHOW_ADD_SITE]: showAddSiteHandler,

    [GET_SITES_REQUEST]: getSitesHandler,
    [GET_SITES_ERROR]: getSitesErrorHandler,
    [GET_SITES_SUCCESS]: getSitesSuccessHandler,

    [GET_SITES_ERROR]: getSitesErrorHandler,
    [GET_SITES_SUCCESS]: getSitesSuccessHandler,

    [GET_SITE_ORTHO_REQUEST]: getSiteOrthoHandler,
    [GET_SITE_ORTHO_ERROR]: getSiteOrthoErrorHandler,
    [GET_SITE_ORTHO_SUCCESS]: getSiteOrthoSuccessHandler,

    [CLEAR_SITE_ERROR]: clearSiteErrorHandler,
  },
  initialState
);
