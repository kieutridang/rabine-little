import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_S3_FOLDERS_REQUEST = 'GET_S3_FOLDERS_REQUEST';
const GET_S3_FOLDERS_REQUEST_SUCCESS = 'GET_S3_FOLDERS_REQUEST_SUCCESS';
const GET_S3_FOLDERS_REQUEST_FAILED = 'GET_S3_FOLDERS_REQUEST_FAILED';

const GET_S3_SYNC_INFO = 'GET_S3_SYNC_INFO';
const GET_S3_SYNC_INFO_SUCCESS = 'GET_S3_SYNC_INFO_SUCCESS';
const GET_S3_SYNC_INFO_FAILED = 'GET_S3_SYNC_INFO_FAILED';

const SYNC_S3_FOLDER = 'SYNC_S3_FOLDER';
const SYNC_S3_FOLDER_SUCCESS = 'SYNC_S3_FOLDER_SUCCESS';
const SYNC_S3_FOLDER_FAILED = 'SYNC_S3_FOLDER_FAILED';

export const actionTypes = {
  GET_S3_FOLDERS_REQUEST,
  GET_S3_FOLDERS_REQUEST_SUCCESS,
  GET_S3_FOLDERS_REQUEST_FAILED,

  GET_S3_SYNC_INFO,
  GET_S3_SYNC_INFO_SUCCESS,
  GET_S3_SYNC_INFO_FAILED,

  SYNC_S3_FOLDER,
  SYNC_S3_FOLDER_SUCCESS,
  SYNC_S3_FOLDER_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const getS3FoldersRequest = createAction(GET_S3_FOLDERS_REQUEST);
const getS3FoldersRequestSuccess = createAction(GET_S3_FOLDERS_REQUEST_SUCCESS);
const getS3FoldersRequestFailed = createAction(GET_S3_FOLDERS_REQUEST_FAILED);

const getS3SyncInfoRequest = createAction(GET_S3_SYNC_INFO);
const getS3SyncInfoRequestSuccess = createAction(GET_S3_SYNC_INFO_SUCCESS);
const getS3SyncInfoRequestFailed = createAction(GET_S3_SYNC_INFO_FAILED);

const syncS3FolderRequest = createAction(SYNC_S3_FOLDER);
const syncS3FolderRequestSuccess = createAction(SYNC_S3_FOLDER_SUCCESS);
const syncS3FolderRequestFailed = createAction(SYNC_S3_FOLDER_FAILED);

export const actions = {
  getS3FoldersRequest,
  getS3FoldersRequestSuccess,
  getS3FoldersRequestFailed,

  getS3SyncInfoRequest,
  getS3SyncInfoRequestSuccess,
  getS3SyncInfoRequestFailed,

  syncS3FolderRequest,
  syncS3FolderRequestSuccess,
  syncS3FolderRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  folders: undefined,
  error: null,
  isLoading: false,
});

const getS3FoldersHandler = (state) =>
  state.set('error', null).set('isLoading', true);

const getS3FoldersErrorHandler = (state, action) =>
  state
    .set('folders', undefined)
    .set('error', action.payload)
    .set('isLoading', false);

const getS3FoldersSuccessHandler = (state, action) =>
  state
    .set('folders', action.payload)
    .set('error', null)
    .set('isLoading', false);


const getS3SyncInfoHandler = (state, action) =>
  state
    .set('folder', action.payload)
    .set('infoError', null)
    .set('infoIsLoading', true);

const getS3SyncInfoErrorHandler = (state, action) =>
  state
    .set('s3Info', undefined)
    .set('infoError', action.payload)
    .set('infoIsLoading', false);

const getS3SyncInfoSuccessHandler = (state, action) =>
  state
    .set('s3Info', action.payload)
    .set('infoError', null)
    .set('infoIsLoading', false);

const syncS3FolderHandler = (state, action) =>
  state
    .set('syncS3Info', action.payload)
    .set('syncS3InfoError', null)
    .set('syncS3IsLoading', true);

const syncS3FolderErrorHandler = (state, action) =>
  state
    .set('syncS3Info', undefined)
    .set('syncS3InfoError', action.payload)
    .set('syncS3IsLoading', false);

const syncS3FolderSuccessHandler = (state, action) =>
  state
    .set('syncS3Info', action.payload)
    .set('syncS3InfoError', null)
    .set('syncS3IsLoading', false);

export default typeToReducer(
  {
    [GET_S3_FOLDERS_REQUEST]: getS3FoldersHandler,
    [GET_S3_FOLDERS_REQUEST_FAILED]: getS3FoldersErrorHandler,
    [GET_S3_FOLDERS_REQUEST_SUCCESS]: getS3FoldersSuccessHandler,

    [GET_S3_SYNC_INFO]: getS3SyncInfoHandler,
    [GET_S3_SYNC_INFO_FAILED]: getS3SyncInfoErrorHandler,
    [GET_S3_SYNC_INFO_SUCCESS]: getS3SyncInfoSuccessHandler,

    [SYNC_S3_FOLDER]: syncS3FolderHandler,
    [SYNC_S3_FOLDER_FAILED]: syncS3FolderErrorHandler,
    [SYNC_S3_FOLDER_SUCCESS]: syncS3FolderSuccessHandler,
  },
  initialState
);
