// @flow
import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SiteMedia from './components/SiteMedia';
import {
  makeSelectSiteAreas,
  makeSelectAreaItem,
  makeSelectIsLoading,
  makeSelectIsAreaLoading,
} from '../../appSelector/sitePhoto';
import { actions } from '../../appReducer/sitePhoto.reducer';

const SharedPhotosComponent = (props) => (
  <SiteMedia {...props} isShared />
);

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  areas: makeSelectSiteAreas(),
  areaDetail: makeSelectAreaItem(),
  isAreaLoading: makeSelectIsAreaLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteAreas: (siteId, token) => dispatch(actions.fetchSiteAreas({ siteId, token, callChangeAreaId: true })),
  changeAreaId: ({ siteId, areaId, token, type, page, pageSize }) => dispatch(actions.changeAreaId({ siteId, areaId, token, type, page, pageSize })),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { siteId, token } = this.props.route.match.params;
      this.props.getSiteAreas(siteId, token);
    },
  })
)(SharedPhotosComponent);
