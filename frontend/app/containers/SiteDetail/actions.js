import * as constants from './constants';

export const fetchDetail = (id, token = '') => ({
  type: constants.FETCH_SITE_DETAIL,
  payload: {
    id,
    token,
  },
});

export const fetchDetailSuccessfully = (data) => ({
  type: constants.FETCH_SITE_DETAIL_SUCCESSFULLY,
  payload: {
    data,
  },
});

export const fetchDetailFail = (error) => ({
  type: constants.FETCH_SITE_DETAIL_FAIL,
  payload: {
    error,
  },
});

export const changeNote = (text) => ({
  type: constants.CHANGE_NOTE,
  payload: {
    text,
  },
});

export const submitNote = () => ({
  type: constants.SUBMIT_NOTE,
});

export const submitNoteSuccessfully = () => ({
  type: constants.SUBMIT_NOTE_SUCCESSFULLY,
});

export const submitNoteFail = (error) => ({
  type: constants.SUBMIT_NOTE_FAIL,
  payload: {
    error,
  },
});

export const updateSiteStatus = (siteId, payload) => ({
  type: constants.UPDATE_SITE_STATUS,
  payload: {
    id: siteId,
    data: payload,
  },
});

export const updateSiteStatusSuccessfully = () => ({
  type: constants.UPDATE_SITE_STATUS_SUCCESSFULLY,
});

export const updateSiteStatusFail = (error) => ({
  type: constants.UPDATE_SITE_STATUS_FAIL,
  payload: {
    error,
  },
});
export const resetShowMessage = () => ({
  type: constants.RESET_SHOW_MESSAGE,
});

export const openEdit = () => ({
  type: constants.OPEN_EDIT,
});

export const closeEdit = () => ({
  type: constants.CLOSE_EDIT,
});

export const editSiteRequest = (data) => ({
  type: constants.EDIT_SITE_DETAIL,
  payload: {
    data,
  },
});

export const editSiteRequestSuccessfully = (data) => ({
  type: constants.EDIT_SITE_DETAIL_SUCCESSFULLY,
  payload: {
    data,
  },
});

export const editSiteRequestFail = (errors) => ({
  type: constants.EDIT_SITE_DETAIL_FAIL,
  payload: {
    errors,
  },
});

export const clearSiteError = () => ({
  type: constants.CLEAR_SITE_ERROR,
});
