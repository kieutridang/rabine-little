// vendor
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import { createStructuredSelector } from 'reselect';
import { Tab, TabList, TabPanel } from 'react-tabs';

// app
import ContentHeader from '../../components/Content/ContentHeader';
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentData from '../../components/Content/ContentData';
import ContentForm from '../../components/Content/ContentForm';
import Button from '../../components/Button';

import SiteRepairs from './siteRepairList.container';
import { makeSelectSiteRepairs } from '../../appSelector/siteRepairs';
import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { actions as siteZonesActions } from '../../appReducer/zones.reducer';
import { makeSelectZones } from '../../appSelector/zones';
import SiteRepairAdd from './siteRepairAdd.container';
import { DetailData } from '../SiteDetail/selector';
import { fetchDetail } from '../SiteDetail/actions';
import { select, alias } from '../../utils/array/arrayUtils';
import { limitDecimals } from '../../utils/number/numberUtils';
import Tabs from './Tabs';
import './site.css';

class SiteRepairPage extends React.Component {
  state = {
    exportType: 'repairs',
    isAddSiteRepairsOpened: false,
    filteredRepairs: null,
    filteredZones: null,
    featureType: 'PAVEMENT',
    selectedFeatureIndex: 0,
  }

  componentWillMount() {
    Modal.setAppElement('#app');
    this.initData(true);
  }

  featureTypeTabs = {
    0: 'PAVEMENT',
    1: 'ROOFING',
  };

  tabs = {
    0: 'repairs',
    1: 'zone',
  }

  aliases = {
    repairs: {
      title: 'Title',
      repairType: 'Type of Repair',
      year: 'Year',
      unit: 'Unit',
      qty: 'QTY',
      unitPrice: 'Unit Price',
      total: 'Total',
      zone: 'Zone',
      'Site Name': 'Site Name',
    },
    zone: {
      title: 'Title',
      area: 'Area',
      pci: 'PCI',
      surfaceType: 'Surface Type',
      trafficType: 'Traffic Type',
      'Site Name': 'Site Name',
    },
  }

  initData = (shouldGetSiteDetail = false, newFeatureType) => {
    const { siteId } = this.props.route.match.params;
    const featureType = newFeatureType || this.state.featureType;
    const {
      getRepairsRequest,
      getZonesRequest,
      getZoneOptions,
      getSiteDetail,
    } = this.props;

    if (shouldGetSiteDetail) {
      getSiteDetail(siteId);
    }

    getRepairsRequest({ siteId, featureType });
    getZonesRequest({ siteId, featureType });
    getZoneOptions({ siteId, featureType });
  };

  handleSelectFeatureType = (tabIndex) => {
    const featureType = this.featureTypeTabs[tabIndex];
    if (this.state.featureType === featureType) {
      return;
    }
    this.setState({ featureType, selectedFeatureIndex: tabIndex });
    this.initData(false, featureType);
  }

  handleExport = () => {
    const { exportType } = this.state;
    const data = this.handleGetExportData();
    this.handleExportFile(data, this.aliases[exportType]);
  }

  handleGetExportData = () => {
    const { exportType, filteredRepairs, filteredZones } = this.state;
    const { repairs, zones } = this.props;

    if (exportType === 'repairs') {
      return this.handleRepairData(filteredRepairs, repairs);
    }
    return this.handleZoneData(filteredZones, zones);
  }

  handleRepairData = (filteredRepairs, repairs) => {
    const exportData = filteredRepairs && filteredRepairs.length ? [...filteredRepairs] : [...repairs];
    return exportData.map((data) => {
      const { qty } = data;
      const qtyFormatter = limitDecimals(parseFloat(qty || 0.0));
      return { ...data, qty: qtyFormatter };
    });
  }

  handleZoneData = (filteredZones, zones) => {
    const exportData = filteredZones && filteredZones.length ? [...filteredZones] : [...zones];
    return exportData.map((data) => {
      const { area } = data;
      const areaFormatter = limitDecimals(parseFloat(area || 0.0));
      return { ...data, area: areaFormatter };
    });
  }

