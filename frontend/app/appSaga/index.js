/**
 * Root saga, it always watch for action, use for special case like login & logout
 */

// vendor
import { fork } from 'redux-saga/effects';
// app

import { loginWatcher, signupWatcher, logoutWatcher, updateUserWatcher, getInvitedUserByIdWatcher } from './auth';
import { addClientWatcher, editClientWatcher, addGetClientsWatcher, deleteClientsWatcher, uploadCompanyLogoWatcher, deleteCompanyLogoWatcher } from './client';
import {
  addSiteWatcher,
  addGetSitesWatcher,
  addGetSiteOrthoWatcher,
  deleteSiteWatcher,
  editSiteWatcher,
} from './site';
import { addGetOrdersWatcher } from './order';
import { addGetDronePlansWatcher, addGetAllPlansWatcher } from './dronePlan';
import { addGetRepairsWatcher } from './repairs';
import {
  addGetSiteRepairsWatcher,
  getGetSiteRepairsWatcher,
  setSiteRepairsUnitPriceWatcher,
  deleteSiteRepairWatcher,
  getGetSiteRepairPhotosWatcher,
} from './siteRepairs';
import { addGetZonesWatcher, addGetZoneOptionsWatcher } from './zones';
import {
  addFetchSiteAreasWatcher,
  addFetchSiteAreaWatcher,
  addGetAreaPhotosWatcher,
  addToggleAreaPhotoDefectedWatcher,
  addSetAreaPhotoDefectedTypeWatcher,
  addToggleAreaPhotoRepairWatcher,
  addSetAreaPhotoRepairNameWatcher,
  addSetAreaPhotoDefectedSeverityWatcher,
  createAnnotationWatcher,
  getAnnotationsWatcher,
  updateAnnotationWatcher,
  deleteAnnotationWatcher,

  addGetAreaPhotoRepairsWatcher,
  addAddAreaPhotoRepairWatcher,
  addDeleteAreaPhotoRepairWatcher,

  setDeletedAreaPhotoWatcher,
  setDeletedAreaPhotosWatcher,

} from './sitePhoto';
import {
  createCommentWatcher,
  createSharedCommentWatcher,
  getCommentsWatcher,
  deleteCommentWatcher,
} from './comment';
import {
  createRepairCommentWatcher,
  createRepairSharedCommentWatcher,
  getRepairCommentsWatcher,
  deleteRepairCommentWatcher,
} from './repairComment';
import { addGetSiteMetricsWatcher } from './siteMetrics';
import { fetchS3FoldersWatcher, fetchS3InfoFlowWatcher, syncS3FolderFlowWatcher } from './s3';
import { inviteUserWatcher, addGetUsersWatcher, getClientsCollectionWatcher, getInvitedUsersWatcher, resetPasswordWatcher, changetPasswordWatcher } from './user';
import { addGetAreaVideosWatcher } from './video';
import { addBidSheetValuesWatcher, getBidSheetValuesWatcher } from './bidSheet';
import { addScreenshotSiteWatcher, getScreenshotsSiteWatcher } from './siteScreenshot';
import { addPdfSiteWatcher, getPdfSiteWatcher } from './sitePdf';
import siteDetailSaga from '../containers/SiteDetail/saga';
import {
  getOrderByIdWatcher,
  updateOrderWatcher,
  getOrderActivitiesWatcher,
  createOrderNoteWatcher,
} from '../containers/OrderDetail/orderDetail.saga';
import { createFeatureWatcher, putFeatureWatcher, deleteFeatureWatcher, cutFeatureWatcher } from './feature';

export default function* root() {
  yield fork(loginWatcher);
  yield fork(signupWatcher);
  yield fork(logoutWatcher);
  yield fork(updateUserWatcher);

  yield fork(addClientWatcher);
  yield fork(editClientWatcher);
  yield fork(addGetClientsWatcher);
  yield fork(deleteClientsWatcher);
  yield fork(uploadCompanyLogoWatcher);
  yield fork(deleteCompanyLogoWatcher);

  yield fork(addSiteWatcher);
  yield fork(editSiteWatcher);
  yield fork(deleteSiteRepairWatcher);
  yield fork(addGetSitesWatcher);
  yield fork(createAnnotationWatcher);
  yield fork(getAnnotationsWatcher);
  yield fork(updateAnnotationWatcher);
  yield fork(deleteAnnotationWatcher);


  yield fork(addGetDronePlansWatcher);
  yield fork(addGetAllPlansWatcher);
  yield fork(addGetRepairsWatcher);
  yield fork(addGetSiteRepairsWatcher);
  yield fork(getGetSiteRepairsWatcher);
  yield fork(getGetSiteRepairPhotosWatcher);
  yield fork(setSiteRepairsUnitPriceWatcher);
  yield fork(addGetZonesWatcher);
  yield fork(addGetZoneOptionsWatcher);

  yield fork(addFetchSiteAreasWatcher);
  yield fork(addFetchSiteAreaWatcher);

  yield fork(addGetOrdersWatcher);
  yield fork(getOrderByIdWatcher);
  yield fork(updateOrderWatcher);
  yield fork(getOrderActivitiesWatcher);
  yield fork(createOrderNoteWatcher);

  yield fork(addGetSiteOrthoWatcher);
  yield fork(addGetAreaPhotosWatcher);
  yield fork(deleteSiteWatcher);

  yield fork(addToggleAreaPhotoDefectedWatcher);
  yield fork(addSetAreaPhotoDefectedTypeWatcher);
  yield fork(addToggleAreaPhotoRepairWatcher);
  yield fork(addSetAreaPhotoRepairNameWatcher);
  yield fork(addSetAreaPhotoDefectedSeverityWatcher);
  yield fork(addGetSiteMetricsWatcher);

  yield fork(fetchS3FoldersWatcher);
  yield fork(fetchS3InfoFlowWatcher);
  yield fork(syncS3FolderFlowWatcher);

  yield fork(inviteUserWatcher);
  yield fork(addGetUsersWatcher);
  yield fork(getClientsCollectionWatcher);
  yield fork(getInvitedUsersWatcher);
  yield fork(getInvitedUserByIdWatcher);
  yield fork(resetPasswordWatcher);
  yield fork(changetPasswordWatcher);

  yield fork(addGetAreaVideosWatcher);
  yield fork(siteDetailSaga);

  yield fork(createCommentWatcher);
  yield fork(createSharedCommentWatcher);
  yield fork(getCommentsWatcher);
  yield fork(deleteCommentWatcher);

  yield fork(createRepairCommentWatcher);
  yield fork(createRepairSharedCommentWatcher);
  yield fork(getRepairCommentsWatcher);
  yield fork(deleteRepairCommentWatcher);

  yield fork(addBidSheetValuesWatcher);
  yield fork(getBidSheetValuesWatcher);

  yield fork(addScreenshotSiteWatcher);
  yield fork(getScreenshotsSiteWatcher);
  yield fork(addPdfSiteWatcher);
  yield fork(getPdfSiteWatcher);

  yield fork(createFeatureWatcher);
  yield fork(putFeatureWatcher);
  yield fork(deleteFeatureWatcher);
  yield fork(cutFeatureWatcher);

  yield fork(addAddAreaPhotoRepairWatcher);
  yield fork(addDeleteAreaPhotoRepairWatcher);
  yield fork(addGetAreaPhotoRepairsWatcher);

  yield fork(setDeletedAreaPhotoWatcher);

  yield fork(setDeletedAreaPhotosWatcher);
}
