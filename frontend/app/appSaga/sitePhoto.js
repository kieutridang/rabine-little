import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { compact, concat } from 'lodash';

import { actions, actionTypes } from '../appReducer/sitePhoto.reducer';
import sitePhotoApi from '../appApi/sitePhoto';
import { areaVideosApi } from '../appApi/video';

const filterAreas = (area) => {
  if (['repair', 'defected'].indexOf(area.title) >= 0 &&
    area.imagesCount === 0
  ) {
    return false;
  }

  return true;
};

export function* fetchSiteAreaFlow(action) {
  try {
    const { siteId, areaId, type, token, page, pageSize } = action.payload;
    if (type === 'Video') {
      const response = yield call(areaVideosApi.getAreaVideos, { siteId, areaName: areaId, token, page, pageSize });
      const { areaName, videos = [], totalCount } = response;
      const data = {
        title: areaName,
        id: areaId,
        photos: videos,
        imagesCount: totalCount,
        type: 'Video',
      };

      yield put(actions.fetchSiteAreaSuccessfully(data));
    } else {
      const response = yield call(sitePhotoApi.getSiteArea, { siteId, areaId, token, page, pageSize });
      yield put(actions.fetchSiteAreaSuccessfully(response));
    }
  } catch (error) {
    yield put(actions.fetchSiteAreaFail(error));
  }
}

export function* fetchSiteAreasFlow(action) {
  try {
    const { siteId, token, callChangeAreaId } = action.payload;
    const response = yield call(sitePhotoApi.getSiteAreas, { siteId, token });
    yield put(actions.fetchSiteAreasSuccessfully(response));

    if (response && !response.error && callChangeAreaId) {
      const photoAreas = response.photoAreas;
      const videoAreas = response.videoAreas;
      const areasPhoto = photoAreas ? photoAreas.filter((area) => filterAreas(area)) : [];
      const allAreas = compact(concat(areasPhoto, videoAreas));

      if (allAreas.length > 0) {
        const firstArea = allAreas[0];
        const params = {
          siteId,
          areaId: firstArea.id,
          type: firstArea.type,
          token,
          page: 1,
          pageSize: 20,
        };
        yield put(actions.changeAreaId(params));
      }
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchSiteAreasFail(error));
  }
}

export function* getAreaPhotosFlow(action) {
  try {
    const { siteId, areaId, token } = action.payload;

    const response = yield call(sitePhotoApi.getSiteArea, { siteId, areaId, token });

    const data = { siteId, areaId, photos: response.photos };
    yield put(actions.getAreaPhotosSuccess(data));
    return data;
  } catch (err) {
    yield put(actions.getAreaPhotosFailed(err));
    return false;
  }
}

export function* toggleAreaPhotoDefectedFlow(action) {
  try {
    const response = yield call(sitePhotoApi.toggleAreaPhotoDefected, action.payload);
    yield put(actions.toggleAreaPhotoDefectedSuccessfully(response));
  } catch (error) {
    yield put(actions.toggleAreaPhotoDefectedFail(error));
  }
}

export function* setAreaPhotoDefectedTypeFlow(action) {
  try {
    const response = yield call(sitePhotoApi.setAreaPhotoDefectedType, action.payload);
    if (response && !response.error) {
      yield put(actions.setAreaPhotoDefectedTypeSuccessfully(response));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.setAreaPhotoDefectedTypeFail(error));
  }
}

export function* toggleAreaPhotoRepairFlow(action) {
  try {
    const response = yield call(sitePhotoApi.toggleAreaPhotoRepair, action.payload);
    yield put(actions.toggleAreaPhotoRepairSuccessfully(response));
  } catch (error) {
    yield put(actions.toggleAreaPhotoRepairFail(error));
  }
}

export function* setAreaPhotoRepairNameFlow(action) {
  try {
    const response = yield call(sitePhotoApi.setAreaPhotoRepairName, action.payload);
    yield put(actions.setAreaPhotoRepairNameSuccessfully(response));
  } catch (error) {
    yield put(actions.setAreaPhotoRepairNameFail(error));
  }
}

