import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_CLIENT_REQUEST = 'ADD_CLIENT_REQUEST';
const ADD_CLIENT_REQUEST_FAILED = 'ADD_CLIENT_REQUEST_FAILED';
const ADD_CLIENT_REQUEST_SUCCESS = 'ADD_CLIENT_REQUEST_SUCCESS';
const SHOW_ADD_CLIENT = 'SHOW_ADD_CLIENT';

const EDIT_CLIENT_REQUEST = 'EDIT_CLIENT_REQUEST';
const EDIT_CLIENT_REQUEST_FAILED = 'EDIT_CLIENT_REQUEST_FAILED';
const EDIT_CLIENT_REQUEST_SUCCESS = 'EDIT_CLIENT_REQUEST_SUCCESS';

const GET_CLIENTS_REQUEST = 'GET_CLIENTS_REQUEST';
const GET_CLIENTS_SUCCESS = 'GET_CLIENTS_SUCCESS';

const DELETE_CLIENT_REQUEST = 'DELETE_CLIENT_REQUEST';
const DELETE_CLIENT_REQUEST_FAILED = 'DELETE_CLIENT_REQUEST_FAILED';
const DELETE_CLIENT_REQUEST_SUCCESS = 'DELETE_CLIENT_REQUEST_SUCCESS';

const UPLOAD_COMPANY_LOGO = 'UPLOAD_COMPANY_LOGO';
const UPLOAD_COMPANY_LOGO_FAILED = 'UPLOAD_COMPANY_LOGO_FAILED';
const UPLOAD_COMPANY_LOGO_SUCCESS = 'UPLOAD_COMPANY_LOGO_SUCCESS';

const DELETE_COMPANY_LOGO = 'DELETE_COMPANY_LOGO';
const DELETE_COMPANY_LOGO_FAILED = 'DELETE_COMPANY_LOGO_FAILED';
const DELETE_COMPANY_LOGO_SUCCESS = 'DELETE_COMPANY_LOGO_SUCCESS';

export const actionTypes = {
  ADD_CLIENT_REQUEST,
  ADD_CLIENT_REQUEST_FAILED,
  ADD_CLIENT_REQUEST_SUCCESS,

  EDIT_CLIENT_REQUEST,
  EDIT_CLIENT_REQUEST_FAILED,
  EDIT_CLIENT_REQUEST_SUCCESS,

  GET_CLIENTS_REQUEST,
  GET_CLIENTS_SUCCESS,
  DELETE_CLIENT_REQUEST,
  DELETE_CLIENT_REQUEST_FAILED,
  DELETE_CLIENT_REQUEST_SUCCESS,

  UPLOAD_COMPANY_LOGO,
  UPLOAD_COMPANY_LOGO_FAILED,
  UPLOAD_COMPANY_LOGO_SUCCESS,

  DELETE_COMPANY_LOGO,
  DELETE_COMPANY_LOGO_SUCCESS,
  DELETE_COMPANY_LOGO_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const showAddClient = createAction(SHOW_ADD_CLIENT);
const addClientRequest = createAction(ADD_CLIENT_REQUEST);
const addClientRequestFailed = createAction(ADD_CLIENT_REQUEST_FAILED);
const addClientRequestSuccess = createAction(ADD_CLIENT_REQUEST_SUCCESS);

const editClientRequest = createAction(EDIT_CLIENT_REQUEST);
const editClientRequestFailed = createAction(EDIT_CLIENT_REQUEST_FAILED);
const editClientRequestSuccess = createAction(EDIT_CLIENT_REQUEST_SUCCESS);

const getClientsRequest = createAction(GET_CLIENTS_REQUEST);
const getClientsSuccess = createAction(GET_CLIENTS_SUCCESS);

const deleteClientRequest = createAction(DELETE_CLIENT_REQUEST);
const deleteClientRequestFailed = createAction(DELETE_CLIENT_REQUEST_FAILED);
const deleteClientRequestSuccess = createAction(DELETE_CLIENT_REQUEST_SUCCESS);

const uploadCompanyLogo = createAction(UPLOAD_COMPANY_LOGO);
const uploadCompanyLogoFailed = createAction(UPLOAD_COMPANY_LOGO_FAILED);
const uploadCompanyLogoSuccess = createAction(UPLOAD_COMPANY_LOGO_SUCCESS);

const deleteCompanyLogo = createAction(DELETE_COMPANY_LOGO);
const deleteCompanyLogoFailed = createAction(DELETE_COMPANY_LOGO_FAILED);
const deleteCompanyLogoSuccess = createAction(DELETE_COMPANY_LOGO_SUCCESS);

export const actions = {
  addClientRequest,
  addClientRequestFailed,
  addClientRequestSuccess,

  editClientRequest,
  editClientRequestFailed,
  editClientRequestSuccess,

  showAddClient,
  getClientsRequest,
  getClientsSuccess,
  deleteClientRequest,
  deleteClientRequestFailed,
  deleteClientRequestSuccess,

  uploadCompanyLogo,
  uploadCompanyLogoFailed,
  uploadCompanyLogoSuccess,

  deleteCompanyLogo,
  deleteCompanyLogoFailed,
  deleteCompanyLogoSuccess,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  client: undefined,
  error: null,
  isOpen: false,
  clients: undefined,
  isEditing: false,
  errorEditing: null,
  companyLogo: {
    URL: null,
    key: '',
    isUploading: false,
    error: null,
  },
});

