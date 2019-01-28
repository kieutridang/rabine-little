import React, { Component } from 'react';
import _ from 'lodash';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import LoadingIndicator from 'components/LoadingIndicator';
import { actions as bidSheetActions } from '../../appReducer/bidSheet.reducer';
import { makeSelectBidSheetValues, makeSelectBidSheetError, makeSelectBidSheetLoading, makeSelectBidSheetSaved } from '../../appSelector/bidSheet';
import {
    BidSheetCreatorContent,
    BidSheetHeader,
    BidSheetWrapper,
    BidSheetInfo,
    BidSheetStepper,
    BidSheetOptions,
    SaveButtonContainer,
    NextButtonContainer,
    BidSheetPreview,
} from './Components/Styled';
import HeaderTitle from '../../components/Title/HeaderTitle';
import GeneratorSteps from './Components/GeneratorSteps/GeneratorSteps';
import OverviewStep from './Components/OverviewStep';
import ZonesStep from './Components/ZonesStep';
import RepairStep from './Components/RepairStep';
import BidSheetPDF from './Components/BidSheetPDF/Loadable';
import Button from '../../components/Button';
import { stepsPDFGenerator } from '../Common/Options';
import { getBlobFromBlobURL, getBase64FromBlob } from '../../utils/files/fileUtils';
import setLogoClientURL from '../SiteBidSheet/utils/setLogoClientURL';

class ClientBidSheet extends Component {

  static getDerivedStateFromProps(props, state) {
    if (!props.isLoading && props.templateValues && !state.loadedFromStore) {
      const bidSheetData = _.cloneDeep(props.templateValues.bidSheetData);
      if (!_.isEmpty(bidSheetData)) {
        const data = setLogoClientURL(bidSheetData);

        return { ...data };
      }
    }
    return null;
  }

  state={
    generatorStep: 0,
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
    clientLogoBase64: null,
    siteLogoPermitted: true,
    saveMessage: false,
    loadedFromStore: false,
  };

  componentDidMount() {
    const { getBidSheetValues } = this.props;
    const { clientId } = this.props.route.match.params;

    getBidSheetValues(clientId);
  }

  componentWillUnmount() {
    const { clearBidSheetValues } = this.props;
    clearBidSheetValues();
  }

  getIndex = (key) => stepsPDFGenerator.findIndex((item) => item.value === key);

  getLabel = (key) => {
    const index = stepsPDFGenerator.findIndex((item) => item.value === key);

    if (index !== -1) {
      return stepsPDFGenerator[index].text;
    }

    return '';
  };

  handleClose = () => this.setState({ saveMessage: false });

  changeLogoPermittedStatus = () => {
    this.setState((prevState) => ({
      siteLogoPermitted: !prevState.siteLogoPermitted,
    }));
  };

  handleChangeText = (evt) => {
    const textValues = _.clone(this.state.textValues);
    const key = evt.target.name;
    textValues[key] = evt.target.value;
    this.setState({ textValues });
  };

  handleFile = (files) => {
    const file = files[0];

    const clientLogo = _.clone(this.state.clientLogo);
    clientLogo.blobUrl = file.preview;
    clientLogo.mimeType = file.type;
    clientLogo.size = file.size;
    clientLogo.name = file.name;

    this.setState({ clientLogo });
  };

  handleChangeCheckboxRepairs = (evt) => {
    const checkboxValues = _.clone(this.state.checkboxValues);
    checkboxValues.repairs[evt.target.name] = evt.target.checked;
    this.setState({ checkboxValues });
  };

  handleChangeCheckboxZones = (evt) => {
    const checkboxValues = _.clone(this.state.checkboxValues);
    checkboxValues.zones[evt.target.name] = evt.target.checked;
    this.setState({ checkboxValues });
  };

  nextStep = () => {
    const { generatorStep } = this.state;

    if (generatorStep >= 2) return;

    this.setState({ generatorStep: generatorStep + 1 });
  };

  backStep = () => {
    const { generatorStep } = this.state;

    if (generatorStep <= 0) return;

    this.setState({
      generatorStep: generatorStep - 1,
    });
  };

  changeStep(payload) {
    console.log(payload); // eslint-disable-line no-console
  }

  handleChangeColor = (evt) => {
    this.setState({ color: evt.color });
  };

  createSitePayload = (oldStatus, newStatus) => ({
    title: this.getLabel(oldStatus),
    notes: `Change status from ${this.getLabel(oldStatus)} to ${this.getLabel(newStatus)}`,
    oldStatus,
    newStatus,
    newIndex: this.getIndex(newStatus),
    oldIndex: this.getIndex(oldStatus),
    type: 'status_changed',
  });

  saveValues = () => {
    const { color, siteLogoPermitted } = this.state;
    const { addBidSheetValues } = this.props;
    const textValues = _.clone(this.state.textValues);
    const checkboxValues = _.cloneDeep(this.state.checkboxValues);
    const clientLogo = _.clone(this.state.clientLogo);

    getBlobFromBlobURL(clientLogo.blobUrl)
      .then((res) => {
        delete clientLogo.blobUrl;
        getBase64FromBlob(res)
          .then((clientLogoBase64) => {
            const { clientId } = this.props.route.match.params;
            const body = {
              color,
              siteLogoPermitted,
              textValues,
              checkboxValues,
              clientLogo,
              clientLogoBase64,
            };

            addBidSheetValues({ clientId, body });
          });
      });
  };

