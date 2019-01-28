/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import siteDetailReducer from 'containers/SiteDetail/reducer';

import clientDetailReducer from 'containers/ClientDetail/reducer';
import orderDetailReducer from 'containers/OrderDetail/orderDetail.reducer';

import globalReducer from '../containers/App/reducer';
import languageProviderReducer from '../containers/LanguageProvider/reducer';

import clientReducer from './client.reducer';
import siteReducer from './site.reducer';
import orderReducer from './order.reducer';
import dronePlanReducer from './dronePlan.reducer';
import repairsReducer from './repairs.reducer';
import siteRepairsReducer from './siteRepairs.reducer';
import zonesReducer from './zones.reducer';
import sitePhotoReducer from './sitePhoto.reducer';
import filterReducer from './filter.reducer';
import siteMetricsReducer from './siteMetrics.reducer';
import s3FoldersReducer from './s3.reducer';
import userReducer from './user.reducer';
import videoReducer from './video.reducer';
import commentReducer from './comment.reducer';
import bidSheetReducer from './bidSheet.reducer';
import uiReducer from './UI.reducer';
import siteScreenshotReducer from './siteScreenshot.reducer';
import repairCommentReducer from './repairComment.reducer';
import featureReducer from './feature.reducer';
import pdfReducer from './sitePdf.reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-appRedux@5
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    order: orderReducer,
    dronePlan: dronePlanReducer,
    zones: zonesReducer,
    client: clientReducer,
    route: routeReducer,
    global: globalReducer,
    language: languageProviderReducer,
    filter: filterReducer,
    repairs: repairsReducer,
    site: siteReducer,
    sitePhoto: sitePhotoReducer,
    siteDetail: siteDetailReducer,
    siteRepairs: siteRepairsReducer,
    clientDetail: clientDetailReducer,
    siteMetrics: siteMetricsReducer,
    s3Folders: s3FoldersReducer,
    user: userReducer,
    video: videoReducer,
    orderDetail: orderDetailReducer,
    comment: commentReducer,
    bidSheet: bidSheetReducer,
    UI: uiReducer,
    siteScreenshot: siteScreenshotReducer,
    repairComment: repairCommentReducer,
    siteFeature: featureReducer,
    pdfDoc: pdfReducer,
    ...injectedReducers,
  });
}
