import React, { PureComponent } from 'react';
import _ from 'lodash';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';

import {
  BidSheetWrapper,
  BidSheetPreview,
  BidSheetContent,
} from './Components/Styled';
import BidSheetPDF from './Components/BidSheetPDF/Loadable';
import BidSheetHeader from './Components/BidSheetHeader';
import BidSheetSideBar from './Components/BidSheetSideBar';

import { rabineFetcher } from '../../appApi/fetcher/rabineFetcher';

import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { actions as siteZonesActions } from '../../appReducer/zones.reducer';
import { actions as bidSheetActions } from '../../appReducer/bidSheet.reducer';
import { actions as siteScreenshotActions } from '../../appReducer/siteScreenshot.reducer';

import { makeSelectSiteRepairs } from '../../appSelector/siteRepairs';
import { makeSelectBidSheetValues, makeSelectBidSheetLoading } from '../../appSelector/bidSheet';
import { makeSelectZones } from '../../appSelector/zones';
import { makeSelectScreenshotError, makeSelectScreenshots } from '../../appSelector/siteScreenshot';

import { DetailData } from '../SiteDetail/selector';
import { fetchDetail } from '../SiteDetail/actions';

import sortYears from './utils/sortYears';
import setLogoClientURL from './utils/setLogoClientURL';

const initialState = {
  textValues: {
    text1: '',
    text2: '',
    text3: '',
    text4: '',
    text5: '',
  },
  checkboxValues: {
    zones: {
      name: true,
      area: true,
      pci: true,
      surfaceType: true,
      trafficType: true,
    },
    repairs: {
      repair: true,
      type: true,
      qty: true,
      units: true,
      unitPrice: false,
      total: false,
      zone: false,
    },
  },
  color: '#272727',
  clientLogo: {
    blobUrl: null,
    mimeType: null,
    size: null,
    name: null,
  },
  siteLogoPermitted: true,
  loadedFromStore: false,
  clientId: null,
  toggledYears: [],
  pdfDocument: null,
  features: null,
  siteRepairPhotos: null,
};

