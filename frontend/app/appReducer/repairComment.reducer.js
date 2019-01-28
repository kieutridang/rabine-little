import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

//-----------------------------------
// CONSTANTS
//-----------------------------------

const GET_REPAIR_COMMENTS_REQUEST = 'GET_REPAIR_COMMENTS_REQUEST';
const GET_REPAIR_COMMENTS_ERROR = 'GET_REPAIR_COMMENTS_ERROR';
const GET_REPAIR_COMMENTS_SUCCESS = 'GET_REPAIR_COMMENTS_SUCCESS';

const GET_REPAIR_COMMENT_BY_ID_REQUEST = 'GET_REPAIR_COMMENT_BY_ID_REQUEST';
const GET_REPAIR_COMMENT_BY_ID_ERROR = 'GET_REPAIR_COMMENT_BY_ID_ERROR';
const GET_REPAIR_COMMENT_BY_ID_SUCCESS = 'GET_REPAIR_COMMENT_BY_ID_SUCCESS';

const CREATE_REPAIR_COMMENT_REQUEST = 'CREATE_REPAIR_COMMENT_REQUEST';
const CREATE_REPAIR_COMMENT_ERROR = 'CREATE_REPAIR_COMMENT_ERROR';
const CREATE_REPAIR_COMMENT_SUCCESS = 'CREATE_REPAIR_COMMENT_SUCCESS';

const CREATE_REPAIR_SHARED_COMMENT_REQUEST = 'CREATE_REPAIR_SHARED_COMMENT_REQUEST';
const CREATE_REPAIR_SHARED_COMMENT_ERROR = 'CREATE_REPAIR_SHARED_COMMENT_ERROR';
const CREATE_REPAIR_SHARED_COMMENT_SUCCESS = 'CREATE_REPAIR_SHARED_COMMENT_SUCCESS';

const DELETE_REPAIR_COMMENT_REQUEST = 'DELETE_REPAIR_COMMENT_REQUEST';
const DELETE_REPAIR_COMMENT_ERROR = 'DELETE_REPAIR_COMMENT_ERROR';
const DELETE_REPAIR_COMMENT_SUCCESS = 'DELETE_REPAIR_COMMENT_SUCCESS';

export const actionTypes = {
  GET_REPAIR_COMMENTS_REQUEST,
  GET_REPAIR_COMMENTS_ERROR,
  GET_REPAIR_COMMENTS_SUCCESS,

  GET_REPAIR_COMMENT_BY_ID_REQUEST,
  GET_REPAIR_COMMENT_BY_ID_ERROR,
  GET_REPAIR_COMMENT_BY_ID_SUCCESS,

  CREATE_REPAIR_COMMENT_REQUEST,
  CREATE_REPAIR_COMMENT_ERROR,
  CREATE_REPAIR_COMMENT_SUCCESS,

  CREATE_REPAIR_SHARED_COMMENT_REQUEST,
  CREATE_REPAIR_SHARED_COMMENT_ERROR,
  CREATE_REPAIR_SHARED_COMMENT_SUCCESS,

  DELETE_REPAIR_COMMENT_REQUEST,
  DELETE_REPAIR_COMMENT_ERROR,
  DELETE_REPAIR_COMMENT_SUCCESS,
};

//-----------------------------------
// ACTIONS
//-----------------------------------

const getRepairCommentsRequest = createAction(GET_REPAIR_COMMENTS_REQUEST);
const getRepairCommentsError = createAction(GET_REPAIR_COMMENTS_ERROR);
const getRepairCommentsSuccess = createAction(GET_REPAIR_COMMENTS_SUCCESS);

const getRepairCommentByIdRequest = createAction(GET_REPAIR_COMMENT_BY_ID_REQUEST);
const getRepairCommentByIdError = createAction(GET_REPAIR_COMMENT_BY_ID_ERROR);
const getRepairCommentByIdSuccess = createAction(GET_REPAIR_COMMENT_BY_ID_SUCCESS);

const createRepairCommentRequest = createAction(CREATE_REPAIR_COMMENT_REQUEST);
const createRepairCommentError = createAction(CREATE_REPAIR_COMMENT_ERROR);
const createRepairCommentSuccess = createAction(CREATE_REPAIR_COMMENT_SUCCESS);

const createRepairSharedCommentRequest = createAction(CREATE_REPAIR_SHARED_COMMENT_REQUEST);
const createRepairSharedCommentError = createAction(CREATE_REPAIR_SHARED_COMMENT_ERROR);
const createRepairSharedCommentSuccess = createAction(CREATE_REPAIR_SHARED_COMMENT_SUCCESS);

const deleteRepairCommentRequest = createAction(DELETE_REPAIR_COMMENT_REQUEST);
const deleteRepairCommentError = createAction(DELETE_REPAIR_COMMENT_ERROR);
const deleteRepairCommentSuccess = createAction(DELETE_REPAIR_COMMENT_SUCCESS);

