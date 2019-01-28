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

  showSiteStatusMsg: false,
  updateStatusError: null,

  isOpenEdit: false,
});

const SiteDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_SITE_DETAIL: {
      return state.set('isDetailLoading', true);
    }
    case constants.FETCH_SITE_DETAIL_SUCCESSFULLY: {
      return state.set('isDetailLoading', false)
                  .set('detailData', action.payload.data);
    }
    case constants.FETCH_SITE_DETAIL_FAIL: {
      return state.set('isDetailLoading', false)
                  .set('detailError', action.payload.error);
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
    case constants.UPDATE_SITE_STATUS: {
      return state.set('isUpdatingStatus', true);
    }
    case constants.UPDATE_SITE_STATUS_SUCCESSFULLY: {
      return state.set('showSiteStatusMsg', true)
                  .set('updateStatusError', null);
    }
    case constants.UPDATE_SITE_STATUS_FAIL: {
      return state.set('showSiteStatusMsg', true)
                  .set('updateStatusError', action.payload.error);
    }
    case constants.RESET_SHOW_MESSAGE: {
      return state.set('showSiteStatusMsg', false)
                  .set('updateStatusError', null);
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

export default SiteDetailReducer;
