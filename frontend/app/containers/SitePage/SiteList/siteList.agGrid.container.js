// vendor
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { Snackbar } from '@material-ui/core';
import Button from '@material-ui/core/Button';

// app
import SiteListDropdownMenu from './siteList.dropdown';
import { actions } from '../../../appReducer/site.reducer';
import { statusOptions, typeOptions } from '../../Common/Options';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {
  makeGetSitesWithFilters,
  makeGetLoadingState,
  makeGetIsEdittingState,
} from '../../../appSelector/site';
import apiRepairs from '../../../appApi/repairs';
import { SiteSnackbarNumber } from './../StyledComponents';
import { downloadBlobFile, destroyDownloadResource } from '../../../utils/files/fileUtils';
import SiteListDateFilter from './siteList.dateFilter';
import SiteListStatusEditor from './siteList.statusEditor';
import SiteListDateEditor from './siteList.dateEditor';
import SiteListNameRenderer from './siteList.nameRenderer';
import SiteListDateRenderer from './siteList.dateRenderer';
import SiteListCostRenderer from './siteList.costRenderer';
import SiteListStatusRenderer from './siteList.statusRenderer';
import { actions as s3Actions } from '../../../appReducer/s3.reducer';
import { makeSelectS3Folders } from '../../../appSelector/s3';
import { actions as planActions } from '../../../appReducer/dronePlan.reducer';
import { makeGetAllPlans } from '../../../appSelector/dronePlan';
import { SocketConst } from '../../SiteMapPage/constants';
import { socket } from '../../SiteMapPage';

class SiteGrid extends Component {
  state = {
    selectedIds: [],
    checkedAll: false,
    downloadingRepairs: false,
    sites: null,
    sitesWorking: [],
    gridApi: null,
    gridOptions: null,
  };

  componentDidMount() {
    const { getSites, s3Folders, getS3Folders, allPlans, getAllPlans } = this.props;

    if (getSites) {
      getSites();
    }

    if (!s3Folders && getS3Folders) {
      getS3Folders();
    }

    if (!allPlans && getAllPlans) {
      getAllPlans();
    }

    socket.on(SocketConst.RES_ALL_USERS_WORKING, (data) => {
      const workingSiteIds = data.map((item) => item.sId);
      this.workingSiteIds = workingSiteIds;

      if (this.gridReady) {
        this.updateWorkingSites();
      }
    });

    socket.emit(SocketConst.REQ_ALL_USERS_WORKING);
  }

  componentWillUnmount() {
    this.gridReady = false;
  }

  onGridReady = (params) => {
    this.gridReady = true;
    const { columnApi, api } = params;

    columnApi.autoSizeColumns();
    this.setState({ gridApi: api });
    this.setState({ gridOptions: api.gridOptionsWrapper.gridOptions });

    this.updateWorkingSites();
  };

  onCellValueChanged = (params) => {
    const { oldValue, newValue, data, colDef } = params;
    const { field } = colDef;
    const { editSite, allPlans } = this.props;

    if (data && editSite && oldValue !== newValue) {
      const siteRequest = {
        ...data,
        [field]: newValue,
      };

      if (field && field === 'dronePlanName') {
        const planIndex = allPlans.findIndex((plan) => plan.name === newValue);
        const dronePlanId = planIndex === -1 ? null : allPlans[planIndex].id;
        siteRequest.dronePlanId = dronePlanId;
      }

      editSite(siteRequest);

      if (colDef.field === 'rabineS3Folder' && siteRequest.rabineS3Folder) {
        this.props.getS3SyncInfoRequest(newValue);
      }
    }
  };

  onRowSelected = (event) => {
    const { data, selected } = event.node;
    const { id } = data;
    const { selectedIds } = this.state;

    if (selected) {
      this.setState({ selectedIds: [...selectedIds, id] });
    } else {
      const index = selectedIds.findIndex((selectedId) => selectedId === id);
      const newSelectedIds = [...selectedIds];
      newSelectedIds.splice(index, 1);
      this.setState({ selectedIds: [...newSelectedIds] });
    }
  };

  getFilterStatusValues = () => statusOptions.map(({ value }) => value);

