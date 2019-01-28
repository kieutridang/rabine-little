// vendor
import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// app
import DashboardHeader from './DashboardHeader';
import DashboardFilters from './DashboardFilters';
import DashboardBulkUpload from './DashboardBulkUpload';
import DashboardContent from './DashboardContent';
import ContentWrapper from '../../components/Content/ContentWrapper';
import SiteAdd from '../SitePage/siteAdd.container';
import { actions } from '../../appReducer/site.reducer';

class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

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

  handleOpenBulkUploadPane = () => this.setState({ isBulkUploadOpen: true });

  handleCloseBulkUploadPane = () => this.setState({ isBulkUploadOpen: false });

  handleOpenAddNewSitePane = () => this.props.showAddSite();

  handleShowHideFilters = () => this.setState((prevState) => ({ isShowFilters: !prevState.isShowFilters }));

  render() {
    const {
      isShowFilters,
      isBulkUploadOpen,
    } = this.state;

    return (
      <ContentWrapper tag="article">
        { /* Header */ }
        <DashboardHeader
          isShowFilters={isShowFilters}
          showHideFilters={this.handleShowHideFilters}
          openBulkUploadPane={this.handleOpenBulkUploadPane}
          openAddNewSitePane={this.handleOpenAddNewSitePane}
        />

        { /* Filter */ }
        <DashboardFilters height={isShowFilters ? '4.5rem' : '0'} />

        { /* Data */ }
        <DashboardContent />

        { /* Add site sliding page */ }
        <SiteAdd />

        { /* Bulk upload sliding page */ }
        <DashboardBulkUpload
          isOpen={isBulkUploadOpen}
          onRequestClose={this.handleCloseBulkUploadPane}
        />
      </ContentWrapper>
    );
  }
}

DashboardPage.propTypes = {
  showAddSite: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  showAddSite: () => dispatch(actions.showAddSite()),
});

export default connect(null, mapDispatchToProps)(DashboardPage);
