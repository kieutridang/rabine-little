import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import siteApi from '../../appApi/site';
import SlidingPane from '../../components/SlidePane';
import FileImporter from '../../components/FileImporter';
import { actions as siteActions } from '../../appReducer/site.reducer';
import { actions as clientActions } from '../../appReducer/client.reducer';
import { actions as dronePlanActions } from '../../appReducer/dronePlan.reducer';
import { makeGetClients } from '../../appSelector/client';
import { makeGetDronePlans } from '../../appSelector/dronePlan';
import { statusOptions, typeOptions } from '../Common/Options';
import { makeSiteImportTemplate, templateFile } from './importTemplates';
import { actions as s3Actions } from '../../appReducer/s3.reducer';
import { makeSelectS3Folders } from '../../appSelector/s3';

class DashboardBulkUpload extends React.Component {

  constructor(props, context) {
    super(props, context);

    const {
      clients,
      dronePlans,
      s3Folders,
      getClientsRequest,
      getDronePlansRequest,
      getS3Folders,
    } = this.props;

    if (!clients && getClientsRequest) getClientsRequest();
    if (!dronePlans && getDronePlansRequest) getDronePlansRequest();
    if (!s3Folders && getS3Folders) getS3Folders();
  }

  handleAddSites = (sites) => siteApi.createSite(sites[0]);

  handleFinish = () => this.props.getSitesRequest();

  render() {
    const {
      isOpen,
      onRequestClose,
      addSiteRequest,
      clients,
      dronePlans,
      s3Folders,
      ...rest
    } = this.props;

    const templates = makeSiteImportTemplate({ clients, dronePlans, statusOptions, typeOptions, s3Folders });

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Bulk Upload"
        onRequestClose={onRequestClose}
        {...rest}
      >
        <FileImporter
          name="sites"
          templates={templates}
          templateFile={templateFile}
          action={this.handleAddSites}
          onFinish={this.handleFinish}
        />
      </SlidingPane>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addSiteRequest: (site) => dispatch(siteActions.addSiteRequest(site)),
  getDronePlansRequest: () => dispatch(dronePlanActions.getDronePlansRequest()),
  getClientsRequest: (filter) => dispatch(clientActions.getClientsRequest(filter)),
  getSitesRequest: (filter) => dispatch(siteActions.getSitesRequest(filter)),
  getS3Folders: () => dispatch(s3Actions.getS3FoldersRequest()),
});

const mapStateToProps = createStructuredSelector({
  clients: makeGetClients(),
  dronePlans: makeGetDronePlans(),
  s3Folders: makeSelectS3Folders(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

DashboardBulkUpload.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  getClientsRequest: PropTypes.func,
  getDronePlansRequest: PropTypes.func,
  addSiteRequest: PropTypes.func,
  getSitesRequest: PropTypes.func,
  getS3Folders: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
  dronePlans: PropTypes.arrayOf(PropTypes.object),
  s3Folders: PropTypes.arrayOf(PropTypes.object),
};

export default compose(
  withConnect,
)(DashboardBulkUpload);