  getStatusFilterParams = () => ({
    suppressSorting: true,
    selectAllOnMiniFilter: true,
    values: this.getFilterStatusValues(),
    cellRenderer: this.renderFilterStatusValues,
  });

  getGridRowStyle = (params) => {
    if (this.workingSiteIds && this.workingSiteIds.includes(params.data.id)) {
      return { 'background-color': 'yellow' };
    }

    return null;
  };

  updateWorkingSites = () => {
    try {
      const { sites } = this.props;
      const { gridApi, gridOptions } = this.state;

      if (sites) {
        gridOptions.getRowStyle = this.getGridRowStyle;

        if (gridApi) {
          gridApi.redrawRows();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleExportRepairs = () => {
    const { selectedIds } = this.state;
    const url = apiRepairs.getDownloadRepairsBySiteIdsUrl(selectedIds);

    this.setState(() => ({ downloadingRepairs: true }));
    apiRepairs.downloadRepairFile(url)
      .then((blob) => downloadBlobFile(blob, 'site_repairs.csv'))
      .then((payload) => destroyDownloadResource(payload))
      .finally(() => this.setState({ downloadingRepairs: false }));
  };

  handleExportZones = () => {
    const { selectedIds } = this.state;
    const url = apiRepairs.getDownloadZonesBySiteIdsUrl(selectedIds);

    this.setState(() => ({ downloadingRepairs: true }));
    apiRepairs.downloadZonesFile(url)
      .then((blob) => downloadBlobFile(blob, 'site_zones.csv'))
      .then((payload) => destroyDownloadResource(payload))
      .finally(() => this.setState({ downloadingRepairs: false }));
  };

  renderFilterStatusValues = (params) => {
    const { value } = params;
    const statusIndex = statusOptions.findIndex((obj) => obj.value === value);
    return statusIndex !== -1 ? statusOptions[statusIndex].text : value;
  };

  renderTypeEditorValues = () => ({ values: typeOptions.map((type) => type.value) });

  renderFolderEditorValues = () => {
    const { s3Folders } = this.props;

    if (s3Folders) {
      return { values: s3Folders.map((folder) => folder.id) };
    }

    return { values: [] };
  };

  renderPlanEditorValues = () => {
    const { allPlans, sites } = this.props;

    if (allPlans && sites) {
      const planIds = sites.map((plan) => plan.dronePlanId);
      const values = allPlans.filter((plan) => planIds.indexOf(plan.dronePlanId) === -1)
        .map((plan) => plan.name);

      return { values };
    }

    return { values: [] };
  };

  render() {
    const { selectedIds, downloadingRepairs } = this.state;
    const { isLoading, isEditing, sites } = this.props;

    return isLoading ? <LoadingIndicator /> : (
      <div
        className="ag-theme-material"
        style={{ height: 600, boxSizing: 'border-box' }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}
          onCellValueChanged={this.onCellValueChanged}
          onRowSelected={this.onRowSelected}

          toolPanelSuppressPivotMode
          toolPanelSuppressRowGroups
          toolPanelSuppressValues
          toolPanelSuppressPivots

          suppressRowClickSelection
          rowSelection="multiple"
          enableColResize
          enableSorting
          enableFilter
          floatingFilter
          pagination
          paginationPageSize={100}

          rowData={sites}
        >
          <AgGridColumn
            checkboxSelection
            headerCheckboxSelection
            headerCheckboxSelectionFilteredOnly
            suppressSorting
            suppressFilter
            suppressResize
            width={60}
            headerName="CHECKBOXES"
          />
          <AgGridColumn
            field="name"
            headerName="SITE NAME"
            filter="agTextColumnFilter"
            cellRendererFramework={SiteListNameRenderer}
            suppressMenu
            editable={!isEditing}
          />
          <AgGridColumn
            field="address"
            headerName="ADDRESS"
            filter="agTextColumnFilter"
            suppressMenu
            editable={!isEditing}
          />
          <AgGridColumn
            field="deadline"
            headerName="DEADLINE"
            cellEditorFramework={SiteListDateEditor}
            cellRendererFramework={SiteListDateRenderer}
            filterFramework={SiteListDateFilter}
            suppressMenu
            editable={!isEditing}
          />
          <AgGridColumn
            field="cost"
            headerName="COST"
            filter="agNumberColumnFilter"
            cellRendererFramework={SiteListCostRenderer}
            suppressMenu
            editable={!isEditing}
          />
          <AgGridColumn
            field="status"
            headerName="STATUS"
            filter="agSetColumnFilter"
            filterParams={this.getStatusFilterParams()}
            cellRendererFramework={SiteListStatusRenderer}
            cellEditorFramework={SiteListStatusEditor}
            enableRowGroup
            enableValue
            suppressMenu
            editable={!isEditing}
          />
          <AgGridColumn
            field="dronePlanName"
            headerName="DRONE DEPLOY PLAN"
            cellEditor="agRichSelectCellEditor"
            cellEditorParams={this.renderPlanEditorValues}
            suppressMenu
            editable={!isEditing}
          />
          <AgGridColumn
            field="rabineS3Folder"
            headerName="S3 FOLDER"
            cellEditor="agRichSelectCellEditor"
            cellEditorParams={this.renderFolderEditorValues}
            editable={!isEditing}
            suppressMenu
          />
          <AgGridColumn
            field="type"
            headerName="SITE TYPE"
            cellEditor="agRichSelectCellEditor"
            cellEditorParams={this.renderTypeEditorValues}
            editable={!isEditing}
            suppressMenu
          />
          <AgGridColumn
            field="totalRepairs"
            headerName="TOTAL REPAIRS"
            filter="agNumberColumnFilter"
            suppressMenu
          />
          <AgGridColumn
            field="clientName"
            headerName="CLIENT NAME"
            suppressMenu
          />
          <AgGridColumn
            width={60}
            suppressFilter
            suppressResize
            suppressSorting
            suppressMenu
            headerName="ACTION"
            pinned="right"
            cellRendererFramework={SiteListDropdownMenu}
          />
        </AgGridReact>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={!!selectedIds.length}
          ContentProps={{
            'aria-describedby': 'message-id',
            className: 'Site__Snackbar',
          }}
          message={
            <SiteSnackbarNumber id="message-id">
              {selectedIds.length} Site{selectedIds.length > 1 && 's'} Selected
            </SiteSnackbarNumber>
          }
          action={
            !downloadingRepairs
            ? (
              <Fragment>
                <Button
                  color="inherit"
                  size="small"
                  className="Site__Snackbar-Button"
                  onClick={this.handleExportRepairs}
                  disabled={!selectedIds.length}
                >
                  Export Repairs
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  className="Site__Snackbar-Button"
                  onClick={this.handleExportZones}
                  disabled={!selectedIds.length}
                >
                  Export Zones
                </Button>
              </Fragment>
            )
            : <Spinner name="circle" />
          }
        />
      </div>
    );
  }
}

SiteGrid.propTypes = {
  getSites: PropTypes.func,
  isLoading: PropTypes.bool,
  isEditing: PropTypes.bool,
  sites: PropTypes.arrayOf(PropTypes.object),
  s3Folders: PropTypes.arrayOf(PropTypes.object),
  allPlans: PropTypes.arrayOf(PropTypes.object),
  editSite: PropTypes.func,
  getS3Folders: PropTypes.func,
  getAllPlans: PropTypes.func,
  getS3SyncInfoRequest: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  sites: makeGetSitesWithFilters(),
  isLoading: makeGetLoadingState(),
  isEditing: makeGetIsEdittingState(),
  s3Folders: makeSelectS3Folders(),
  allPlans: makeGetAllPlans(),
});

const mapDispatchToProps = (dispatch) => ({
  getSites: (filter) => dispatch(actions.getSitesRequest(filter)),
  editSite: (site) => dispatch(actions.editSiteRequest(site)),
  getS3Folders: () => dispatch(s3Actions.getS3FoldersRequest()),
  getS3SyncInfoRequest: (rabineS3Folder) => dispatch(s3Actions.getS3SyncInfoRequest(rabineS3Folder)),
  getAllPlans: () => dispatch(planActions.getAllPlansRequest()),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(SiteGrid);
