import { fromJS } from 'immutable';

import * as constants from './constants';

const initialState = fromJS({
  data: undefined,
  list: undefined,
  error: null,
  isLoading: false,
  itemPerPage: 25,
  pageCount: 0,
  currentPage: 0,
  searchText: '',
});

const DronePartnerReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_DRONE_PARTNERS: {
      return state.set('isLoading', true);
    }
    case constants.FETCH_DRONE_PARTNERS_SUCCESSFULLY: {
      return state.set('isLoading', false)
                  .set('data', action.payload.data)
                  .set('list', action.payload.data)
                  .set('pageCount', action.payload.pageCount);
    }
    case constants.FETCH_DRONE_PARTNERS_FAIL: {
      return state.set('isLoading', false)
                  .set('error', action.payload.error);
    }

    // case constants.CHANGE_PAGE: {
    //   return state.set('isLoading', true)
    //               .set('currentPage', action.payload.page);
    // }
    //
    // case constants.CHANGE_PAGE_SUCCESS: {
    //   return state.set('isLoading', false)
    //               .set('pageCount', action.payload.pageCount)
    //               .set('list', action.payload.data);
    // }
    //
    // case constants.CHANGE_ITEM_PER_PAGE: {
    //   return state.set('isLoading', true)
    //               .set('itemPerPage', action.payload.itemPerPage);
    // }
    //
    // case constants.CHANGE_ITEM_PER_PAGE_SUCCESS: {
    //   return state.set('isLoading', false)
    //               .set('currentPage', action.payload.currentPage)
    //               .set('list', action.payload.data)
    //               .set('pageCount', action.payload.pageCount);
    // }

    case constants.SEARCH_ITEM: {
      return state.set('isLoading', true)
                  .set('searchText', action.payload.searchText);
    }

    default:
      return state;
  }
};

export default DronePartnerReducer;
