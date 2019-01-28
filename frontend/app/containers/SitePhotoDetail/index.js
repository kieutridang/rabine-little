import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PhotoDetail from './components/PhotoDetail';
import { makeSelectRepairs } from '../../appSelector/repairs';
import { makeSelectSiteAreas, makeSelectAreaItem, makeSelectIsLoading, makeGetAreaPhotoRepairs, makeGetAnnotations, makeGetAnnotationLoading } from '../../appSelector/sitePhoto';
import { makeGetLoadingState, makeGetSiteOrtho } from '../../appSelector/site';
import { actions as sitePhotoActions } from '../../appReducer/sitePhoto.reducer';
import { actions as repairsActions } from '../../appReducer/repairs.reducer';

import { makeSelectSiteRepairs } from '../../appSelector/siteRepairs';
import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { actions as siteActions } from '../../appReducer/site.reducer';

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  repairs: makeSelectRepairs(),
  areas: makeSelectSiteAreas(),
  areaDetail: makeSelectAreaItem(),
  siteRepairs: makeSelectSiteRepairs(),
  annotations: makeGetAnnotations(),
  isAnnotationLoading: makeGetAnnotationLoading(),
  isOrthoLoading: makeGetLoadingState(),
  siteOrtho: makeGetSiteOrtho(),
  areaPhotoRepairs: makeGetAreaPhotoRepairs(),
});

const mapDispatchToProps = (dispatch) => ({
  toggleAreaPhotoDefected: (payload) => dispatch(sitePhotoActions.toggleAreaPhotoDefected(payload)),
  setAreaPhotoDefectedType: (payload) => dispatch(sitePhotoActions.setAreaPhotoDefectedType(payload)),
  toggleAreaPhotoRepair: (payload) => dispatch(sitePhotoActions.toggleAreaPhotoRepair(payload)),
  setAreaPhotoRepairName: (payload) => dispatch(sitePhotoActions.setAreaPhotoRepairName(payload)),
  setAreaPhotoDefectedSeverity: (payload) => dispatch(sitePhotoActions.setAreaPhotoDefectedSeverity(payload)),
  getSiteAreas: (siteId) => dispatch(sitePhotoActions.fetchSiteAreas({ siteId, callChangeAreaId: false })),
  getSiteRepairs: (filter) => dispatch(siteRepairActions.getSiteRepairsRequest(filter)),
  changeAreaId: ({ siteId, areaId }) => dispatch(sitePhotoActions.changeAreaId({ siteId, areaId })),
  getRepairs: () => dispatch(repairsActions.getRepairsRequest()),
  getTemplate: (siteId, query) => dispatch(siteActions.getSiteOrthoRequest({ siteId, query })),

  getAreaPhotoRepairs: (photoId) => dispatch(sitePhotoActions.getAreaPhotoRepairs(photoId)),
  addAreaPhotoRepair: (payload) => dispatch(sitePhotoActions.addAreaPhotoRepair(payload)),
  deleteAreaPhotoRepair: (photoId, repairId) => dispatch(sitePhotoActions.deleteAreaPhotoRepair({ photoId, repairId })),

  createAnnotation: (data) => dispatch(sitePhotoActions.createAnnotation(data)),
  getAnnotations: (photoId) => dispatch(sitePhotoActions.getAnnotations(photoId)),
  updateAnnotation: ({ data, annotationId, annotations }) => dispatch(sitePhotoActions.updateAnnotation({ data, annotationId, annotations })),
  deleteAnnotation: (data) => dispatch(sitePhotoActions.deleteAnnotation(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail);
