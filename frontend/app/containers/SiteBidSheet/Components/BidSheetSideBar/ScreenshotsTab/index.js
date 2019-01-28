import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import cloneDeep from 'lodash/cloneDeep';

import ImageUploader from '../../../../../components/ImageUploader';
import { ScreenshotsWrapper, ScreenshotContent } from './styled';
import { actions as siteScreenshotActions } from '../../../../../appReducer/siteScreenshot.reducer';
import { makeSelectScreenshotLoading, makeSelectScreenshotError } from '../../../../../appSelector/siteScreenshot';
import LoadingIndicator from '../../../../../components/LoadingIndicator';

class ScreenshotsTab extends React.Component {
  state = {
    repairs: null,
    propertyScreenshot: null,
    screenshotRepairs: null,
    zoneMapScreenshot: null,
  }

  componentWillMount() {
    this.onStablishState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.onStablishState(nextProps);
  }

  onStablishState(props) {
    const { repairs, propertyScreenshot, screenshotRepairs, zoneMapScreenshot } = props;
    this.setState({ repairs, propertyScreenshot, screenshotRepairs, zoneMapScreenshot });
  }

  onChangeScreenshot = (layerType) => (file) => {
    const { siteId, addSiteScreenshot } = this.props;

    const params = {
      file,
      siteId,
      layerId: layerType,
    };

    addSiteScreenshot(params);
  }

  onDeleteScreenshot = (screenshot, isRepair) => () => {
    const clonedState = cloneDeep(this.state);
    if (isRepair) {
      clonedState.screenshotRepairs[screenshot] = null;
    } else {
      clonedState[screenshot] = null;
    }
    this.setState(clonedState);
  }

  renderRepairs = () => {
    const { repairs = [], screenshotRepairs = [] } = this.state;
    return Object.keys(repairs).map((repair) => (
      <ScreenshotContent key={repair}>
        <p>{repair}</p>
        <ImageUploader
          imageFile={screenshotRepairs[repair] && screenshotRepairs[repair].bidSheetPhotoUrl}
          width="160px"
          height="160px"
          hasIcon={false}
          onChange={this.onChangeScreenshot(repair)}
          onDelete={this.onDeleteScreenshot(repair, true)}
        />
      </ScreenshotContent>
    ));
  }

  render() {
    const { repairs, propertyScreenshot, screenshotRepairs, zoneMapScreenshot } = this.state;

    if (!repairs || !screenshotRepairs) return <LoadingIndicator />;

    return (
      <ScreenshotsWrapper>
        <ScreenshotContent>
          <p>Property Map</p>
          <ImageUploader
            imageFile={propertyScreenshot && propertyScreenshot.bidSheetPhotoUrl}
            width="160px"
            height="160px"
            hasIcon={false}
            onChange={this.onChangeScreenshot('property')}
            onDelete={this.onDeleteScreenshot('propertyScreenshot')}
          />
        </ScreenshotContent>
        <ScreenshotContent>
          <p>Zone Map</p>
          <ImageUploader
            imageFile={zoneMapScreenshot && zoneMapScreenshot.bidSheetPhotoUrl}
            width="160px"
            height="160px"
            hasIcon={false}
            onChange={this.onChangeScreenshot('ZoneMap')}
            onDelete={this.onDeleteScreenshot('zoneMapScreenshot')}
          />
        </ScreenshotContent>
        {this.renderRepairs()}
      </ScreenshotsWrapper>
    );
  }
}

ScreenshotsTab.propTypes = {
  siteId: PropTypes.string.isRequired,
  addSiteScreenshot: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addSiteScreenshot: (data) => dispatch(siteScreenshotActions.addSiteScreenshotRequest(data)),
  clearSiteScreenshot: () => dispatch(siteScreenshotActions.clearSiteScreenshot()),
});

const mapStateToProps = createStructuredSelector({
  isScreenshotLoading: makeSelectScreenshotLoading,
  screenshotError: makeSelectScreenshotError,
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreenshotsTab);