// Get clients

const getClientsHandler = (state) =>
  state.set('error', null);

const getClientsSuccessHandler = (state, action) =>
  state.set('clients', action.payload).set('error', null);


// Add client

const addClientRequestHandler = (state) =>
  state.set('error', null);

const addClientRequestFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const addClientRequestSuccessHandler = (state, action) =>
  state.set('error', null)
  .set('client', action.payload)
  .set('companyLogo', {
    isUploading: false,
    error: null,
    URL: null,
    key: '',
  });

// Edit client
const editClientRequestHandler = (state) =>
  state.set('errorEditing', null).set('isEditing', true);

const editClientRequestFailedHandler = (state = initialState, action) =>
  state.set('errorEditing', action.payload).set('isEditing', false);

const editClientRequestSuccessHandler = (state) =>
  state.set('errorEditing', null).set('isEditing', false);


const showAddClientHandler = (state, action) =>
  state.set('isOpen', action.payload || !(state.get('isOpen')));

// delete
const deleteClientRequestHandler = (state) => state.set('error', null);
const deleteClientRequestSuccessHandler = (state) => state.set('error', null);
const deleteClientRequestFailedHandler = (state = initialState, action) => state.set('error', action.payload);

// upload company logo
const uploadCompanyLogoRequestHandler = (state) =>
  state.set('companyLogo', {
    isUploading: true,
    error: null,
    URL: null,
    key: '',
  }
);

const uploadCompanyLogoRequestSuccessHandler = (state, action) =>
  state.set('companyLogo', {
    isUploading: false,
    error: null,
    URL: action.payload.companyLogoURL,
    key: action.payload.companyLogoKey,
  }
);

const uploadCompanyLogoRequestFailedHandler = (state, action) =>
  state.set('companyLogo', {
    isUploading: false,
    error: action.payload.message,
    URL: null,
    key: '',
  }
);

const deleteCompanyLogoRequestHandler = (state) =>
  state.set('companyLogo', {
    isUploading: false,
    error: null,
    URL: null,
    key: '',
  });

export default typeToReducer({
  [ADD_CLIENT_REQUEST]: addClientRequestHandler,
  [ADD_CLIENT_REQUEST_SUCCESS]: addClientRequestSuccessHandler,
  [ADD_CLIENT_REQUEST_FAILED]: addClientRequestFailedHandler,

  [EDIT_CLIENT_REQUEST]: editClientRequestHandler,
  [EDIT_CLIENT_REQUEST_SUCCESS]: editClientRequestSuccessHandler,
  [EDIT_CLIENT_REQUEST_FAILED]: editClientRequestFailedHandler,

  [SHOW_ADD_CLIENT]: showAddClientHandler,

  [GET_CLIENTS_REQUEST]: getClientsHandler,
  [GET_CLIENTS_SUCCESS]: getClientsSuccessHandler,

  [DELETE_CLIENT_REQUEST]: deleteClientRequestHandler,
  [DELETE_CLIENT_REQUEST_SUCCESS]: deleteClientRequestSuccessHandler,
  [DELETE_CLIENT_REQUEST_FAILED]: deleteClientRequestFailedHandler,

  [UPLOAD_COMPANY_LOGO]: uploadCompanyLogoRequestHandler,
  [UPLOAD_COMPANY_LOGO_SUCCESS]: uploadCompanyLogoRequestSuccessHandler,
  [UPLOAD_COMPANY_LOGO_FAILED]: uploadCompanyLogoRequestFailedHandler,

  [DELETE_COMPANY_LOGO]: deleteCompanyLogoRequestHandler,
}, initialState);
