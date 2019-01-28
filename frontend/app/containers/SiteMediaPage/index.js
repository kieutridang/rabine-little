// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import SiteMedia from './components/SiteMedia';
import {
  makeSelectRepairs,
} from '../../appSelector/repairs';
import {
  makeSelectSiteAreas,
  makeSelectAreaItem,
  makeSelectIsLoading,
  makeSelectIsAreaLoading,
} from '../../appSelector/sitePhoto';
import { actions } from '../../appReducer/sitePhoto.reducer';
import { actions as repairsActions } from '../../appReducer/repairs.reducer';

class SitePhotoPage extends React.Component {

  componentDidMount() {
    const { getSiteAreas, getRepairs, route } = this.props;
    const { siteId } = route.match.params;

    getSiteAreas(siteId);
    getRepairs();
  }

  render() {
    return <SiteMedia {...this.props} />;
  }
}

SitePhotoPage.propTypes = {
  getSiteAreas: PropTypes.func,
  getRepairs: PropTypes.func,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  repairs: makeSelectRepairs(),
  areas: makeSelectSiteAreas(),
  areaDetail: makeSelectAreaItem(),
  isAreaLoading: makeSelectIsAreaLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  getRepairs: () => dispatch(repairsActions.getRepairsRequest()),
  getSiteAreas: (siteId) => dispatch(actions.fetchSiteAreas({ siteId, callChangeAreaId: true })),
  changeAreaId: ({ siteId, areaId, type, token, page, pageSize }) => dispatch(actions.changeAreaId({ siteId, areaId, type, token, page, pageSize })),
  setDeletedAreaPhoto: ({ siteId, areaId, photoId, isDeleted }) => dispatch(actions.setDeletedAreaPhoto({ siteId, areaId, photoId, isDeleted })),
  setDeletedAreaPhotos: ({ siteId, areaId, isDeleted }) => dispatch(actions.setDeletedAreaPhotos({ siteId, areaId, isDeleted })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SitePhotoPage);