class SiteBidSheet extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    if (props.bidSheetValues && !state.loadedFromStore) {
      const bidSheetData = props.bidSheetValues.bidSheetData;
      if (!_.isEmpty(bidSheetData)) {
        const data = setLogoClientURL(bidSheetData);
        return { ...data };
      }
    } else if (props.siteDetail) {
      if (props.siteDetail.clientId && !state.clientId) {
        const clientId = props.siteDetail.clientId;
        props.getBidSheetValues(clientId);
        return { clientId };
      }
    }
    return null;
  }

  state = initialState

  componentDidMount() {
    const { siteId } = this.props.route.match.params;
    const {
      getRepairsRequest,
      getZonesRequest,
      getZoneOptions,
      getSiteDetail,
      getSiteScreenshots,
    } = this.props;

    getSiteDetail(siteId);
    getRepairsRequest({ siteId });
    getZonesRequest({ siteId });
    getZoneOptions({ siteId });
    getSiteScreenshots({ siteId });
    this.queryFeatures(siteId);
    this.getRepairPhotos(siteId);
  }

  componentWillUnmount() {
    const { clearBidSheetValues, clearSiteScreenshots } = this.props;
    clearBidSheetValues();
    clearSiteScreenshots();
  }

  onDocumentLoad = (blobUrl) => {
    this.setState({ pdfDocument: blobUrl });
  }

  getRepairPhotos = (siteId) => {
    rabineFetcher.get(`site/${siteId}/areas/repair`).then((res) => {
      this.setState({ siteRepairPhotos: res });
    });
  }

  queryFeatures = (siteId) => {
    rabineFetcher.get(`site/${siteId}/features`)
      .then((data) => {
        const { features } = data;
        this.setState({ features });
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  handleChangeYear = (evt, value) => {
    const toggledYears = _.clone(this.state.toggledYears);

    if (!value) {
      const indexYear = toggledYears.findIndex((el) => el === evt.target.value);
      if (indexYear !== -1) toggledYears.splice(indexYear, 1);
    } else {
      toggledYears.push(evt.target.value);
    }

    sortYears(toggledYears);

    this.setState({ toggledYears });
  }

  calculateTotalExterior = (zones) => {
    let calculationAsphalt = 0;
    let calculationConcrete = 0;
    zones.forEach((zone) => {
      if (zone.surfaceType === 'Asphalt') {
        calculationAsphalt += parseFloat(zone.area);
      } else if (zone.surfaceType === 'Concrete') {
        calculationConcrete += parseFloat(zone.area);
      }
    });
    return {
      totalExteriorConcrete: Math.round(calculationConcrete),
      totalExteriorAsphalt: Math.round(calculationAsphalt),
    };
  }

  calculateWeightedPCI = (zones) => {
    const totalZone = this.calculateTotalZoneArea(zones);
    let weightedPCI = 0;
    zones.forEach((zone) => {
      weightedPCI += (zone.area / totalZone) * zone.pci;
    });
    return Math.round(weightedPCI);
  }

  calculateTotalZoneArea = (zones) => {
    let totalZone = 0;
    zones.forEach((zone) => {
      totalZone += parseFloat(zone.area);
    });
    return totalZone;
  }

  groupRepairsByYear = (values) => {
    const groupedRepairs = {};
    const repairs = values;
    repairs.forEach((repair) => {
      if (repair.year) {
        const repairClone = _.clone(repair);
        const year = repair.year.trim();
        repairClone.qty = Math.round(repairClone.qty);
        if (groupedRepairs[year] === undefined) {
          groupedRepairs[year] = [];
        }
        groupedRepairs[year].push(repairClone);
      }
    });
    return groupedRepairs;
  }

  roundZoneValues = (zones) =>
    zones.map((zone) => {
      const zoneCopy = _.clone(zone);
      zoneCopy.area = Math.round(zoneCopy.area);
      return zoneCopy;
    });

  addFeaturesToZone = (features, zones) => {
    const modifiedZones = [];

    zones.forEach((zone) => {
      features.forEach((feature) => {
        if (feature._id === zone.id) {
          const zoneCopy = zone;
          const featureCopy = feature;
          zoneCopy.color = featureCopy.color;
          modifiedZones.push(zoneCopy);
        }
      });
    });

    modifiedZones.sort((a, b) => a.title > b.title);

    return modifiedZones;
  }

  addFeatureToRepairs = (features, repairs) => {
    const modifiedRepairs = [];
    repairs.forEach((repair) => {
      const repairCopy = repair;
      const featureMatch = features.find((feature) => feature._id === repair.id);
      if (featureMatch) {
        repairCopy.color = featureMatch.color;
        modifiedRepairs.push(repairCopy);
      } else {
        repairCopy.color = '#fff';
        modifiedRepairs.push(repairCopy);
      }
    });
    return modifiedRepairs;
  }

  groupRepairsScreenshots = (screenshots, repairs) => {
    const keys = Object.keys(repairs);
    const groupedScreenshots = {};
    screenshots.forEach((screenshot) => {
      if (keys.includes(screenshot.layerId)) {
        groupedScreenshots[screenshot.layerId] = screenshot;
      }
    });
    return groupedScreenshots;
  }

  addPhotosToRepairs = (repairs) => {
    const { siteRepairPhotos } = this.state;
    repairs.forEach((repair) => repair.repairPhotos = []); // eslint-disable-line
    siteRepairPhotos.photos.forEach((photo) => {
      const associatedRepair = repairs.findIndex((repair) => repair.id === photo.repairName);
      if (associatedRepair !== -1) {
        repairs[associatedRepair].repairPhotos.push(photo);
      }
    });

    return repairs;
  }

  render() {
    const {
      color,
      textValues,
      checkboxValues,
      clientId,
      clientLogo,
      siteLogoPermitted,
      toggledYears,
      features,
      pdfDocument,
      siteRepairPhotos,
    } = this.state;

    const {
      repairs,
      zones,
      siteDetail,
      isBidSheetLoading,
      screenshots,
    } = this.props;

    const { siteId } = this.props.route.match.params;

    if (
      !repairs ||
      !zones ||
      !siteDetail ||
      !siteDetail.id ||
      !clientId ||
      !features ||
      isBidSheetLoading ||
      !siteRepairPhotos
    ) return <LoadingIndicator />;

    const siteDetailCopy = _.clone(siteDetail);
    const { totalExteriorConcrete, totalExteriorAsphalt } = this.calculateTotalExterior(zones);
    const weightedPCI = this.calculateWeightedPCI(zones);
    const zonesRounded = this.roundZoneValues(zones);
    const zonesCompleted = this.addFeaturesToZone(features, zonesRounded);
    const zoneMapScreenshot = screenshots.find((screenshot) => screenshot.layerId === 'ZoneMap');
    const propertyScreenshot = screenshots.find((screenshot) => screenshot.layerId === 'property');

    siteDetailCopy.totalExteriorConcrete = totalExteriorConcrete;
    siteDetailCopy.totalExteriorAsphalt = totalExteriorAsphalt;
    siteDetailCopy.weightedPCI = weightedPCI;

    const repairsFeatured = this.addFeatureToRepairs(features, repairs);
    const repairPhotos = this.addPhotosToRepairs(repairsFeatured);
    const groupedRepairs = this.groupRepairsByYear(repairPhotos);
    const groupedRepairsScreenshots = this.groupRepairsScreenshots(screenshots, groupedRepairs);

    return (
      <BidSheetWrapper>
        <BidSheetHeader
          handleChangeYear={this.handleChangeYear}
          siteName={siteDetailCopy.name}
          siteAddress={siteDetailCopy.address}
          documentUrl={pdfDocument}
          repairs={groupedRepairs}
          toggledYears={toggledYears}
          clientLogo={clientLogo}
          siteId={siteId}
        />
        <BidSheetContent>
          <BidSheetSideBar
            repairs={groupedRepairs}
            screenshotRepairs={groupedRepairsScreenshots}
            zoneMapScreenshot={zoneMapScreenshot}
            propertyScreenshot={propertyScreenshot}
            siteId={siteId}
          />
          <BidSheetPreview>
            <BidSheetPDF
              values={{ color, textValues, checkboxValues }}
              clientLogo={clientLogo}
              logoPermitted={siteLogoPermitted}
              siteDetail={siteDetailCopy}
              repairs={groupedRepairs}
              screenshotRepairs={groupedRepairsScreenshots}
              zones={zonesCompleted}
              currentStep={0}
              toggledYears={toggledYears}
              handleDocumentLoad={this.onDocumentLoad}
              pdfDocument={pdfDocument}
              zoneMapScreenshot={zoneMapScreenshot}
              propertyScreenshot={propertyScreenshot}
              siteId={siteId}
              siteName={siteDetailCopy.name}
            />
          </BidSheetPreview>
        </BidSheetContent>

      </BidSheetWrapper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  repairs: makeSelectSiteRepairs(),
  zones: makeSelectZones(),
  siteDetail: DetailData(),
  isBidSheetLoading: makeSelectBidSheetLoading(),
  bidSheetValues: makeSelectBidSheetValues(),
  screenshots: makeSelectScreenshots(),
  screenshotsError: makeSelectScreenshotError(),
});

const mapDispatchToProps = (dispatch) => ({
  getRepairsRequest: (filter) => dispatch(siteRepairActions.getSiteRepairsRequest(filter)),
  getZonesRequest: (filter) => dispatch(siteZonesActions.getZonesRequest(filter)),
  getZoneOptions: (payload) => dispatch(siteZonesActions.getZoneOptionsRequest(payload)),
  getSiteDetail: (id) => dispatch(fetchDetail(id)),
  getBidSheetValues: (clientId) => dispatch(bidSheetActions.getBidSheetRequest(clientId)),
  clearBidSheetValues: () => dispatch(bidSheetActions.clearBidSheetValues()),
  getSiteScreenshots: (params) => dispatch(siteScreenshotActions.getSiteScreenshotRequest(params)),
  clearSiteScreenshots: () => dispatch(siteScreenshotActions.clearSiteScreenshot()),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

SiteBidSheet.propTypes = {
  route: PropTypes.object,
  getRepairsRequest: PropTypes.func,
  getZonesRequest: PropTypes.func,
  getZoneOptions: PropTypes.func,
  getSiteDetail: PropTypes.func,
  siteDetail: PropTypes.any,
  repairs: PropTypes.any,
  zones: PropTypes.any,
  isBidSheetLoading: PropTypes.bool,
  clearBidSheetValues: PropTypes.func,
  getSiteScreenshots: PropTypes.func,
  clearSiteScreenshots: PropTypes.func,
  screenshots: PropTypes.any,
};

export default compose(
    withRedux
)(SiteBidSheet);
