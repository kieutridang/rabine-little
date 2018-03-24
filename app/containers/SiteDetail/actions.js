import * as constants from './constants';

export const fetchDetail = (id) => ({
  type: constants.FETCH_SITE_DETAIL,
  payload: {
    id,
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
