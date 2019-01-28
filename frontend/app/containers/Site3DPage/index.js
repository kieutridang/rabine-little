import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Iframe from 'react-iframe';

import injectSaga from 'common/injectSaga';
import injectReducer from 'common/injectReducer';

import reducer from '../SiteDetail/reducer';
import saga from '../SiteDetail/saga';
import * as SiteDetailSelector from '../SiteDetail/selector';
import * as SiteDetailActions from '../SiteDetail/actions';

class Site3DPage extends Component {

  state = {}

  componentWillMount() {
    const { siteId, token } = this.props.route.match.params;

    this.props.getSiteDetail(siteId, token);
  }

  render() {
    const { isDetailLoading, detailData } = this.props;

    if (isDetailLoading) return null;

    const { dronePlanShareLinks } = detailData;

    if (dronePlanShareLinks && dronePlanShareLinks['3d_model']) {
      return (
        <Fragment>
          <Iframe
            url={dronePlanShareLinks['3d_model']}
            width="100%"
            height="calc(100vh - 3.375rem)"
            styles={{ marginTop: '3.375rem' }}
            position="absolute"
            allowFullScreen
          />
        </Fragment>
      );
    }

    return (
      <h2>Site does not contain 3D model yet</h2>
    );
  }
}

Site3DPage.propTypes = {
  getSiteDetail: PropTypes.func.isRequired,
  isDetailLoading: PropTypes.bool,
  detailData: PropTypes.object,
  route: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  isDetailLoading: SiteDetailSelector.IsLoadingDetail(),
  detailData: SiteDetailSelector.DetailData(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteDetail: (id, token) => dispatch(SiteDetailActions.fetchDetail(id, token)),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'siteDetail', reducer });
const withSaga = injectSaga({ key: 'siteDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withRedux,
)(Site3DPage);
