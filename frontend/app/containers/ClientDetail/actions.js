import * as constants from './constants';

export const fetchDetail = (id) => ({
  type: constants.FETCH_CLIENT_DETAIL,
  payload: {
    id,
  },
});
export const fetchClientNote = (id) => ({
  type: constants.FETCH_CLIENT_NOTE,
  payload: {
    id,
  },
});

export const fetchClientNoteSuccessfully = (data) => ({
  type: constants.FETCH_CLIENT_NOTE_SUCCESSFULLY,
  payload: {
    data,
  },
});

export const fetchClientNoteFail = (error) => ({
  type: constants.FETCH_CLIENT_NOTE_FAIL,
  payload: {
    error,
  },
});

export const fetchDetailSuccessfully = (data) => ({
  type: constants.FETCH_CLIENT_DETAIL_SUCCESSFULLY,
  payload: {
    data,
  },
});

export const fetchDetailFail = (error) => ({
  type: constants.FETCH_CLIENT_DETAIL_FAIL,
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

export const updateClientStatus = (clientId, payload) => ({
  type: constants.UPDATE_CLIENT_STATUS,
  payload: {
    id: clientId,
    data: payload,
  },
});

export const updateClientStatusSuccessfully = () => ({
  type: constants.UPDATE_CLIENT_STATUS_SUCCESSFULLY,
});

export const updateClientStatusFail = (error) => ({
  type: constants.UPDATE_CLIENT_STATUS_FAIL,
  payload: {
    error,
  },
});

export const openEdit = () => ({
  type: constants.OPEN_EDIT,
});

export const closeEdit = () => ({
  type: constants.CLOSE_EDIT,
});

export const editClientRequest = (data) => ({
  type: constants.EDIT_CLIENT_DETAIL,
  payload: {
    data,
  },
});

export const editClientRequestSuccessfully = (data) => ({
  type: constants.EDIT_CLIENT_DETAIL_SUCCESSFULLY,
  payload: {
    data,
  },
});

export const editClientRequestFail = (errors) => ({
  type: constants.EDIT_CLIENT_DETAIL_FAIL,
  payload: {
    errors,
  },
});
