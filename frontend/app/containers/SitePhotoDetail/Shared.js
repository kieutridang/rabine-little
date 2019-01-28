import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PhotoDetail from './components/PhotoDetail';
import { makeSelectSiteAreas, makeSelectAreaItem, makeSelectIsLoading, makeGetAnnotationLoading, makeGetAnnotations } from '../../appSelector/sitePhoto';
import { makeSelectSiteRepairs } from '../../appSelector/siteRepairs';
import { makeGetLoadingState, makeGetSiteOrtho } from '../../appSelector/site';


import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { actions as sitePhotoActions } from '../../appReducer/sitePhoto.reducer';
import { actions as repairsActions } from '../../appReducer/repairs.reducer';
import { actions as siteActions } from '../../appReducer/site.reducer';

const SharedSitePhotoDetailComponent = (props) => (
  <PhotoDetail {...props} isShared />
);

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  areas: makeSelectSiteAreas(),
  areaDetail: makeSelectAreaItem(),
  siteRepairs: makeSelectSiteRepairs(),
  isOrthoLoading: makeGetLoadingState(),
  siteOrtho: makeGetSiteOrtho(),
  annotations: makeGetAnnotations(),
  isAnnotationLoading: makeGetAnnotationLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteAreas: (siteId, token) => dispatch(sitePhotoActions.fetchSiteAreas({ siteId, token, callChangeAreaId: false })),
  changeAreaId: ({ siteId, areaId, token }) => dispatch(sitePhotoActions.changeAreaId({ siteId, areaId, token })),
  getRepairs: () => dispatch(repairsActions.getRepairsRequest()),
  getSiteRepairs: (filter) => dispatch(siteRepairActions.getSiteRepairsRequest(filter)),
  getTemplate: (siteId, query) => dispatch(siteActions.getSiteOrthoRequest({ siteId, query })),

  createAnnotation: (data) => dispatch(sitePhotoActions.createAnnotation(data)),
  getAnnotations: (photoId) => dispatch(sitePhotoActions.getAnnotations(photoId)),
  updateAnnotation: ({ data, annotationId, annotations }) => dispatch(sitePhotoActions.updateAnnotation({ data, annotationId, annotations })),
  deleteAnnotation: (data) => dispatch(sitePhotoActions.deleteAnnotation(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SharedSitePhotoDetailComponent);
