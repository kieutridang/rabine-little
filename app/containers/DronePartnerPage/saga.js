import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/api/request';
import { rabineFetcher } from 'utils/api/rabineFetcher';
import { API_URL, API_DRONEPARTNER_PATH } from 'utils/constants';
import * as constants from './constants';
import * as actions from './actions';
import { selectItemPerPage, selectDronePartnerData, selectCurrentPage, selectSearchText } from './selectors';

function* filterItem({ searchText }) {
  let listData = yield select(selectDronePartnerData());
  listData = listData.filter((obj) => {
    const row = Object.values(obj).find((item) => item && item.includes(searchText));
    return row;
  });

  return listData;
}

export function* fetchDronePartner() {
  try {
    const response = yield call(request, `${API_URL}/${API_DRONEPARTNER_PATH}`);

    if (response && !response.error) {
      const itemPerPage = yield select(selectItemPerPage());
      const pageCount = Math.ceil(response.length / itemPerPage);
      const listData = [...response];
      const data = listData.slice(0, itemPerPage);
      yield put(actions.fetchDronePartnersSuccessfully(listData, [...data], pageCount));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchDronePartnersFail(error));
  }
}

export function* changePageDronePartner(action) {
  try {
    const page = action.payload.page;
    const itemPerPage = yield select(selectItemPerPage());
    const searchText = yield select(selectSearchText());
    const listData = yield call(filterItem, { searchText });
    const data = listData.slice(page * itemPerPage, (page * itemPerPage) + itemPerPage);
    const pageCount = Math.ceil(listData.length / itemPerPage);
    yield put(actions.changePageSuccessfully([...data], pageCount));
  } catch (error) {
    yield put(actions.fetchDronePartnersFail(error));
  }
}

export function* changeItemPerPageDronePartner(action) {
  try {
    const itemPerPage = Number(action.payload.itemPerPage);
    const listData = yield select(selectDronePartnerData());
    const currentPageOld = yield select(selectCurrentPage());
    const pageCount = Math.ceil(listData.length / itemPerPage);
    const currentPage = Math.min(currentPageOld, pageCount - 1);
    const data = listData.slice(currentPage * itemPerPage, (currentPage * itemPerPage) + itemPerPage);

    yield put(actions.changeItemPerPageSuccessfully([...data], pageCount, currentPage));
  } catch (error) {
    yield put(actions.fetchDronePartnersFail(error));
  }
}

export function* searchItemDronePartner() {
  try {
    yield put(actions.changePage(0));
  } catch (error) {
    yield put(actions.fetchDronePartnersFail(error));
  }
}

export function* addDronePartner(action) {
  try {
    const response = yield call(rabineFetcher.post, `${API_DRONEPARTNER_PATH}`, action.payload.dronePartner);

    if (response && !response.error) {
      yield put(actions.addDronePartnerRequestSuccessful());
      yield put(actions.fetchDronePartners());
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchDronePartnersFail(error));
  }
}

export default function* saga() {
  yield takeLatest(constants.FETCH_DRONE_PARTNERS, fetchDronePartner);
  yield takeLatest(constants.CHANGE_PAGE, changePageDronePartner);
  yield takeLatest(constants.CHANGE_ITEM_PER_PAGE, changeItemPerPageDronePartner);
  yield takeLatest(constants.SEARCH_ITEM, searchItemDronePartner);
  yield takeLatest(constants.ADD_DRONE_PARTNER_REQUEST, addDronePartner);
}
