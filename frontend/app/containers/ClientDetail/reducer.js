import { fromJS } from 'immutable';

import * as constants from './constants';

const initialState = fromJS({
  isActivityLoading: false,
  activityData: [],

  isDetailLoading: false,
  detailData: {},
  detailError: null,

  noteContent: '',
  isNoteSubmitting: false,
  submitNoteError: null,

  isUpdatingStatus: false,
  isUpdateStatusSuccessfully: false,
  updateStatusError: null,
  isOpenEdit: false,
});

const ClientDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_CLIENT_DETAIL: {
      return state.set('isDetailLoading', true);
    }
    case constants.FETCH_CLIENT_DETAIL_SUCCESSFULLY: {
      return state.set('isDetailLoading', false)
                  .set('detailData', action.payload.data);
    }
    case constants.FETCH_CLIENT_DETAIL_FAIL: {
      return state.set('isDetailLoading', false)
                  .set('detailError', action.payload.error);
    }
    case constants.FETCH_CLIENT_NOTE: {
      return state.set('isClientNoteLoading', true);
    }
    case constants.FETCH_CLIENT_NOTE_SUCCESSFULLY: {
      return state.set('isClientNoteLoading', false)
                  .set('clientNoteData', action.payload.data);
    }
    case constants.FETCH_CLIENT_NOTE_FAIL: {
      return state.set('isClientNoteLoading', false)
                  .set('clientNoteError', action.payload.error);
    }
    case constants.CHANGE_NOTE: {
      return state.set('noteContent', action.payload.text);
    }
    case constants.SUBMIT_NOTE: {
      return state.set('isNoteSubmitting', true);
    }
    case constants.SUBMIT_NOTE_SUCCESSFULLY: {
      return state.set('isNoteSubmitting', false);
    }
    case constants.SUBMIT_NOTE_FAIL: {
      return state.set('isNoteSubmitting', false)
                  .set('submitNoteError', action.payload.error);
    }
    case constants.UPDATE_CLIENT_STATUS: {
      return state.set('isUpdatingStatus', true);
    }
    case constants.UPDATE_CLIENT_STATUS_SUCCESSFULLY: {
      return state.set('isUpdatingStatus', false)
                  .set('isUpdateStatusSuccessfully', true)
                  .set('updateStatusError', null);
    }
    case constants.UPDATE_CLIENT_STATUS_FAIL: {
      return state.set('isUpdatingStatus', false)
                  .set('isUpdateStatusSuccessfully', false)
                  .set('updateStatusError', action.payload.error);
    }
    case constants.OPEN_EDIT: {
      return state.set('isOpenEdit', true);
    }
    case constants.CLOSE_EDIT: {
      return state.set('isOpenEdit', false);
    }
    default:
      return state;
  }
};

export default ClientDetailReducer;