export function* setAreaPhotoDefectedSeverityFlow(action) {
  try {
    const response = yield call(sitePhotoApi.setAreaPhotoDefectedSeverity, action.payload);
    yield put(actions.setAreaPhotoDefectedSeveritySuccessfully(response));
  } catch (error) {
    yield put(actions.setAreaPhotoDefectedSeverityFail(error));
  }
}

// Annotation
function* createAnnotationFlow(action) {
  try {
    const { photoId } = action.payload;
    const response = yield call(sitePhotoApi.createAnnotation, action.payload);
    const annotaions = yield call(sitePhotoApi.getAnnotations, photoId);
    yield put(actions.createAnnotationSuccessfully(response));
    yield put(actions.getAnnotationsSuccessfully(annotaions));
    return response;
  } catch (err) {
    yield put(actions.createAnnotationFail(err));
    return false;
  }
}

function* getAnnotationsFlow(action) {
  try {
    const response = yield call(sitePhotoApi.getAnnotations, action.payload);
    yield put(actions.getAnnotationsSuccessfully(response));
    return response;
  } catch (err) {
    yield put(actions.getAnnotationsFail(err));
    return false;
  }
}

function* updateAnnotationFlow(action) {
  try {
    const { data: { photoId } } = action.payload;
    const response = yield call(sitePhotoApi.updateAnnotation, action.payload);
    const annotaions = yield call(sitePhotoApi.getAnnotations, photoId);
    yield put(actions.updateAnnotationSuccessfully(annotaions));
    return response;
  } catch (err) {
    yield put(actions.updateAnnotationFail(err));
    return false;
  }
}

function* deleteAnnotationFlow(action) {
  try {
    const response = yield call(sitePhotoApi.deleteAnnotation, action.payload);
    yield put(actions.deleteAnnotationSuccessfully(response));
    return response;
  } catch (err) {
    yield put(actions.deleteAnnotationFail(err));
    return false;
  }
}

export function* addAreaPhotoRepairFlow(action) {
  try {
    const params = action.payload;

    const response = yield call(sitePhotoApi.addAreaPhotoRepair, params);
    yield put(actions.addAreaPhotoRepairSuccess(response));
    yield put(actions.getAreaPhotoRepairs(params.photoId));
  } catch (error) {
    yield put(actions.addAreaPhotoRepairFail(error));
  }
}

export function* getAreaPhotoRepairsFlow(action) {
  try {
    const photoId = action.payload;

    const repairs = yield call(sitePhotoApi.getAreaPhotoRepairs, photoId);
    yield put(actions.getAreaPhotoRepairsSuccess(repairs));
  } catch (error) {
    yield put(actions.addAreaPhotoRepairFail(error));
  }
}

export function* deleteAreaPhotoRepairFlow(action) {
  try {
    const params = action.payload;

    const response = yield call(sitePhotoApi.deleteAreaPhotoRepair, params);
    yield put(actions.deleteAreaPhotoRepairSuccess(response));
    yield put(actions.getAreaPhotoRepairs(params.photoId));
  } catch (error) {
    yield put(actions.deleteAreaPhotoRepairFail(error));
  }
}

export function* setDeletedAreaPhotoFlow({ payload }) {
  try {
    yield put(actions.setDeletedAreaPhotoRequesting(payload));
    yield call(sitePhotoApi.setDeleteAreaPhoto, payload);
    yield put(actions.setDeletedAreaPhotoSuccess(payload));
  } catch (error) {
    yield put(actions.setDeletedAreaPhotoFail(payload));
  }
}

export function* setDeletedAreaPhotosFlow({ payload }) {
  try {
    yield put(actions.setDeletedAreaPhotosRequesting(payload));
    yield call(sitePhotoApi.setDeleteAreaPhotos, payload);
    yield put(actions.setDeletedAreaPhotosSuccess(payload));
  } catch (error) {
    yield put(actions.setDeletedAreaPhotosFail(payload));
  }
}

