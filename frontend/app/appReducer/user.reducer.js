import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

const INVITE_USER_REQUEST = 'INVITE_USER_REQUEST';
const INVITE_USER_REQUEST_FAILED = 'INVITE_USER_REQUEST_FAILED';
const INVITE_USER_REQUEST_SUCCESS = 'INVITE_USER_REQUEST_SUCCESS';
const SHOW_INVITE_USER = 'SHOW_INVITE_USER';
const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';

const GET_CLIENTS_COLLECTION = 'GET_CLIENTS_COLLECTION';
const GET_CLIENTS_COLLECTION_SUCCESS = 'GET_CLIENTS_COLLECTION_SUCCESS';

const GET_INVITED_USERS_REQUEST = 'GET_INVITED_USERS_REQUEST';
const GET_INVITED_USERS_REQUEST_SUCCESS = 'GET_INVITED_USERS_REQUEST_SUCCESS';

const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
const RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED';
const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';

const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
const CHANGE_PASSWORD_FAILED = 'CHANGE_PASSWORD_FAILED';
const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';


export const actionTypes = {
  INVITE_USER_REQUEST,
  INVITE_USER_REQUEST_FAILED,
  INVITE_USER_REQUEST_SUCCESS,

  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,

  GET_INVITED_USERS_REQUEST,
  GET_INVITED_USERS_REQUEST_SUCCESS,

  GET_CLIENTS_COLLECTION,
  GET_CLIENTS_COLLECTION_SUCCESS,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_SUCCESS,

  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_SUCCESS,
};

const showInviteUser = createAction(SHOW_INVITE_USER);

const inviteUserRequest = createAction(INVITE_USER_REQUEST);
const inviteUserRequestFailed = createAction(INVITE_USER_REQUEST_FAILED);
const inviteUserRequestSuccess = createAction(INVITE_USER_REQUEST_SUCCESS);

const getUsersRequest = createAction(GET_USERS_REQUEST);
const getUsersSuccess = createAction(GET_USERS_SUCCESS);

const getInvitedUsersRequest = createAction(GET_INVITED_USERS_REQUEST);
const getInvitedUsersRequestSuccess = createAction(GET_INVITED_USERS_REQUEST_SUCCESS);

const getClientsCollection = createAction(GET_CLIENTS_COLLECTION);
const getClientsCollectionSuccess = createAction(GET_CLIENTS_COLLECTION_SUCCESS);

const resetPasswordRequest = createAction(RESET_PASSWORD_REQUEST);
const resetPasswordFailed = createAction(RESET_PASSWORD_FAILED);
const resetPasswordSuccess = createAction(RESET_PASSWORD_SUCCESS);

const changePasswordRequest = createAction(CHANGE_PASSWORD_REQUEST);
const changePasswordFailed = createAction(CHANGE_PASSWORD_FAILED);
const changePasswordSuccess = createAction(CHANGE_PASSWORD_SUCCESS);

export const actions = {
  inviteUserRequest,
  inviteUserRequestFailed,
  inviteUserRequestSuccess,

  showInviteUser,

  getUsersRequest,
  getUsersSuccess,

  getInvitedUsersRequest,
  getInvitedUsersRequestSuccess,

  getClientsCollection,
  getClientsCollectionSuccess,

  resetPasswordRequest,
  resetPasswordFailed,
  resetPasswordSuccess,

  changePasswordRequest,
  changePasswordFailed,
  changePasswordSuccess,
};

const initialState = fromJS({
  user: undefined,
  error: null,
  isOpen: false,
  users: undefined,
  token: null,
  clients: undefined,
});

// GET USER
const getUsersHandler = (state) =>
  state.set('error', null);

const getUsersSuccessHandler = (state, action) =>
  state.set('users', action.payload)
    .set('error', null);

// GET INVITED USER
const getInvitedUsersRequestHandler = (state) =>
    state.set('error', null);

const getInvitedUsersRequestSuccessHandler = (state, action) =>
    state.set('invitedUsers', action.payload)
        .set('error', null);

const getClientsCollectionHandler = (state) =>
  state.set('error', null);

const getClientsCollectionSuccessHandler = (state, action) =>
  state.set('clients', action.payload)
    .set('error', null);

// INVITE USER
const inviteUserRequestHandler = (state) =>
  state.set('error', null);

const inviteUserRequestFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const inviteUserRequestSuccessHandler = (state, action) =>
  state.set('error', null)
    .set('user', action.payload);

const showInviteUserHandler = (state, action) =>
  state.set('isOpen', action.payload || !state.get('isOpen'));


// RESET PASSWORD
const resetPasswordRequestHandler = (state) =>
  state.set('error', null);

const resetPasswordFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const resetPasswordSuccessHandler = (state, action) =>
  state.set('error', null)
    .set('token', action.payload);


// CHANGE PASSWORD
const changePasswordRequestHandler = (state) =>
  state.set('error', null);

const changePasswordFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const changePasswordSuccessHandler = (state, action) =>
  state.set('error', null)
    .set('isOpen', action.payload);


export default typeToReducer({
  [INVITE_USER_REQUEST]: inviteUserRequestHandler,
  [INVITE_USER_REQUEST_SUCCESS]: inviteUserRequestSuccessHandler,
  [INVITE_USER_REQUEST_FAILED]: inviteUserRequestFailedHandler,

  [RESET_PASSWORD_REQUEST]: resetPasswordRequestHandler,
  [RESET_PASSWORD_SUCCESS]: resetPasswordSuccessHandler,
  [RESET_PASSWORD_FAILED]: resetPasswordFailedHandler,

  [CHANGE_PASSWORD_REQUEST]: changePasswordRequestHandler,
  [CHANGE_PASSWORD_SUCCESS]: changePasswordSuccessHandler,
  [CHANGE_PASSWORD_FAILED]: changePasswordFailedHandler,

  [SHOW_INVITE_USER]: showInviteUserHandler,

  [GET_USERS_REQUEST]: getUsersHandler,
  [GET_USERS_SUCCESS]: getUsersSuccessHandler,

  [GET_CLIENTS_COLLECTION]: getClientsCollectionHandler,
  [GET_CLIENTS_COLLECTION_SUCCESS]: getClientsCollectionSuccessHandler,

  [GET_INVITED_USERS_REQUEST]: getInvitedUsersRequestHandler,
  [GET_INVITED_USERS_REQUEST_SUCCESS]: getInvitedUsersRequestSuccessHandler,

}, initialState
);