export const actions = {
  getRepairCommentsRequest,
  getRepairCommentsError,
  getRepairCommentsSuccess,

  getRepairCommentByIdRequest,
  getRepairCommentByIdError,
  getRepairCommentByIdSuccess,

  createRepairCommentRequest,
  createRepairCommentError,
  createRepairCommentSuccess,

  createRepairSharedCommentRequest,
  createRepairSharedCommentError,
  createRepairSharedCommentSuccess,

  deleteRepairCommentRequest,
  deleteRepairCommentError,
  deleteRepairCommentSuccess,
};

//-----------------------------------
// REDUCER
//-----------------------------------

const initialState = fromJS({
  selectedComment: undefined,
  comments: undefined,
  errorComments: null,
  errorSelected: null,
  isLoadingComments: false,
  isLoadingSelected: false,
});

// GET COMMENTS
const getRepairCommentsHandler = (state) =>
  state
    .set('comments', undefined)
    .set('errorComments', null)
    .set('isLoadingComments', true);

const getRepairCommentsErrorHandler = (state, action) =>
  state
    .set('comments', undefined)
    .set('errorComments', action.payload)
    .set('isLoadingComments', false);

const getRepairCommentsSuccessHandler = (state, action) =>
  state
    .set('comments', action.payload)
    .set('errorComments', null)
    .set('isLoadingComments', false);

// GET COMMENT BY ID
const getRepairCommentByIdHandler = (state) =>
  state
    .set('selectedComment', undefined)
    .set('errorSelected', null)
    .set('isLoadingSelected', true);

const getRepairCommentByIdErrorHandler = (state, action) =>
  state
    .set('selectedComment', undefined)
    .set('errorSelected', action.payload)
    .set('isLoadingSelected', false);

const getRepairCommentByIdSuccessHandler = (state, action) =>
  state
    .set('selectedComment', action.payload)
    .set('errorSelected', null)
    .set('isLoadingSelected', false);

// CREATE COMMENT
const createRepairCommentHandler = (state) =>
  state
    .set('errorComments', null);

const createRepairCommentErrorHandler = (state = initialState, action) =>
  state
    .set('errorComments', action.payload);

const createRepairCommentSuccessHandler = (state, action) =>
  state
    .set('errorComments', null)
    .set('selectedComment', action.payload);

// CREATE SHARED COMMENT
const createRepairSharedCommentHandler = (state) =>
  state
    .set('errorComments', null);

const createRepairSharedCommentErrorHandler = (state = initialState, action) =>
  state
    .set('errorComments', action.payload);

const createRepairSharedCommentSuccessHandler = (state, action) =>
  state
    .set('errorComments', null)
    .set('selectedComment', action.payload);

// DELETE COMMENT
const deleteRepairCommentHandler = (state) =>
  state
    .set('errorComments', null);

const deleteRepairCommentErrorHandler = (state = initialState, action) =>
  state
    .set('errorComments', action.payload);

const deleteRepairCommentSuccessHandler = (state, action) =>
  state
    .set('errorComments', null)
    .set('selectedComment', action.payload);

export default typeToReducer(
  {
    [GET_REPAIR_COMMENTS_REQUEST]: getRepairCommentsHandler,
    [GET_REPAIR_COMMENTS_ERROR]: getRepairCommentsErrorHandler,
    [GET_REPAIR_COMMENTS_SUCCESS]: getRepairCommentsSuccessHandler,

    [GET_REPAIR_COMMENT_BY_ID_REQUEST]: getRepairCommentByIdHandler,
    [GET_REPAIR_COMMENT_BY_ID_ERROR]: getRepairCommentByIdErrorHandler,
    [GET_REPAIR_COMMENT_BY_ID_SUCCESS]: getRepairCommentByIdSuccessHandler,

    [CREATE_REPAIR_COMMENT_REQUEST]: createRepairCommentHandler,
    [CREATE_REPAIR_COMMENT_ERROR]: createRepairCommentErrorHandler,
    [CREATE_REPAIR_COMMENT_SUCCESS]: createRepairCommentSuccessHandler,

    [CREATE_REPAIR_SHARED_COMMENT_REQUEST]: createRepairSharedCommentHandler,
    [CREATE_REPAIR_SHARED_COMMENT_ERROR]: createRepairSharedCommentErrorHandler,
    [CREATE_REPAIR_SHARED_COMMENT_SUCCESS]: createRepairSharedCommentSuccessHandler,

    [DELETE_REPAIR_COMMENT_REQUEST]: deleteRepairCommentHandler,
    [DELETE_REPAIR_COMMENT_ERROR]: deleteRepairCommentErrorHandler,
    [DELETE_REPAIR_COMMENT_SUCCESS]: deleteRepairCommentSuccessHandler,
  },
  initialState
);
