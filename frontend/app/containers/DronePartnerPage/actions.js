import * as constants from './constants';

export const fetchDronePartners = () => ({
  type: constants.FETCH_DRONE_PARTNERS,
});

export const fetchDronePartnersSuccessfully = (data, list, pageCount) => ({
  type: constants.FETCH_DRONE_PARTNERS_SUCCESSFULLY,
  payload: {
    data,
    list,
    pageCount,
  },
});

export const fetchDronePartnersFail = (error) => ({
  type: constants.FETCH_DRONE_PARTNERS_FAIL,
  payload: {
    error,
  },
});

export const changePage = (page) => ({
  type: constants.CHANGE_PAGE,
  payload: {
    page,
  },
});

export const changePageSuccessfully = (data, pageCount) => ({
  type: constants.CHANGE_PAGE_SUCCESS,
  payload: {
    data,
    pageCount,
  },
});

export const changeItemPerPage = (itemPerPage) => ({
  type: constants.CHANGE_ITEM_PER_PAGE,
  payload: {
    itemPerPage,
  },
});

export const changeItemPerPageSuccessfully = (data, pageCount, currentPage) => ({
  type: constants.CHANGE_ITEM_PER_PAGE_SUCCESS,
  payload: {
    data,
    pageCount,
    currentPage,
  },
});

export const searchItem = (searchText) => ({
  type: constants.SEARCH_ITEM,
  payload: {
    searchText,
  },
});

export const searchItemSucessfully = (listData, pageCount) => ({
  type: constants.SEARCH_ITEM_SUCCESS,
  payload: {
    listData,
    pageCount,
  },
});

export const sortColumn = () => ({

});

export const sortColumnSuccessfully = () => ({

});

export const addDronePartnerRequest = (dronePartner) => ({
  type: constants.ADD_DRONE_PARTNER_REQUEST,
  payload: {
    dronePartner,
  },
});

export const addDronePartnerRequestSuccessful = () => ({
  type: constants.ADD_DRONE_PARTNER_REQUEST_SUCCESSFULL,
});

export const addDronePartnerRequestFail = (error) => ({
  type: constants.ADD_DRONE_PARTNER_REQUEST_FAIL,
  payload: {
    error,
  },
});
