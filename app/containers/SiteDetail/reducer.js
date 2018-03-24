import { fromJS } from 'immutable';

import * as constants from './constants';

const initialState = fromJS({
  isActivityLoading: false,
  activityData: [],

  isDetailLoading: false,
  detailData: {},
  detailError: null,
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
    default:
      return state;
  }
};

export default SiteDetailReducer;