  renderHeader() {
    return (
      <BidSheetHeader>
        <HeaderTitle title="Bid Sheet Template Creator" />
        <SaveButtonContainer>
          <Button
            color="primary"
            label="SAVE"
            width="8.4375rem"
            height="2.5rem"
            onClick={this.saveValues}
          />
        </SaveButtonContainer>
      </BidSheetHeader>
    );
  }

  renderStepper() {
    const { generatorStep } = this.state;

    return (
      <BidSheetStepper>
        <GeneratorSteps
          activeStep={generatorStep}
          handleChangeStep={this.changeStep}
          payload={this.createSitePayload}
          steps={stepsPDFGenerator}
        />
      </BidSheetStepper>
    );
  }

  renderNextButton() {
    const { generatorStep } = this.state;

    if (generatorStep === 2) {
      return (
        <NextButtonContainer>
          <Button
            color="secondary"
            label="BACK"
            width="8.4375rem"
            height="2.5rem"
            onClick={this.backStep}
          />
        </NextButtonContainer>
      );
    } else if (generatorStep > 0) {
      return (
        <NextButtonContainer>
          <Button
            color="secondary"
            label="BACK"
            width="8.4375rem"
            height="2.5rem"
            onClick={this.backStep}
          />
          <Button
            color="primary"
            label="NEXT"
            width="8.4375rem"
            height="2.5rem"
            onClick={this.nextStep}
          />
        </NextButtonContainer>
      );
    }
    return (
      <NextButtonContainer>
        <Button
          color="primary"
          label="NEXT"
          width="8.4375rem"
          height="2.5rem"
          onClick={this.nextStep}
        />
      </NextButtonContainer>
    );
  }


  renderCurrentStep() {
    const { generatorStep, siteLogoPermitted } = this.state;
    const textValuesCopy = _.clone(this.state.textValues);
    const checkboxValuesCopy = _.clone(this.state.checkboxValues);

    switch (generatorStep) {
      case 0:
        return (
          <BidSheetOptions>
            <OverviewStep
              handleChangeColor={this.handleChangeColor}
              handleChangeText={this.handleChangeText}
              inputValues={{ text1: textValuesCopy.text1, text2: textValuesCopy.text2 }}
              handleFile={this.handleFile}
              changeLogoPermittedStatus={this.changeLogoPermittedStatus}
              isLogoPermitted={siteLogoPermitted}
            />
          </BidSheetOptions>
        );

      case 1:
        return (
          <BidSheetOptions>
            <ZonesStep
              handleChangeText={this.handleChangeText}
              inputValues={{ text3: textValuesCopy.text3, text4: textValuesCopy.text4 }}
              handleChangeCheckbox={this.handleChangeCheckboxZones}
              checkboxInputValues={checkboxValuesCopy.zones}
            />
          </BidSheetOptions>
        );
      case 2:
        return (
          <BidSheetOptions>
            <RepairStep
              handleChangeCheckbox={this.handleChangeCheckboxRepairs}
              checkboxInputValues={checkboxValuesCopy.repairs}
              handleChangeText={this.handleChangeText}
              inputValues={{ text5: textValuesCopy.text5 }}
            />
          </BidSheetOptions>
        );

      default:
        return (
          <BidSheetOptions>
            <OverviewStep
              handleChangeColor={this.handleChangeColor}
              handleChangeText={this.handleChangeText}
              inputValues={{ text1: textValuesCopy.text1, text2: textValuesCopy.text2 }}
            />
          </BidSheetOptions>
        );
    }
  }

  render() {
    const {
      color,
      textValues,
      generatorStep,
      checkboxValues,
      clientLogo,
      siteLogoPermitted,
      saveMessage,
    } = this.state;

    const { isLoading } = this.props;

    return (
      <BidSheetWrapper>
        {this.renderHeader()}
        <BidSheetCreatorContent>
          <BidSheetInfo>
            { this.renderStepper() }
            { this.renderCurrentStep() }
            { this.renderNextButton() }
          </BidSheetInfo>

          { isLoading ? <LoadingIndicator /> :
          <BidSheetPreview>
            <BidSheetPDF
              values={{ color, textValues, checkboxValues }}
              currentStep={generatorStep}
              clientLogo={clientLogo}
              logoPermitted={siteLogoPermitted}
            />
          </BidSheetPreview>
          }

        </BidSheetCreatorContent>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={saveMessage}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Template saved successfully</span>}
        />
      </BidSheetWrapper>
    );
  }
}

ClientBidSheet.propTypes = {
  route: PropTypes.object.isRequired,
  getBidSheetValues: PropTypes.func,
  addBidSheetValues: PropTypes.func,
  clearBidSheetValues: PropTypes.func,
  isLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectBidSheetLoading(),
  templateValues: makeSelectBidSheetValues(),
  templateError: makeSelectBidSheetError(),
  templateSaved: makeSelectBidSheetSaved(),
});

const mapDispatchToProps = (dispatch) => ({
  getBidSheetValues: (clientId) => dispatch(bidSheetActions.getBidSheetRequest(clientId)),
  addBidSheetValues: (payload) => dispatch(bidSheetActions.addBidSheetRequest(payload)),
  clearBidSheetValues: () => dispatch(bidSheetActions.clearBidSheetValues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientBidSheet);
