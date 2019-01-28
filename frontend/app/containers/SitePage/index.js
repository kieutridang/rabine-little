// vendor
import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from '../../appReducer/site.reducer';

// app
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentData from '../../components/Content/ContentData';

import SiteAdd from './siteAdd.container';
// import SiteList from './siteList.container';
import SiteGrid from './SiteList/siteList.agGrid.container';
import SiteHeader from './siteHeader';
import SiteFilters from './siteFilters';
import DashboardBulkUpload from '../DashboardPage/DashboardBulkUpload';

import { actions as clientActions } from '../../appReducer/client.reducer';
import { actions as s3Actions } from '../../appReducer/s3.reducer';
import { actions as dronePlanActions } from '../../appReducer/dronePlan.reducer';

class SitePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      isShowFilters: false,
      isBulkUploadOpen: false,
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  onNewSiteHandler = () => {
    this.props.showAddSite();
    this.props.getClientsRequest();
    this.props.getDronePlansRequest();
    this.props.getS3Folders();
  }

  onBulkUploadHandler = () => this.setState({ isBulkUploadOpen: true });

  handleCloseBulkUploadPane = () => this.setState({ isBulkUploadOpen: false });

  handleShowHideFilters = () => this.setState((prevState) => ({ isShowFilters: !prevState.isShowFilters }));

  render() {
    const {
      isBulkUploadOpen,
      isShowFilters,
    } = this.state;

    return (
      <ContentWrapper>
        { /* Header */ }
        <SiteHeader
          isShowFilters={isShowFilters}
          showHideFilters={this.handleShowHideFilters}
          openAddNewSitePane={this.onNewSiteHandler}
          openBulkUploadPane={this.onBulkUploadHandler}
        />

        { /* Filter */ }
        <SiteFilters height={isShowFilters ? '4.5rem' : '0'} />

        { /* Data */ }
        <ContentData margin={{ vertical: '2rem' }}>
          <SiteGrid />
        </ContentData>

        <SiteAdd />

        <DashboardBulkUpload
          isOpen={isBulkUploadOpen}
          onRequestClose={this.handleCloseBulkUploadPane}
        />
      </ContentWrapper>
    );
  }
}

SitePage.propTypes = {
  showAddSite: PropTypes.func,
  getDronePlansRequest: PropTypes.func,
  getClientsRequest: PropTypes.func,
  getS3Folders: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  showAddSite: () => dispatch(actions.showAddSite()),
  getSitesRequest: (filter) => dispatch(actions.getSitesRequest(filter)),
  getDronePlansRequest: () => dispatch(dronePlanActions.getDronePlansRequest()),
  getS3Folders: () => dispatch(s3Actions.getS3FoldersRequest()),
  getClientsRequest: (filter) => dispatch(clientActions.getClientsRequest(filter)),
});

export default connect(null, mapDispatchToProps)(SitePage);

