import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

//-----------------------------------
// CONSTANTS
//-----------------------------------

const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST';
const GET_COMMENTS_ERROR = 'GET_COMMENTS_ERROR';
const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';

const GET_COMMENT_BY_ID_REQUEST = 'GET_COMMENT_BY_ID_REQUEST';
const GET_COMMENT_BY_ID_ERROR = 'GET_COMMENT_BY_ID_ERROR';
const GET_COMMENT_BY_ID_SUCCESS = 'GET_COMMENT_BY_ID_SUCCESS';

const CREATE_COMMENT_REQUEST = 'CREATE_COMMENT_REQUEST';
const CREATE_COMMENT_ERROR = 'CREATE_COMMENT_ERROR';
const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';

const CREATE_SHARED_COMMENT_REQUEST = 'CREATE_SHARED_COMMENT_REQUEST';
const CREATE_SHARED_COMMENT_ERROR = 'CREATE_SHARED_COMMENT_ERROR';
const CREATE_SHARED_COMMENT_SUCCESS = 'CREATE_SHARED_COMMENT_SUCCESS';

const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST';
const DELETE_COMMENT_ERROR = 'DELETE_COMMENT_ERROR';
const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';

export const actionTypes = {
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_ERROR,
  GET_COMMENTS_SUCCESS,

  GET_COMMENT_BY_ID_REQUEST,
  GET_COMMENT_BY_ID_ERROR,
  GET_COMMENT_BY_ID_SUCCESS,

  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_ERROR,
  CREATE_COMMENT_SUCCESS,

  CREATE_SHARED_COMMENT_REQUEST,
  CREATE_SHARED_COMMENT_ERROR,
  CREATE_SHARED_COMMENT_SUCCESS,

  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_ERROR,
  DELETE_COMMENT_SUCCESS,
};

//-----------------------------------
// ACTIONS
//-----------------------------------

const getCommentsRequest = createAction(GET_COMMENTS_REQUEST);
const getCommentsError = createAction(GET_COMMENTS_ERROR);
const getCommentsSuccess = createAction(GET_COMMENTS_SUCCESS);

const getCommentByIdRequest = createAction(GET_COMMENT_BY_ID_REQUEST);
const getCommentByIdError = createAction(GET_COMMENT_BY_ID_ERROR);
const getCommentByIdSuccess = createAction(GET_COMMENT_BY_ID_SUCCESS);

const createCommentRequest = createAction(CREATE_COMMENT_REQUEST);
const createCommentError = createAction(CREATE_COMMENT_ERROR);
const createCommentSuccess = createAction(CREATE_COMMENT_SUCCESS);

const createSharedCommentRequest = createAction(CREATE_SHARED_COMMENT_REQUEST);
const createSharedCommentError = createAction(CREATE_SHARED_COMMENT_ERROR);
const createSharedCommentSuccess = createAction(CREATE_SHARED_COMMENT_SUCCESS);

const deleteCommentRequest = createAction(DELETE_COMMENT_REQUEST);
const deleteCommentError = createAction(DELETE_COMMENT_ERROR);
const deleteCommentSuccess = createAction(DELETE_COMMENT_SUCCESS);

export const actions = {
  getCommentsRequest,
  getCommentsError,
  getCommentsSuccess,

  getCommentByIdRequest,
  getCommentByIdError,
  getCommentByIdSuccess,

  createCommentRequest,
  createCommentError,
  createCommentSuccess,

  createSharedCommentRequest,
  createSharedCommentError,
  createSharedCommentSuccess,

  deleteCommentRequest,
  deleteCommentError,
  deleteCommentSuccess,
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
const getCommentsHandler = (state) =>
  state
    .set('comments', undefined)
    .set('errorComments', null)
    .set('isLoadingComments', true);

const getCommentsErrorHandler = (state, action) =>
  state
    .set('comments', undefined)
    .set('errorComments', action.payload)
    .set('isLoadingComments', false);

const getCommentsSuccessHandler = (state, action) =>
  state
    .set('comments', action.payload)
    .set('errorComments', null)
    .set('isLoadingComments', false);

// GET COMMENT BY ID
const getCommentByIdHandler = (state) =>
  state
    .set('selectedComment', undefined)
    .set('errorSelected', null)
    .set('isLoadingSelected', true);

const getCommentByIdErrorHandler = (state, action) =>
  state
    .set('selectedComment', undefined)
    .set('errorSelected', action.payload)
    .set('isLoadingSelected', false);

const getCommentByIdSuccessHandler = (state, action) =>
  state
    .set('selectedComment', action.payload)
    .set('errorSelected', null)
    .set('isLoadingSelected', false);

// CREATE COMMENT
const createCommentHandler = (state) =>
  state
    .set('errorComments', null);

const createCommentErrorHandler = (state = initialState, action) =>
  state
    .set('errorComments', action.payload);

const createCommentSuccessHandler = (state, action) =>
  state
    .set('errorComments', null)
    .set('selectedComment', action.payload);

// CREATE SHARED COMMENT
const createSharedCommentHandler = (state) =>
  state
    .set('errorComments', null);

const createSharedCommentErrorHandler = (state = initialState, action) =>
  state
    .set('errorComments', action.payload);

const createSharedCommentSuccessHandler = (state, action) =>
  state
    .set('errorComments', null)
    .set('selectedComment', action.payload);

// DELETE COMMENT
const deleteCommentHandler = (state) =>
  state
    .set('errorComments', null);

const deleteCommentErrorHandler = (state = initialState, action) =>
  state
    .set('errorComments', action.payload);

const deleteCommentSuccessHandler = (state, action) =>
  state
    .set('errorComments', null)
    .set('selectedComment', action.payload);

export default typeToReducer(
  {
    [GET_COMMENTS_REQUEST]: getCommentsHandler,
    [GET_COMMENTS_ERROR]: getCommentsErrorHandler,
    [GET_COMMENTS_SUCCESS]: getCommentsSuccessHandler,

    [GET_COMMENT_BY_ID_REQUEST]: getCommentByIdHandler,
    [GET_COMMENT_BY_ID_ERROR]: getCommentByIdErrorHandler,
    [GET_COMMENT_BY_ID_SUCCESS]: getCommentByIdSuccessHandler,

    [CREATE_COMMENT_REQUEST]: createCommentHandler,
    [CREATE_COMMENT_ERROR]: createCommentErrorHandler,
    [CREATE_COMMENT_SUCCESS]: createCommentSuccessHandler,

    [CREATE_SHARED_COMMENT_REQUEST]: createSharedCommentHandler,
    [CREATE_SHARED_COMMENT_ERROR]: createSharedCommentErrorHandler,
    [CREATE_SHARED_COMMENT_SUCCESS]: createSharedCommentSuccessHandler,

    [DELETE_COMMENT_REQUEST]: deleteCommentHandler,
    [DELETE_COMMENT_ERROR]: deleteCommentErrorHandler,
    [DELETE_COMMENT_SUCCESS]: deleteCommentSuccessHandler,
  },
  initialState
);
