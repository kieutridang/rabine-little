import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PropTypes from 'prop-types';

import SwitchUI from 'components/Switch';
import { BidSheetHeaderContainer, SaveButtonContainer, SwitchYearContainer } from './styled';
import HeaderTitle from '../../../../components/Title/HeaderTitle';
import Button from '../../../../components/Button';
import sortYears from '../../utils/sortYears';
import { generateXLS } from '../BidSpreadSheet';
import { actions as siteScreenshotActions } from '../../../../appReducer/siteScreenshot.reducer';
import { actions as sitePdfAction } from '../../../../appReducer/sitePdf.reducer';
import { makeSelectScreenshotLoading, makeSelectScreenshotError } from '../../../../appSelector/siteScreenshot';

class BidSheetHeader extends React.Component {

  getYearsFromRepairs = (repairs) => {
    const years = Object.keys(repairs);

    sortYears(years);

    const objYears = years.map((year) => ({ label: year, value: year, disabled: false }));

    return objYears;
  }

  updateSaveBtn(disable) {
    this.setState({ disableSave: disable });
  }

  downloadPDF = () => {
    const { siteName, documentUrl } = this.props;
    if (documentUrl) {
      const element = document.createElement('a');
      element.setAttribute('href', documentUrl);
      element.setAttribute('download', `${siteName} bid sheet.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  downloadXLS = () => {
    const {
      siteName,
      repairs,
      toggledYears,
      siteAddress,
      clientLogo,
    } = this.props;

    generateXLS(repairs, toggledYears, `${siteName} Bid Sheet`, siteAddress, clientLogo);
  }

  savePDF = () => {
    const { siteId, siteName, documentUrl, addSitePdf } = this.props;
    addSitePdf({ siteId, siteName, documentUrl });
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { handleChangeYear, siteName, repairs } = this.props;
    const yearsSwitch = this.getYearsFromRepairs(repairs);
    return (
      <BidSheetHeaderContainer>
        <HeaderTitle title="Bid Sheet Generator" subtitle={siteName} />
        <SwitchYearContainer>
          <FormGroup row>
            {
              yearsSwitch.map((sw) => (
                <SwitchUI
                  label={sw.label}
                  onChange={handleChangeYear}
                  value={sw.value}
                  disabled={sw.disabled}
                  key={JSON.stringify(sw)}
                />
              ))
            }
          </FormGroup>
        </SwitchYearContainer>
        <SaveButtonContainer>
          <Button
            color="secondary"
            label="DOWNLOAD .XSL"
            width="8.1rem"
            height="2.5rem"
            onClick={this.downloadXLS}
          />
          <Button
            color="secondary"
            label="DOWNLOAD"
            width="6.1rem"
            height="2.5rem"
            onClick={this.downloadPDF}
          />
          <Button
            color="secondary"
            label="SAVE"
            width="6.1rem"
            height="2.5rem"
            onClick={this.savePDF}
          />
        </SaveButtonContainer>
      </BidSheetHeaderContainer>
    );
  }
}

BidSheetHeader.propTypes = {
  handleChangeYear: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  documentUrl: PropTypes.string,
  repairs: PropTypes.object,
  toggledYears: PropTypes.array,
  siteAddress: PropTypes.string,
  clientLogo: PropTypes.object,
  siteId: PropTypes.string,
  addSitePdf: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  isScreenshotLoading: makeSelectScreenshotLoading,
  screenshotError: makeSelectScreenshotError,
});

const mapDispatchToProps = (dispatch) => ({
  addSiteScreenshot: (data) => dispatch(siteScreenshotActions.addSiteScreenshotRequest(data)),
  clearSiteScreenshot: () => dispatch(siteScreenshotActions.clearSiteScreenshot()),
  addSitePdf: (data) => dispatch(sitePdfAction.addSitePdfRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BidSheetHeader);