  handleExportFile = (data, renamedAliases) => {
    const { siteDetail } = this.props;
    const { exportType } = this.state;

    const siteName = siteDetail ? siteDetail.name : '';
    const dataHasSiteName = data.map((item) => ({ ...item, 'Site Name': siteName }));
    const exportData = select(alias([...dataHasSiteName], renamedAliases), Object.values(renamedAliases));
    const csv = Papa.unparse(exportData);
    this.donwloadFile(csv, `${siteName}_${exportType}.csv`);
  }

  handleSelectTabs = (selectedIndex) => {
    this.setState(() => ({ exportType: this.tabs[selectedIndex] }));
  }

  handleOpenSiteRepairs = () => this.props.openAddSiteRepairPane();

  handleFilteredData = (data) => {
    const { exportType } = this.state;
    if (exportType === 'repairs') {
      this.setState({ filteredRepairs: data });
    } else {
      this.setState({ filteredZones: data });
    }
  }

  donwloadFile = (csv, filename) => {
    const blob = new Blob([csv]);
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  render() {
    const { repairs, zones } = this.props;
    const { siteId } = this.props.route.match.params;
    const { isAddSiteRepairsOpened, selectedFeatureIndex, featureType } = this.state;
    return (
      <div>
        <Tabs
          selectedIndex={selectedFeatureIndex}
          className={'tab-feature-types'}
          onSelect={this.handleSelectFeatureType}
        >
          <TabList>
            <Tab>PAVEMENT</Tab>
            <Tab>ROOFING</Tab>
          </TabList>
          <TabPanel className={'hidden-tab'} />
          <TabPanel className={'hidden-tab'} />
        </Tabs>
        <ContentWrapper height="100vh">
          <ContentHeader height="84px" backgroundColor="transparent" border={null} >
            <div />
            <ContentForm>
              <Button
                onClick={this.handleExport}
                color="secondary"
                label="EXPORT REPAIRS"
                width="8.4375rem"
                height="2.5rem"
              />
              <Button
                onClick={this.handleOpenSiteRepairs}
                color="primary"
                label="ADD REPAIR"
                width="8.4375rem"
                height="2.5rem"
              />
            </ContentForm>
          </ContentHeader>

          <ContentData margin={{ bottom: '7rem', top: '-3rem' }}>
            <SiteRepairs
              repairs={repairs}
              zones={zones}
              onSelect={this.handleSelectTabs}
              siteId={siteId}
              onFilter={this.handleFilteredData}
              featureType={featureType}
            />
          </ContentData>

          <SiteRepairAdd
            siteId={siteId}
            isOpen={isAddSiteRepairsOpened}
            onRequestClose={this.handleCloseSiteRepairs}
          />
        </ContentWrapper>
      </div>
    );
  }
}

SiteRepairPage.propTypes = {
  route: PropTypes.any,
  repairs: PropTypes.array,
  zones: PropTypes.array,
  siteId: PropTypes.string,
  getRepairsRequest: PropTypes.func,
  getZonesRequest: PropTypes.func,
  getZoneOptions: PropTypes.func,
  openAddSiteRepairPane: PropTypes.func,
  siteDetail: PropTypes.object,
  getSiteDetail: PropTypes.func,
};

SiteRepairPage.defaultProps = {
  repairs: [],
  zones: [],
};

const mapStateToProps = createStructuredSelector({
  repairs: makeSelectSiteRepairs(),
  zones: makeSelectZones(),
  siteDetail: DetailData(),
});

const mapDispatchToProps = (dispatch) => ({
  getRepairsRequest: (filter) => dispatch(siteRepairActions.getSiteRepairsRequest(filter)),
  openAddSiteRepairPane: () => dispatch(siteRepairActions.openAddSiteRepairPane()),
  getZonesRequest: (filter) => dispatch(siteZonesActions.getZonesRequest(filter)),
  getZoneOptions: (payload) => dispatch(siteZonesActions.getZoneOptionsRequest(payload)),
  getSiteDetail: (id) => dispatch(fetchDetail(id)),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRedux,
)(SiteRepairPage);

