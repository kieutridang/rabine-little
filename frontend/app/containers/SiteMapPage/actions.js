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

export const fetchSiteMapData = (siteId) => ({
  type: constants.FETCH_SITE_MAP_DATA,
  payload: {
    id: siteId,
  },
});

export const fetchSiteMapDataSuccessfully = (data) => ({
  type: constants.FETCH_SITE_MAP_DATA_SUCCESSFULLY,
  payload: {
    data,
  },
});

export const fetchSiteMapDataFail = (error) => ({
  type: constants.FETCH_SITE_MAP_DATA_FAIL,
  payload: {
    error,
  },
});

export const submitSiteMapData = (siteId, data, layers) => ({
  type: constants.SUBMIT_SITE_MAP_DATA,
  payload: {
    id: siteId,
    data,
    layers,
  },
});

export const submitSiteMapDataSuccessfully = () => ({
  type: constants.SUBMIT_SITE_MAP_DATA_SUCCESSFULLY,
});

export const submitSiteMapDataFail = (error) => ({
  type: constants.SUBMIT_SITE_MAP_DATA_FAIL,
  payload: {
    error,
  },
});