export function* addFetchSiteAreasWatcher() {
  yield takeLatest(actionTypes.FETCH_SITE_AREAS, fetchSiteAreasFlow);
}

export function* addFetchSiteAreaWatcher() {
  yield takeEvery(actionTypes.CHANGE_AREA, fetchSiteAreaFlow);
}


export function* addGetAreaPhotosWatcher() {
  yield takeEvery(actionTypes.GET_AREA_PHOTOS, getAreaPhotosFlow);
}

export function* addToggleAreaPhotoDefectedWatcher() {
  yield takeLatest(actionTypes.TOGGLE_AREA_PHOTO_DEFECTED, toggleAreaPhotoDefectedFlow);
}

export function* addSetAreaPhotoDefectedTypeWatcher() {
  yield takeLatest(actionTypes.SET_AREA_PHOTO_DEFECTED_TYPE, setAreaPhotoDefectedTypeFlow);
}

export function* addToggleAreaPhotoRepairWatcher() {
  yield takeLatest(actionTypes.TOGGLE_AREA_PHOTO_REPAIR, toggleAreaPhotoRepairFlow);
}

export function* addSetAreaPhotoRepairNameWatcher() {
  yield takeLatest(actionTypes.SET_AREA_PHOTO_REPAIR_NAME, setAreaPhotoRepairNameFlow);
}

export function* addSetAreaPhotoDefectedSeverityWatcher() {
  yield takeLatest(actionTypes.SET_AREA_PHOTO_DEFECTED_SEVERITY, setAreaPhotoDefectedSeverityFlow);
}

// Annotation
export function* createAnnotationWatcher() {
  yield takeLatest(actionTypes.CREATE_ANNOTATION_REQUEST, createAnnotationFlow);
}

export function* getAnnotationsWatcher() {
  yield takeLatest(actionTypes.GET_ANNOTATIONS_REQUEST, getAnnotationsFlow);
}

export function* updateAnnotationWatcher() {
  yield takeLatest(actionTypes.UPDATE_ANNOTATION_REQUEST, updateAnnotationFlow);
}

export function* deleteAnnotationWatcher() {
  yield takeLatest(actionTypes.DELETE_ANNOTATION_REQUEST, deleteAnnotationFlow);
}

export function* addAddAreaPhotoRepairWatcher() {
  yield takeLatest(actionTypes.ADD_AREA_PHOTO_REPAIR, addAreaPhotoRepairFlow);
}

export function* addDeleteAreaPhotoRepairWatcher() {
  yield takeLatest(actionTypes.DELETE_AREA_PHOTO_REPAIR, deleteAreaPhotoRepairFlow);
}

export function* addGetAreaPhotoRepairsWatcher() {
  yield takeLatest(actionTypes.GET_AREA_PHOTO_REPAIRS, getAreaPhotoRepairsFlow);
}

export function* setDeletedAreaPhotoWatcher() {
  yield takeEvery(actionTypes.SET_DELETED_AREA_PHOTO, setDeletedAreaPhotoFlow);
}

export function* setDeletedAreaPhotosWatcher() {
  yield takeEvery(actionTypes.SET_DELETED_AREA_PHOTOS, setDeletedAreaPhotosFlow);
}

export default {
  addFetchSiteAreasWatcher,
  fetchSiteAreaFlow,
  addGetAreaPhotosWatcher,
  addToggleAreaPhotoDefectedWatcher,
  addSetAreaPhotoDefectedTypeWatcher,
  addSetAreaPhotoDefectedSeverityWatcher,
  addToggleAreaPhotoRepairWatcher,
  addSetAreaPhotoRepairNameWatcher,
  createAnnotationWatcher,
  getAnnotationsWatcher,
  updateAnnotationWatcher,
  deleteAnnotationWatcher,

  addAddAreaPhotoRepairWatcher,
  addDeleteAreaPhotoRepairWatcher,
  addGetAreaPhotoRepairsWatcher,

  setDeletedAreaPhotoWatcher,
  setDeletedAreaPhotosWatcher,
};
